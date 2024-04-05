import React, { useEffect, useState } from 'react';
import BarGraph from '../components/BarGraph';
import Sidebar from '../components/Sidebar';
import YearlyExpenses from '../components/YearlyExpenses';
import MonthlyExpenses from '../components/MonthlyExpenses';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);

    return (
        <div className="mx-auto w-full max-w-4xl py-8 px-4">
            <Sidebar className="w-64 h-screen bg-gray-800 text-white fixed inset-y-0 left-0" />
            <div className="flex my-4 space-x-4">
                <YearlyExpenses />
                <MonthlyExpenses />
            </div>
            <BarGraph />
        </div>
    );
}

export default Dashboard;
