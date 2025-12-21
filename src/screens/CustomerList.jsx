import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const CustomerList = () => {
  const [customers] = useState(dummyData.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthlyFilter, setMonthlyFilter] = useState('all');
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonthly = 
      monthlyFilter === 'all' || 
      (monthlyFilter === 'on' && customer.monthlyBilling === 'ON') ||
      (monthlyFilter === 'off' && customer.monthlyBilling === 'OFF');
    
    return matchesSearch && matchesMonthly;
  });
  
  return (
    <div className="ml-64 p-6">
      <Header title="Customer List" subtitle="Auto-created customer records from app logins" />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 pr-4 py-2 w-64"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          <select
            value={monthlyFilter}
            onChange={(e) => setMonthlyFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="all">All Billing Types</option>
            <option value="on">Monthly Billing ON</option>
            <option value="off">Monthly Billing OFF</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredCustomers.length} customers
        </div>
      </div>
      
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Customer Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Mobile Number</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Login Method</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Registration Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Last Login</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Total Orders</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Total Clothes</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Monthly Billing</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{customer.name}</td>
                  <td className="p-4">{customer.mobile}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.loginMethod === 'OTP' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {customer.loginMethod}
                    </span>
                  </td>
                  <td className="p-4">{customer.registrationDate}</td>
                  <td className="p-4">{customer.lastLogin}</td>
                  <td className="p-4">{customer.totalOrders}</td>
                  <td className="p-4">{customer.totalClothes}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      customer.monthlyBilling === 'ON' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.monthlyBilling}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/customer/${customer.id}`}
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
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No customers found matching your criteria
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <div className="text-blue-800 text-lg mr-3">ℹ️</div>
          <div>
            <h3 className="font-medium text-blue-900">System Information</h3>
            <p className="text-blue-700 text-sm mt-1">
              ❌ Admin does NOT add customers manually<br/>
              ✅ Customers are auto-created when they login via OTP or Email in the app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;