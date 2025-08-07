import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useLogoutUserMutation } from '../redux/api/getMeAPI';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const [logoutUser, { isLoading, isSuccess, error, isError, data }] = useLogoutUserMutation();

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }
        if (isError) {
            const errorMsg = error?.data?.message || "Failed to logout";
            console.log(errorMsg)
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    const onLogoutHandler = () => {
        logoutUser();
    };

    return (
        <section id="side-menu">
            <a href='/'>
                <Logo />
            </a>
            
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

                {/* Deposit */}
                <li>
                    <Link
                        to="/deposit"
                        className={currentPath.includes('/deposit') ? 'active' : ''}
                    >
                        <i className="bx bx-money"></i> Deposit
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
                            onLogoutHandler();
                        }}
                    >
                        <i className="bx bx-log-out-circle"></i> Logout
                    </a>
                </li>
            </ul>
        </section>
    );
};
