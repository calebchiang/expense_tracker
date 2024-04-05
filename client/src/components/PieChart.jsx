import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components you will use
Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [chartData, setChartData] = useState({
        datasets: [],
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/api/transactions/fetch_yearly_transactions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(({ transactions }) => {
                const categoryTotals = transactions.reduce((acc, { category, amount }) => {
                    // Split the category by comma and trim whitespace, then take the first element
                    const broadCategory = category.split(',')[0].trim();
                    acc[broadCategory] = (acc[broadCategory] || 0) + amount;
                    return acc;
                }, {});

                console.log('Category Totals:', categoryTotals);

                const backgroundColors = [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F77825',
                    '#9966FF', '#00E676', '#FFC0CB', '#FF9F40', '#4D5360',
                    '#C9CBCF', '#7B7B7D', '#CDDC39', '#F44336', '#3F51B5',
                    '#E91E63', '#9C27B0', '#673AB7', '#3F729B', '#2196F3',
                    '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A',
                    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548',
                    '#9E9E9E', '#607D8B', '#000000', '#303F9F', '#FF1744',
                ];

                setChartData({
                    labels: Object.keys(categoryTotals),
                    datasets: [{
                        label: 'Yearly Expenses by Category',
                        data: Object.values(categoryTotals),
                        backgroundColor: backgroundColors.slice(0, Object.keys(categoryTotals).length),
                    }],
                });
            })
            .catch(error => console.error('Failed to fetch transaction data:', error));
    }, []);

    return (
        <div className="bg-white text-black p-4 rounded-sm w-full inline-block border-1 border-black shadow-lg">
            <h2 className="text-sm font-semibold">Yearly Expenses Breakdown</h2>
            <div style={{ position: 'relative', width: '600px', height: '400px' }}> {/* Directly set the width and height */}
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>
    );
};

export default PieChart;
