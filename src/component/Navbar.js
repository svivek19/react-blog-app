import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useMediaQuery } from 'react-responsive';
import Settings from './Settings';

function Navbar({ isAuth, setIsAuth }) {
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            setIsAuth(false);
            window.location.pathname = '/login';
        });
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };



    return (
        <div>
            <div className='hidden md:block'>
                <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:bg-[#0369A1] dark:border-none bg-violet-50">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Link to={'/'}>
                                <img src="https://freepngimg.com/save/36006-anonymous/500x500" className="h-10" alt="brand Logo" />
                            </Link>
                            <Link to={'/'} className="self-center text-2xl font-semibold whitespace-nowrap font-mono hover:text-violet-800 dark:text-gray-300">VIVEK</Link>
                        </div>

                        {isMobile && (
                            <div className="md:hidden">
                                <button onClick={toggleMobileMenu} className="focus:outline-none">
                                    <span className="block text-2xl">&#9776;</span>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center space-x-4 md:order-2 md:space-x-0 rtl:space-x-reverse">
                            {!isAuth ? (
                                <Link
                                    to={'/login'}
                                    className="bg-blue-700 hover:bg-blue-800 dark:bg-white dark:text-slate-900 font-medium rounded-lg text-sm px-4 py-2 text-center text-white ${location.pathname === '/login' && 'bg-blue-800'"
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                            ) : (
                                <Link
                                    className="bg-red-500 hover:bg-red-700 dark:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 text-center text-white ${location.pathname === '/logout' && 'bg-red-700'"
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                >
                                    Logout
                                </Link>
                            )}
                            <div>
                                <Settings/>
                            </div>
                        </div>
                        {!isMobile && (
                            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gradark:border-gray-700">
                                    <li>
                                        <NavLink
                                            to={'/'}
                                            className={`dark:text-gray-100 hover:text-violet-800 ${location.pathname === '/' && 'text-violet-800 dark:text-gray-100'}`}
                                            aria-current="page"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    {isAuth && (
                                        <ul className='flex'>
                                            <li>
                                                <NavLink
                                                    to={'/createpost'}
                                                    className={`dark:text-gray-100 hover:text-violet-800 mr-8 ${location.pathname === '/createpost' && 'text-violet-800 dark:text-gray-100'}`}
                                                    aria-current="page"
                                                >
                                                    Create Blog
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to={'/dashboard'}
                                                    className={`dark:text-gray-100 hover:text-violet-800 ${location.pathname === '/dashboard' && 'text-violet-800 dark:text-gray-100'}`}
                                                    aria-current="page"
                                                >
                                                    Dashboard
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}

                                    <li>
                                        <NavLink
                                            to={'/help'}
                                            className={`dark:text-gray-100 hover:text-violet-800 ${location.pathname === '/help' && 'text-violet-800 dark:text-gray-100'}`}
                                            aria-current="page"
                                        >
                                            Help
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            <div className='block md:hidden'>
                <nav className="fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:bg-[#0369A1] dark:border-none bg-slate-50">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Link to={'/'}>
                                <img src="https://freepngimg.com/save/36006-anonymous/500x500" className="h-10" alt="brand Logo" />
                            </Link>
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-slate-200 font-mono">VIVEK</span>
                        </div>

                        {isMobile && (
                            <div className="md:hidden flex items-center space-x-4">
                                <button onClick={toggleMobileMenu} >
                                    <span className="block text-2xl">&#9776;</span>
                                </button>
                                {!isAuth ? (
                                    <Link
                                        to={'/login'}
                                        className={`bg-blue-700 hover:bg-blue-800 dark:bg-white dark:text-slate-800 font-medium rounded-lg text-sm px-4 py-2 text-center text-white ${location.pathname === '/login' && 'bg-blue-800'
                                            }`}
                                        onClick={closeMobileMenu}
                                    >
                                        Login
                                    </Link>
                                ) : (
                                    <Link
                                        className={`bg-red-500 hover:bg-red-700 font-medium rounded-lg dark:bg-red-700 text-sm px-4 py-2 text-center text-white ${location.pathname === '/logout' && 'bg-red-700'
                                            }`}
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                    >
                                        Logout
                                    </Link>
                                )}
                                <div>
                                    <Settings/>
                                </div>
                            </div>
                        )}

                        {isMobile && (
                            <div className={`w-full mt-4 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                                {/* Mobile menu content */}
                                <div className={`w-full mt-4 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                                    <ul className="flex flex-col p-4 font-medium border dark:border-none border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:border-0 dark:bg-gradark:border-gray-700">
                                        <li>
                                            <NavLink
                                                to={'/'}
                                                className={`block py-2 px-3 rounded ${location.pathname === '/' && 'bg-violet-950 text-white dark:bg-white dark:text-slate-800'}`}
                                                aria-current="page"
                                                onClick={closeMobileMenu}
                                            >
                                                Home
                                            </NavLink>
                                        </li>
                                        {isAuth && (
                                            <>
                                            <li>
                                                <NavLink
                                                    to={'/createpost'}
                                                    className={`block py-2 px-3 rounded ${location.pathname === '/createpost' && 'bg-violet-950 text-white dark:bg-white dark:text-slate-800'}`}
                                                    aria-current="page"
                                                    onClick={closeMobileMenu}
                                                >
                                                    Create Blog
                                                </NavLink>
                                            </li>
                                             <li>
                                             <NavLink
                                                 to={'/dashboard'}
                                                 className={`block py-2 px-3 rounded ${location.pathname === '/dashboard' && 'bg-violet-950 text-white dark:bg-white dark:text-slate-800'}`}
                                                 aria-current="page"
                                                 onClick={closeMobileMenu}
                                             >
                                                 Dashboard
                                             </NavLink>
                                         </li>
                                            </>
                                        )}
                                       
                                        <li>
                                            <NavLink
                                                to={'/help'}
                                                className={`block py-2 px-3 rounded ${location.pathname === '/help' && 'bg-violet-950 text-white dark:bg-white dark:text-slate-800'}`}
                                                aria-current="page"
                                                onClick={closeMobileMenu}
                                            >
                                                Help
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
