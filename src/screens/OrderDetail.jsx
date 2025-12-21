import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  
  useEffect(() => {
    const foundOrder = dummyData.orders.find(o => o.orderId === orderId);
    setOrder(foundOrder);
  }, [orderId]);
  
  if (!order) {
    return (
      <div className="ml-64 p-6">
        <Header title="Order Not Found" />
        <div className="table-container p-8 text-center">
          <p className="text-gray-500">Order not found</p>
          <Link to="/orders" className="text-primary font-medium mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
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
  
  const tabs = [
    { id: 'items', label: 'Cloth Items' },
    { id: 'customer', label: 'Customer Info' },
    { id: 'delivery', label: 'Delivery' },
  ];
  
  return (
    <div className="ml-64 p-6">
      <Header 
        title={`Order: ${order.orderId}`} 
        subtitle="View order details (Read-only Item IDs)" 
      />
      
      <div className="mb-6">
        <Link to="/orders" className="text-primary hover:text-opacity-80 font-medium">
          ← Back to Orders
        </Link>
      </div>
      
      {/* Order Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Order Information</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Source:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.orderSource === 'Customer App' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'bg-accent bg-opacity-10 text-accent'
                }`}>
                  {order.orderSource}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date & Time:</span>
                <span className="font-medium">{order.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span className="font-medium">{order.paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'Paid' ? 'text-green-600' :
                  order.paymentStatus === 'Pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Customer & Address</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">
                  {dummyData.customers.find(c => c.id === order.customerId)?.mobile}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 block mb-2">Pickup Address:</span>
                <p className="font-medium bg-gray-50 p-3 rounded">{order.pickupAddress}</p>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 block mb-2">Delivery Address:</span>
                <p className="font-medium bg-gray-50 p-3 rounded">{order.deliveryAddress}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Delivery:</span>
                <span className="font-medium">{order.preferredDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delivery Person Section (if delivery app order) */}
      {order.deliveryPerson && (
        <div className="table-container mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Delivery Person Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-gray-600 block text-sm">Name:</span>
                <span className="font-medium">{order.deliveryPerson.name}</span>
              </div>
              <div>
                <span className="text-gray-600 block text-sm">Delivery Person ID:</span>
                <span className="font-medium">{order.deliveryPerson.id}</span>
              </div>
              <div>
                <span className="text-gray-600 block text-sm">Mobile:</span>
                <span className="font-medium">{order.deliveryPerson.mobile}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs for Item Details */}
      <div className="table-container">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'items' && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cloth-Level Item Details</h3>
                <p className="text-gray-600 text-sm">
                  Item IDs are generated in Customer App / Delivery App. Admin panel displays read-only data.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Item ID</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Sub-Category</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Notes</th>
                      <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium">{item.itemId}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.subCategory}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {item.notes}
                          </span>
                        </td>
                        <td className="p-4 font-medium">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="p-4 text-right font-medium">Total:</td>
                      <td className="p-4 font-bold">₹{order.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="text-blue-800 text-lg mr-3">🔹</div>
                  <div>
                    <h3 className="font-medium text-blue-900">Item ID Generation Rule</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      In Customer App / Delivery App:<br/>
                      1. User selects Category<br/>
                      2. User selects Sub-Category<br/>
                      3. User adds quantity<br/>
                      4. System generates ONE Item ID per cloth<br/>
                      5. Order is submitted with Item IDs<br/>
                      <span className="font-bold mt-2 block">
                        ✅ Admin Dashboard displays existing Item IDs only<br/>
                        ❌ Admin cannot create/edit/regenerate Item IDs
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'customer' && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Customer Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Name:</span>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Mobile:</span>
                      <p className="font-medium">
                        {dummyData.customers.find(c => c.id === order.customerId)?.mobile}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Email:</span>
                      <p className="font-medium">
                        {dummyData.customers.find(c => c.id === order.customerId)?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Address Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Pickup Address:</span>
                      <p className="font-medium bg-gray-50 p-3 rounded text-sm">{order.pickupAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Delivery Address:</span>
                      <p className="font-medium bg-gray-50 p-3 rounded text-sm">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'delivery' && (
            <div className="p-4">
              {order.deliveryPerson ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Delivery Person</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Name:</span>
                        <p className="font-medium">{order.deliveryPerson.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">ID:</span>
                        <p className="font-medium">{order.deliveryPerson.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Mobile:</span>
                        <p className="font-medium">{order.deliveryPerson.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Delivery Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Order Source:</span>
                        <p className="font-medium">{order.orderSource}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Preferred Delivery Date:</span>
                        <p className="font-medium">{order.preferredDelivery}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Current Status:</span>
                        <p className="font-medium">{order.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  This order was placed via Customer App. No delivery person assigned.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Link
          to={`/order-status/${order.orderId}`}
          className="btn-primary"
        >
          Change Order Status
        </Link>
        <Link
          to={`/payments/${order.orderId}`}
          className="btn-secondary"
        >
          Manage Payment
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;