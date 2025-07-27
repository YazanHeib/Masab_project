import { Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import { getUserData } from './utils/Utils';
import Layout from './components/Layout';
import Home from './pages/Home';

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
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
