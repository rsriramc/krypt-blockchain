import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

// To access the blockchain, we need to connect to a provider
const getEthereumContract = () => {
  // Get the provider from the window object
  const provider = new ethers.providers.Web3Provider(ethereum);
  // Get the signer from the provider
  const signer = provider.getSigner();
  // Get the contract instance, using the contract ABI and the contract address
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log("Transaction Contract: ", transactionContract);
  console.log({ provider, signer });
  return transactionContract;
};

const TransactionContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );

  const [transactions, setTransactions] = useState([]);

  const getAllTransactions = async () => {
    try {
      if (!ethereum) {
        return alert("Please install MetaMask first!");
      }
      const transactionContract = getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => {
          return {
            addressFrom: transaction.from,
            addressTo: transaction.to,
            amount: parseInt(transaction.amount._hex) * (10 ** -18),
            message: transaction.message,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            keyword: transaction.keyword,
          };
        }
      );

      console.log("Available Transactions: ", structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) {
      return alert("Please install MetaMask first!");
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("Accounts:", accounts);

    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
      getAllTransactions();
    } else {
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      if (!ethereum) {
        return alert("Please install MetaMask first!");
      }
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Please install MetaMask first!");
      }

      // Get all the accounts that the user has connected to the wallet
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get the first account that the user has connected to the wallet
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum wallet found");
    }
  };

  const sendTransaction = async (formData) => {
    try {
      if (!ethereum) {
        return alert("Please install MetaMask first!");
      }
      const { addressTo, amount, keyword, message } = formData;

      // This is the contract we wrote in the smart-contract folder
      //   This gives an instance of the contract
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      console.log("Parsed Amount: ", parsedAmount);

      // Just sends the transaction to the blockchain
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // all written in hex -> 21000 GWEI = 0.000021 ETH
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      console.log("Transaction Hash: ", transactionHash);

      setLoading(true);
      console.log("Transaction Loading");
      await transactionHash.wait();
      setLoading(false);
      console.log("Transaction Complete");

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

      getAllTransactions();
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum wallet found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  // Wrap the children in the context, and access the value object
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        sendTransaction,
        transactions,
        currentAccount,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContextProvider };
