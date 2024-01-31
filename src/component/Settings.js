import React, { useEffect, useState, useRef } from 'react';
import icon from '../assets/setting.png';
import { Link } from 'react-router-dom';
import img from '../assets/bg-svg.svg';

const Settings = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Retrieve dark mode preference from local storage or default to false
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });
  const [originalBackgroundImage, setOriginalBackgroundImage] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const bodyElement = document.body;

    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (darkMode) {
      // Store the original background image
      setOriginalBackgroundImage(bodyElement.style.backgroundImage);

      bodyElement.style.backgroundImage = 'none';
      bodyElement.style.backgroundColor = '#0a0d17';
      document.documentElement.classList.add('dark');
    } else {
      // Restore the original background image
      bodyElement.style.backgroundImage = originalBackgroundImage || img;
      bodyElement.style.backgroundColor = '';
      document.documentElement.classList.remove('dark');
    }

    document.addEventListener('click', handleOutsideClick);

    // Cleanup: Restore the original background image and remove event listener
    return () => {
      bodyElement.style.backgroundImage = originalBackgroundImage;
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [darkMode, originalBackgroundImage]);

  useEffect(() => {
    // Save dark mode preference to local storage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative md:ml-3" ref={dropdownRef}>
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
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-violet-50 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex="-1"
        >
          <Link
            to={'/userprofile'}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-violet-100"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-0"
            onClick={handleMenu}
          >
            Your Profile
          </Link>
          <button
            className="block px-4 py-2 w-full text-start text-sm text-gray-700 hover:bg-violet-100"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-1"
            onClick={() => {
              setDarkMode(!darkMode);
            }}
          >
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
