import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const OrderList = () => {
  const [orders] = useState(dummyData.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || order.orderSource === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-yellow-100 text-yellow-800';
      case 'Picked Up': return 'bg-purple-100 text-purple-800';
      case 'Order Placed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getSourceColor = (source) => {
    return source === 'Customer App' 
      ? 'bg-primary bg-opacity-10 text-primary' 
      : 'bg-accent bg-opacity-10 text-accent';
  };
  
  return (
    <div className="ml-64 p-6">
      <Header title="Order List" subtitle="View all orders (Read-only)" />
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 pr-4 py-2"
          />
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field py-2"
        >
          <option value="all">All Status</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Processing">Processing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="input-field py-2"
        >
          <option value="all">All Sources</option>
          <option value="Customer App">Customer App</option>
          <option value="Delivery App">Delivery App</option>
        </select>
        <div className="text-sm text-gray-500 flex items-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
      
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Customer Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Order Source</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Order Date & Time</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Payment Type</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Total Clothes</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{order.orderId}</td>
                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSourceColor(order.orderSource)}`}>
                      {order.orderSource}
                    </span>
                  </td>
                  <td className="p-4">{order.orderDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">{order.paymentType}</td>
                  <td className="p-4">{order.totalClothes}</td>
                  <td className="p-4 font-medium">₹{order.totalAmount}</td>
                  <td className="p-4">
                    <Link
                      to={`/order/${order.orderId}`}
                      className="text-primary hover:text-opacity-80 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your criteria
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <div className="flex items-start">
          <div className="text-yellow-800 text-lg mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-900">System Rules</h3>
            <p className="text-yellow-700 text-sm mt-1">
              ❌ No order creation in admin panel<br/>
              ❌ No ID generation in admin panel<br/>
              ✅ Orders created in Customer App / Delivery App only<br/>
              ✅ Item IDs generated in apps only (one per cloth)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;