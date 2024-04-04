import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/transactions/fetch_monthly_transactions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setTransactions(data.transactions);
            })
            .catch(error => console.error('Error fetching transactions:', error));
    }, []);

    return (
        <div className="mx-auto w-full max-w-4xl py-8 px-4">
            <table className="w-full">
                <thead className="text-left">
                <tr className="border-b-2 border-indigo-500">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Category</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction, index) => (
                    <tr key={index}>
                        <td className="py-2">{transaction.date}</td>
                        <td>{transaction.name}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.category}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
