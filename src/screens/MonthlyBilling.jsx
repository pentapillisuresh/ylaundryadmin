import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const MonthlyBilling = () => {
  const [customers, setCustomers] = useState(dummyData.customers);
  const [monthlyBills] = useState(dummyData.monthlyBills);
  const [selectedMonth, setSelectedMonth] = useState('November 2023');
  
  const toggleBilling = (customerId) => {
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          monthlyBilling: customer.monthlyBilling === 'ON' ? 'OFF' : 'ON'
        };
      }
      return customer;
    }));
  };
  
  return (
    <div className="ml-64 p-6">
      <Header title="Monthly Billing Management" subtitle="Item-based monthly billing system" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Billing Toggle */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Billing Customers</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-4">
                Toggle monthly billing ON/OFF for customers. System will automatically collect delivered orders and existing Item IDs.
              </p>
            </div>
            
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.mobile}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {customer.totalOrders} orders, {customer.totalClothes} items
                    </span>
                    <div
                      onClick={() => toggleBilling(customer.id)}
                      className={`w-12 h-6 rounded-full cursor-pointer transition-all ${
                        customer.monthlyBilling === 'ON' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full mt-1 transition-all ${
                        customer.monthlyBilling === 'ON' ? 'ml-7' : 'ml-1'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Monthly Bills */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Bills</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option>November 2023</option>
                <option>October 2023</option>
                <option>September 2023</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            {monthlyBills.length > 0 ? (
              <div className="space-y-4">
                {monthlyBills.map((bill) => (
                  <div key={bill.billId + bill.customerId} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{bill.customerName}</h3>
                        <p className="text-sm text-gray-600">Bill ID: {bill.billId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bill.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Month:</span>
                        <p className="font-medium">{bill.month}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <p className="font-medium">₹{bill.totalAmount}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders:</span>
                        <p className="font-medium">{bill.orders.length}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <p className="font-medium">{bill.items}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Link
                        to={`/monthly-bill/${bill.billId}`}
                        className="text-primary hover:text-opacity-80 font-medium text-sm"
                      >
                        View Bill Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No monthly bills generated for {selectedMonth}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <div className="text-blue-800 text-lg mr-3">📅</div>
          <div>
            <h3 className="font-medium text-blue-900">Monthly Bill Generation Process</h3>
            <p className="text-blue-700 text-sm mt-1">
              1. Admin toggles Monthly Billing ON for customer<br/>
              2. System automatically collects:<br/>
                 • Delivered orders only<br/>
                 • Existing Item IDs (no new IDs created)<br/>
              3. Creates Monthly Bill ID only<br/>
              4. Item IDs stay same as app-generated<br/>
              <span className="font-bold mt-2 block">✅ No form submission<br/>❌ No ID generation in admin panel</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBilling;