import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeStorage } from './utils/storage';
import Sidebar from './components/Sidebar';

// Import screens
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import CustomerList from './screens/CustomerList';
import CustomerDetail from './screens/CustomerDetail';
import OrderList from './screens/OrderList';
import OrderDetail from './screens/OrderDetail';
import OrderStatus from './screens/OrderStatus';
import PaymentReceipt from './screens/PaymentReceipt';
import MonthlyBilling from './screens/MonthlyBilling';
import MonthlyBillDetail from './screens/MonthlyBillDetail';
import DeliveryPerson from './screens/DeliveryPerson';
import CategoryManagement from './screens/CategoryManagement';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <Dashboard />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/customers" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <CustomerList />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/customer/:customerId" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <CustomerDetail />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/orders" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <OrderList />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/order/:orderId" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <OrderDetail />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/order-status/:orderId?" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <OrderStatus />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/payments/:orderId?" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <PaymentReceipt />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/monthly-billing" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <MonthlyBilling />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/monthly-bill/:billId" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <MonthlyBillDetail />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/delivery-persons" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <DeliveryPerson />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/categories" element={
            <PrivateRoute>
              <>
                <Sidebar />
                <CategoryManagement />
              </>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;