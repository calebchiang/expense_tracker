import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaidLink from '../components/PlaidLink';

function BankConnect() {
    const navigate = useNavigate();
    const [linkToken, setLinkToken] = useState(null);

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
                setLinkToken(data.link_token)
            } else {
                console.error('Failed to fetch link token:', data);
            }
        } catch (error) {
            console.error('Error fetching link token:', error);
        }
    };


    const handleSignOutClick = () => {
        localStorage.removeItem('token');
        console.log('User signed out, token cleared.');
        navigate('/login');
    };

    const onSuccess = async (publicToken, metadata) => {
        try {
            const response = await fetch('http://localhost:3000/api/plaid/exchange_public_token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicToken }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Bank account linked successfully:', data);
            } else {
                console.error('Failed to exchange public token:', data);
            }
        } catch (error) {
            console.error('Error exchanging public token:', error);
        }
    };



    const onExit = (err, metadata) => {
        console.log('User exited Plaid Link.', err, metadata);
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="flex w-[30rem] flex-col items-center space-y-8 border-2 border-white p-8 rounded-lg shadow-lg">
                <div className="text-center text-2xl font-medium">
                    Looks like you haven't connected to a bank yet...
                </div>
                {/* The Connect to a Bank button will trigger the handleConnectClick function */}
                <button
                    onClick={handleConnectClick}
                    className="w-full transform rounded-md bg-blue-600 py-2 font-bold duration-300 hover:bg-blue-400"
                >
                    Connect to a Bank
                </button>
                {linkToken && (
                    <PlaidLink
                        linkToken={linkToken}
                        onSuccess={onSuccess}
                        onExit={onExit}
                    />
                )}
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
