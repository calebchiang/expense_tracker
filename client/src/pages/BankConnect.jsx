import React from 'react';
import { useNavigate } from 'react-router-dom';
function BankConnect() {
    const navigate = useNavigate();

    const handleConnectClick = async () => {
        console.log("Connect to bank account button clicked");

        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("No token found, redirecting to login.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/plaid/create_link_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Link Token:', data.link_token);
                // Here, you would typically proceed to initialize Plaid Link with the obtained link_token
                // For example, you might save it to state, and then use it to open the Plaid Link modal
            } else {
                console.error('Failed to fetch link token:', data);
                // Handle errors, e.g., by showing an error message to the user
            }
        } catch (error) {
            console.error('Error fetching link token:', error);
            // Handle network errors, e.g., by showing an error message to the user
        }
    };


    const handleSignOutClick = () => {
        localStorage.removeItem('token');
        console.log('User signed out, token cleared.');
        navigate('/login');
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="flex w-[30rem] flex-col items-center space-y-8 border-2 border-white p-8 rounded-lg shadow-lg">
                <div className="text-center text-2xl font-medium">
                    Looks like you haven't connected to a bank yet...
                </div>
                <button
                    onClick={handleConnectClick}
                    className="w-full transform rounded-md bg-blue-600 py-2 font-bold duration-300 hover:bg-blue-400"
                >
                    Connect to a Bank
                </button>
                <button
                    onClick={handleSignOutClick}
                    className="w-full transform rounded-md bg-red-600 py-2 font-bold duration-300 hover:bg-red-400"
                >
                    Sign Out
                </button>
            </div>
        </main>
    );
}

export default BankConnect;
