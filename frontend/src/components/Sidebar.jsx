import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Logo } from './Logo';
import { logout } from '../redux/api/userSlice';
import { setPage } from '../redux/api/pageSlice';

export const Sidebar = () => {
    const user = useSelector((state) => state.userState.user);
    const page = useSelector((state) => state.page.currentPage);
    const dispatch = useDispatch();

    const handleClick = (targetPage) => {
        if (targetPage) {
            dispatch(setPage(targetPage));
        } else {
            dispatch(logout());
        }
    };

    return (
        <main>
            <section id="side-menu">
                <Logo />
                <ul>
                    <SideLink onClick={handleClick} active={page} page="home" icon="bx bx-home" text="Home" />
                    <SideLink onClick={handleClick} active={page} page="create-account" icon="bx bx-user-pin" text="Create Account" />
                    <SideLink onClick={handleClick} active={page} page="transfer" icon="bx bx-transfer" text="Fund Transfer" />
                    <SideLink onClick={handleClick} active={page} page="deposit" icon="bx bx-money" text="Deposit" />
                    <SideLink onClick={handleClick} active={page} page="withdraw" icon="bx bx-log-out-circle" text="Withdraw" />
                    <SideLink onClick={handleClick} active={page} icon="bx bx-log-out" text="Logout" />
                </ul>
            </section>
        </main>

    );
};

const SideLink = ({ icon, text, page, active, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onClick(page);
    };

    return (
        <li>
            <a href="#" onClick={handleClick} className={active === page ? 'active' : ''}>
                <i className={icon}></i> {text}
            </a>
        </li>
    );
};
