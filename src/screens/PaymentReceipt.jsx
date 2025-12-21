import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

const PaymentReceipt = () => {
  const { orderId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [amountPaid, setAmountPaid] = useState('');
  const [orders] = useState([
    {
      orderId: "ORD-2409-001",
      customerName: "John Smith",
      totalAmount: 450,
      items: [
        { itemId: "ITEM-2409-001", price: 80 },
        { itemId: "ITEM-2409-002", price: 80 },
      ]
    }
  ]);
  
  const currentOrder = orderId ? orders.find(o => o.orderId === orderId) : orders[0];
  
  const handleGenerateReceipt = () => {
    alert(`Receipt PDF generated for ${currentOrder.orderId} and sent via WhatsApp`);
  };
  
  return (
    <div className="ml-64 p-6">
      <Header title="Payment & Receipt Management" subtitle="Manage payments and generate receipts for delivered orders" />
      
      <div className="mb-6">
        <Link to="/orders" className="text-primary hover:text-opacity-80 font-medium">
          ← Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Management */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Payment Management</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Order Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><span className="text-gray-600">Order ID:</span> {currentOrder.orderId}</p>
                <p className="mb-2"><span className="text-gray-600">Customer:</span> {currentOrder.customerName}</p>
                <p><span className="text-gray-600">Total Amount:</span> <span className="font-bold">₹{currentOrder.totalAmount}</span></p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-3">
                Payment Status:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Paid', 'Partial', 'Unpaid'].map((status) => (
                  <div
                    key={status}
                    onClick={() => setPaymentStatus(status)}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      paymentStatus === status
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
            
            {paymentStatus === 'Partial' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount paid"
                />
                {amountPaid && (
                  <p className="text-sm text-gray-500 mt-2">
                    Remaining: ₹{currentOrder.totalAmount - amountPaid}
                  </p>
                )}
              </div>
            )}
            
            <button
              onClick={handleGenerateReceipt}
              className="btn-primary w-full py-3"
            >
              Generate Receipt PDF
            </button>
          </div>
        </div>
        
        {/* Receipt Preview */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Receipt Preview</h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Laundry Pro</h3>
                <p className="text-gray-600">Official Receipt</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{currentOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{currentOrder.customerName}</span>
                </div>
                
                <div className="border-t border-gray-300 my-4"></div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Item Details:</h4>
                  {currentOrder.items.map((item) => (
                    <div key={item.itemId} className="flex justify-between text-sm mb-1">
                      <span>{item.itemId}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>₹{currentOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Payment Status:</span>
                    <span className={`font-medium ${
                      paymentStatus === 'Paid' ? 'text-green-600' :
                      paymentStatus === 'Partial' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {paymentStatus}
                      {paymentStatus === 'Partial' && amountPaid && ` (₹${amountPaid} paid)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn-secondary w-full py-3 flex items-center justify-center">
                <span className="mr-2">📱</span>
                Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-start">
          <div className="text-green-800 text-lg mr-3">📌</div>
          <div>
            <h3 className="font-medium text-green-900">Receipt Information</h3>
            <p className="text-green-700 text-sm mt-1">
              Receipt includes:<br/>
              • Order ID<br/>
              • All Item IDs<br/>
              • Item prices<br/>
              • Total amount<br/>
              • Payment status<br/>
              <span className="font-bold mt-2 block">❌ No ID creation in receipt generation</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;