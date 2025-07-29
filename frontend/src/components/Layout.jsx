import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const Layout = () => {
    return (
        <main>
            <Sidebar />
            <Outlet />
        </main>
    );
};

export default Layout;
