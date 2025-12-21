import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { orderStatuses } from '../utils/data';

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orders] = useState([
    {
      orderId: "ORD-2409-001",
      customerName: "John Smith",
      currentStatus: "Processing",
      orderDate: "2023-12-01 10:30"
    },
    {
      orderId: "ORD-2409-002",
      customerName: "Emma Johnson",
      currentStatus: "Picked Up",
      orderDate: "2023-12-01 14:15"
    },
    {
      orderId: "ORD-2409-003",
      customerName: "Michael Brown",
      currentStatus: "Ready",
      orderDate: "2023-11-30 09:45"
    }
  ]);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    if (orderId) {
      const order = orders.find(o => o.orderId === orderId);
      setSelectedOrder(order);
      if (order) setSelectedStatus(order.currentStatus);
    }
  }, [orderId, orders]);
  
  const handleStatusChange = (orderId, newStatus) => {
    // In real app, this would update in localStorage/backend
    console.log(`Changing status for ${orderId} to ${newStatus}`);
    alert(`Status changed to ${newStatus} for order ${orderId}`);
    navigate('/orders');
  };
  
  return (
    <div className="ml-64 p-6">
      <Header 
        title="Order Status Control" 
        subtitle="Admin-only status updates (Item IDs remain permanent)" 
      />
      
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-primary hover:text-opacity-80 font-medium"
        >
          ← Back to Orders
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Selection */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Select Order</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => {
                    setSelectedOrder(order);
                    setSelectedStatus(order.currentStatus);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOrder?.orderId === order.orderId
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{order.orderId}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.currentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.currentStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.currentStatus === 'Ready' ? 'bg-yellow-100 text-yellow-800' :
                        order.currentStatus === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.currentStatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Order Date: {order.orderDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Status Update */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Update Status</h2>
          </div>
          <div className="p-6">
            {selectedOrder ? (
              <>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Order Details:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><span className="text-gray-600">Order ID:</span> {selectedOrder.orderId}</p>
                    <p><span className="text-gray-600">Customer:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-600">Current Status:</span> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.currentStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        selectedOrder.currentStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.currentStatus === 'Ready' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.currentStatus === 'Picked Up' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.currentStatus}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    Select New Status:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {orderStatuses.map((status) => (
                      <div
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedStatus === status
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border mr-3 ${
                            selectedStatus === status 
                              ? 'bg-white border-white' 
                              : 'border-gray-300'
                          }`} />
                          <span>{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => handleStatusChange(selectedOrder.orderId, selectedStatus)}
                  disabled={selectedStatus === selectedOrder.currentStatus}
                  className={`btn-primary w-full py-3 ${
                    selectedStatus === selectedOrder.currentStatus 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  Update Status to {selectedStatus}
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select an order from the left to update its status
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <div className="flex items-start">
          <div className="text-yellow-800 text-lg mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-900">Important Note</h3>
            <p className="text-yellow-700 text-sm mt-1">
              🔁 Status change does NOT affect Item IDs<br/>
              ✅ Item IDs remain permanent regardless of status changes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;