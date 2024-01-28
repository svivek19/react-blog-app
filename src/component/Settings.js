import React, { useState } from 'react';
import icon from '../assets/setting.png'
import { Link } from 'react-router-dom';

const Settings = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenu = (e) =>{
        e.stopPropagation();
        setIsMenuOpen(false)
    }

    return (
        <div className="relative md:ml-3">
            <div>
                <button
                    type="button"
                    className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                >
                    <img
                        className="h-8 w-8 rounded-full bg-transparent"
                        src={icon}
                        alt="setting-icon"
                    />
                </button>
            </div>

            {isMenuOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                >
                    <Link
                                            
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-0"
                        onClick={handleMenu}
                    >
                        Your Profile
                    </Link>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                        tabIndex="-1"
                        id="user-menu-item-1"
                        onClick={handleMenu}
                    >
                        Dark
                    </a>
                </div>
            )}
        </div>
    );
};

export default Settings;
