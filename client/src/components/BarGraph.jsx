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
            data: Array(12).fill(0), // Initialize all months with 0 spending
        }],
    });

    useEffect(() => {
        const fetchYearlyTransactionData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/transactions/fetch_yearly_transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the stored token for authorization
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { transactions } = await response.json(); // Destructure to directly get transactions array

                // Initialize monthly spendings object
                const monthlySpendings = Array(12).fill(0);

                transactions.forEach(({ date, amount }) => {
                    const monthIndex = new Date(date).getMonth(); // getMonth() returns 0-11
                    monthlySpendings[monthIndex] += amount; // Sum up amounts for each month
                });

                // Update state with processed data for the chart
                setTransactionData(prevData => ({
                    ...prevData,
                    datasets: [{
                        ...prevData.datasets[0],
                        data: monthlySpendings, // Array of summed amounts for each month
                    }],
                }));
            } catch (error) {
                console.error('Failed to fetch transaction data:', error);
                // Handle error here
            }
        };

        fetchYearlyTransactionData();
    }, []);

    return (
        <div>
            <h2 style={{  textAlign: 'center', marginBottom: '20px' }}>Yearly Spending Overview</h2>
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
