import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarGraph = () => {
    const [transactionData, setTransactionData] = useState({
        labels: Object.keys(Array.from({ length: 12 })).map((_, i) =>
            new Date(0, i).toLocaleString('default', { month: 'long' })
        ),
        datasets: [{
            label: 'Monthly Spending',
            backgroundColor: '#5C6BC0',
            borderColor: '#3F51B5',
            borderWidth: 1,
            hoverBackgroundColor: '#3F51B5',
            hoverBorderColor: '#303F9F',
            data: Array(12).fill(0),
        }],
    });

    useEffect(() => {
        const fetchYearlyTransactionData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/transactions/fetch_yearly_transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { transactions } = await response.json();

                // Initialize monthly spendings object
                const monthlySpendings = Array(12).fill(0);

                transactions.forEach(({ date, amount }) => {
                    const transactionDate = new Date(date + 'Z'); // Appending 'Z' to indicate UTC time
                    const monthIndex = transactionDate.getUTCMonth();
                    monthlySpendings[monthIndex] += amount;
                });

                setTransactionData(prevData => ({
                    ...prevData,
                    datasets: [{
                        ...prevData.datasets[0],
                        data: monthlySpendings,
                    }],
                }));
            } catch (error) {
                console.error('Failed to fetch transaction data:', error);
            }
        };

        fetchYearlyTransactionData();
    }, []);

    return (
        <div className="bg-white text-black p-4 rounded-sm w-full inline-block border-1 border-black shadow-lg">
            <h2 className="text-sm font-semibold text-left mb-4">Yearly Spending Overview</h2>
            <Bar
                data={transactionData}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarGraph;
