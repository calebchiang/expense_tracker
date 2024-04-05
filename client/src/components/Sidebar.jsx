import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHome } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = () =>{
    const navigate = useNavigate();
    const signOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-indigo-600 text-white shadow-lg">
            <>
                <SideBarIcon icon={<CiHome size="20" />} text="Go back to Dashboard" path='/dashboard' navigate={navigate}/>
                <SideBarIcon icon={<FaSignOutAlt size="20" />} text="Sign out" onClick={signOut} path='/' navigate={navigate} isSignOut={true}/>
            </>
        </div>
    );
};

const SideBarIcon = ({ icon, text = 'tooltip', path, navigate, onClick, isSignOut = false }) => { // Include isSignOut here and provide a default value
    const handleClick = () => {
        if (path && navigate) {
            navigate(path);
        }
        if (onClick) {
            onClick();
        }
    };

    // Determine the icon class based on isSignOut
    const iconClass = isSignOut ? 'sidebar-icon-signout' : 'sidebar-icon';

    return (
        <div className={iconClass} onClick={handleClick}>
            {icon}
            <span className="sidebar-tooltip group-hover:scale-100">
                {text}
            </span>
        </div>
    );
};

export default Sidebar;
