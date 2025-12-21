import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { getStats, getData } from '../utils/data';

const Dashboard = () => {
  const [stats, setStats] = useState(getStats());
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  
  useEffect(() => {
    // Get data from storage
    const orders = getData('laundryOrders');
    const customers = getData('laundryCustomers');
    
    setRecentOrders(orders.slice(0, 5));
    setRecentCustomers(customers.slice(0, 5));
  }, []);
  
  const statsCards = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9A2.5 2.5 0 1121 7.5a2.5 2.5 0 01-2.5-2.5z" />
        </svg>
      ),
      title: "Total Customers",
      value: stats.totalCustomers,
      change: "+12 this month",
      color: "primary",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+8 today",
      color: "info",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: "Total Clothes",
      value: stats.totalClothes,
      change: "+42 today",
      color: "warning",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Delivered Orders",
      value: stats.deliveredOrders,
      change: "87% success rate",
      color: "success",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Pending Payments",
      value: `₹${stats.pendingPayments}`,
      change: "₹12,850 pending",
      color: "danger",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Monthly Billing",
      value: stats.monthlyBillingCustomers,
      change: "24% of customers",
      color: "primary",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    }
  ];
  
  return (
    <div className="ml-64 min-h-screen bg-gray-50 p-6">
      <Header 
        title="Dashboard" 
        subtitle="Overview of laundry management system" 
      />
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-sm text-gray-500 mt-2">{card.change}</p>
              </div>
              <div className={`${card.bgColor} ${card.textColor} p-3 rounded-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Processing' 
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Ready'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">₹{order.totalAmount}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders found
            </div>
          )}
        </div>
        
        {/* Active Customers Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Active Customers</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{customer.mobile}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.monthlyBilling === 'ON' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.monthlyBilling}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentCustomers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No customers found
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Stats Bar */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between text-white">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold">System Performance</h3>
            <p className="text-blue-100 text-sm">Real-time analytics and insights</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-blue-100 text-xs">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.8s</div>
              <div className="text-blue-100 text-xs">Avg. Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2.3k</div>
              <div className="text-blue-100 text-xs">Daily Visits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;