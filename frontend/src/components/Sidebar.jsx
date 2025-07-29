import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/api/userSlice';

export const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <section id="side-menu">
            <Logo />
            <ul>
                {/* Home */}
                <li>
                    <Link
                        to="/home"
                        className={currentPath === '/home' ? 'active' : ''}
                    >
                        <i className="bx bx-home-alt"></i> Home
                    </Link>
                </li>

                {/* Customers */}
                <li>
                    <Link
                        to="/customers"
                        className={currentPath.includes('/customers') ? 'active' : ''}
                    >
                        <i className="bx bx-user"></i> Customers
                    </Link>
                </li>

                {/* Payees */}
                <li>
                    <Link
                        to="/payees"
                        className={currentPath.includes('/payees') ? 'active' : ''}
                    >
                        <i className="bx bx-group"></i> Payees
                    </Link>
                </li>

                {/* Transfer */}
                <li>
                    <Link
                        to="/transfer"
                        className={currentPath.includes('/transfer') ? 'active' : ''}
                    >
                        <i className="bx bx-transfer-alt"></i> Transfer
                    </Link>
                </li>

                {/* Transactions */}
                <li>
                    <Link
                        to="/transactions"
                        className={currentPath.includes('/transactions') ? 'active' : ''}
                    >
                        <i className="bx bx-list-ul"></i> Transactions
                    </Link>
                </li>

                {/* Logout */}
                <li>
                    <a
                        href="javascript:void(0);"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                    >
                        <i className="bx bx-log-out-circle"></i> Logout
                    </a>
                </li>
            </ul>
        </section>
    );
};
