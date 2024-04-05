import React, { useEffect, useState } from 'react';

const MonthlyExpenses = () => {
    const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/api/transactions/fetch_monthly_transactions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                // Ensure the response includes transactions
                if (data.transactions && Array.isArray(data.transactions)) {
                    const total = data.transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
                    setTotalMonthlyExpenses(total);
                }
            })
            .catch(error => console.error('Error fetching monthly transactions:', error));
    }, []);

    return (
        <div className="bg-white text-black p-4 rounded-sm w-auto inline-block border-1 border-black shadow-lg">
            <h2 className="text-sm font-semibold text-left">Total Monthly Expenses</h2>
            <p className="text-lg font-bold text-left">${totalMonthlyExpenses.toFixed(2)}</p>
        </div>
    );
};

export default MonthlyExpenses;
