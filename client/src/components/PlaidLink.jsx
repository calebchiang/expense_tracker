import React, { useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = ({ linkToken, onSuccess, onExit }) => {
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (publicToken, metadata) => {
            // Additional processing or logging can go here
            console.log('Bank account linked successfully:', metadata);
            // Trigger the onSuccess prop with the publicToken
            onSuccess(publicToken, metadata);
        },
        onExit: (err, metadata) => {
            // Additional processing or logging on exit
            console.log('User exited Plaid Link:', err, metadata);
            // Trigger the onExit prop if it's provided
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

    // You can choose not to render anything since Plaid Link opens in a modal,
    // or keep a loading indicator until `ready` becomes `true`.
    return ready ? null : <p>Loading...</p>;
};

export default PlaidLink;
