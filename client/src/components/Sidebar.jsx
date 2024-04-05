import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CiHome } from "react-icons/ci";

const Sidebar = () =>{
    const navigate = useNavigate();
    const signOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className={`fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-indigo-600 text-white shadow-lg`}>
            <>
                <SideBarIcon icon={<CiHome />} text="Go back to Dashboard" path='/dashboard' navigate={navigate}/>
            </>
        </div>
    );
};

    const SideBarIcon = ({ icon, text = 'tooltip', path, navigate, onClick }) => {
        const handleClick = () => {
            if (path && navigate) {
                navigate(path);
            }
            if (onClick) {
                onClick();
            }
        };

        return (
            <div className="sidebar-icon group" onClick={handleClick}>
                {icon}
                <span className="sidebar-tooltip group-hover:scale-100">
                {text}
            </span>
            </div>
        );
    };
    export default Sidebar;
