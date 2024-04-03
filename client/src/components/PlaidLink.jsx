import React, { useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

const PlaidLink = ({ linkToken, onSuccess, onExit }) => {
    const navigate = useNavigate();
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (publicToken, metadata) => {
            console.log('Bank account linked successfully:', metadata);
            onSuccess(publicToken, metadata);
            navigate('/dashboard');
        },
        onExit: (err, metadata) => {
            console.log('User exited Plaid Link:', err, metadata);
            if (onExit) onExit(err, metadata);
        },
    });

    const handleOpenPlaid = useCallback(() => {
        if (ready) {
            open();
        }
    }, [open, ready]);

    // Automatically open Plaid Link when the component is ready and the linkToken is available
    useEffect(() => {
        handleOpenPlaid();
    }, [handleOpenPlaid]);

    return ready ? null : <p>Loading...</p>;
};

export default PlaidLink;
