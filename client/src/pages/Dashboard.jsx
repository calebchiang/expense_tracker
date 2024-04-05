import React, { useEffect, useState } from 'react';
import BarGraph from '../components/BarGraph';
import Sidebar from '../components/Sidebar';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);

    return (
        <div className="mx-auto w-full max-w-4xl py-8 px-4">
            <Sidebar className="w-64 h-screen bg-gray-800 text-white fixed inset-y-0 left-0" />
            <BarGraph />
        </div>
    );
}

export default Dashboard;
