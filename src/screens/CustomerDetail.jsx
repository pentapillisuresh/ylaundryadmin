import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Find customer
  const customer = dummyData.customers.find(c => c.id === customerId);
  
  if (!customer) {
    return (
      <div className="ml-64 p-6">
        <Header title="Customer Not Found" />
        <div className="table-container p-8 text-center">
          <p className="text-gray-500">Customer not found</p>
          <Link to="/customers" className="text-primary font-medium mt-4 inline-block">
            ← Back to Customers
          </Link>
        </div>
      </div>
    );
  }
  
  // Filter orders for this customer
  const customerOrders = dummyData.orders.filter(order => order.customerId === customerId);
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'monthly', label: 'Monthly Bills', icon: '📅' },
    { id: 'clothes', label: 'Clothes / Item History', icon: '👕' },
  ];
  
  return (
    <div className="ml-64 p-6">
      <Header 
        title={`Customer: ${customer.name}`} 
        subtitle="View customer details and history" 
      />
      
      <div className="mb-6">
        <Link to="/customers" className="text-primary hover:text-opacity-80 font-medium">
          ← Back to Customers
        </Link>
      </div>
      
      {/* Customer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold mt-2">{customer.totalOrders}</p>
            </div>
            <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clothes</p>
              <p className="text-2xl font-bold mt-2">{customer.totalClothes}</p>
            </div>
            <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">👕</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Monthly Billing</p>
              <p className="text-2xl font-bold mt-2">{customer.monthlyBilling}</p>
            </div>
            <div className="bg-warning w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Last Login</p>
              <p className="text-lg font-bold mt-2">{customer.lastLogin.split(' ')[0]}</p>
              <p className="text-sm text-gray-500">{customer.lastLogin.split(' ')[1]}</p>
            </div>
            <div className="bg-success w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🕒</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="table-container">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 text-sm">Customer ID:</span>
                    <p className="font-medium">{customer.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Name:</span>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Mobile:</span>
                    <p className="font-medium">{customer.mobile}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Login Method:</span>
                    <p className="font-medium">{customer.loginMethod}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Registration Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 text-sm">Registration Date:</span>
                    <p className="font-medium">{customer.registrationDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Last Login:</span>
                    <p className="font-medium">{customer.lastLogin}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Address:</span>
                    <p className="font-medium bg-gray-50 p-3 rounded text-sm">{customer.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Order History</h3>
              {customerOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Date</th>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Amount</th>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Items</th>
                        <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((order) => (
                        <tr key={order.orderId} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.orderId}</td>
                          <td className="p-4">{order.orderDate}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Ready' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-medium">₹{order.totalAmount}</td>
                          <td className="p-4">{order.totalClothes}</td>
                          <td className="p-4">
                            <Link
                              to={`/order/${order.orderId}`}
                              className="text-primary hover:text-opacity-80 font-medium text-sm"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders found for this customer
                </div>
              )}
            </div>
          )}
          
          {/* Monthly Bills Tab */}
          {activeTab === 'monthly' && (
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Monthly Billing History</h3>
              {customer.monthlyBilling === 'ON' ? (
                <div className="space-y-4">
                  {dummyData.monthlyBills
                    .filter(bill => bill.customerId === customerId)
                    .map((bill) => (
                      <div key={bill.billId} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{bill.month}</h4>
                            <p className="text-sm text-gray-600">Bill ID: {bill.billId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₹{bill.totalAmount}</p>
                            <span className={`text-sm ${
                              bill.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Orders:</span>
                            <p>{bill.orders.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Items:</span>
                            <p>{bill.items}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link
                            to={`/monthly-bill/${bill.billId}`}
                            className="text-primary hover:text-opacity-80 text-sm font-medium"
                          >
                            View Bill Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Monthly billing is not enabled for this customer
                </div>
              )}
            </div>
          )}
          
          {/* Clothes/Item History Tab */}
          {activeTab === 'clothes' && (
            <div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Clothes / Item History</h3>
                <p className="text-gray-600 text-sm">
                  This screen ONLY DISPLAYS item IDs generated in apps. Admin cannot create/edit/regenerate Item IDs.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Item ID</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Sub-Category</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Combine items from all orders */}
                    {customerOrders.flatMap(order => 
                      order.items.map(item => ({
                        ...item,
                        orderId: order.orderId,
                        orderStatus: order.status
                      }))
                    ).map((item, index) => (
                      <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium">{item.itemId}</td>
                        <td className="p-4">{item.orderId}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.subCategory}</td>
                        <td className="p-4 font-medium">₹{item.price}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                            item.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-start">
                  <div className="text-red-800 text-lg mr-3">❌</div>
                  <div>
                    <h3 className="font-medium text-red-900">Important Rules</h3>
                    <p className="text-red-700 text-sm mt-1">
                      ✅ Item ID already generated in app<br/>
                      ❌ Admin cannot create / edit / regenerate Item IDs<br/>
                      ❌ Admin cannot add new items<br/>
                      <span className="font-bold mt-2 block">This is a read-only display of existing Item IDs</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;