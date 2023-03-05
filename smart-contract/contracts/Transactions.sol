// SPDX-License-Identifier: UNLICENSED

// NOTE: We lose some Ethereum gas fees when we deploy the contract

pragma solidity ^0.8.0;

contract Transactions {
    // Difference in solidity vs JS
    // Solidity - Statically typed language

    uint256 transactionCount;

    event Transfer(
        address from,
        address to,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct TransferStruct {
        address from;
        address to;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    // Define an array of TransferStruct
    TransferStruct[] transactions;

    function addToBlockChain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCount += 1;
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );
        // The above do not make the transaction happen
        // The below makes the transaction happen
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
