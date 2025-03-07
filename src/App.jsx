import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import 'antd/dist/reset.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="admin" element={
              <PrivateRoute adminRequired={true}>
                <AdminPage />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;