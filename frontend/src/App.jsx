import { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import { getUserData } from './utils/Utils';
import Layout from './components/Layout';
import Home from './pages/Home';
import Customers from './pages/Customers';
import CreateCustomer from './pages/CreateCustomer';
import UpdateCustomer from './pages/UpdateCustomer';
import Payees from './pages/Payees';
import CreatePayee from './pages/CreatePayee';
import UpdatePayee from './pages/UpdatePayee';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import ViewTransaction from './pages/ViewTransaction';

const App = () => {
  const getRedirectRoute = () => {
    const user = getUserData();
    if (user) {
        return <Navigate to="/home" replace />;
    } else {
        return <Navigate to="/login" replace />;
    }
}
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getRedirectRoute()} />
          <Route path="home" element={<Home />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/create" element={<CreateCustomer />} />
          <Route path="customers/update/:id" element={<UpdateCustomer />} />
          <Route path="payees" element={<Payees />} />
          <Route path="payees/create" element={<CreatePayee />} />
          <Route path="payees/update/:id" element={<UpdatePayee />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<ViewTransaction />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
