import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const MonthlyBillDetail = () => {
  const { billId } = useParams();
  
  // Find the bill (simplified for demo)
  const bill = dummyData.monthlyBills[0];
  
  if (!bill) {
    return (
      <div className="ml-64 p-6">
        <Header title="Bill Not Found" />
        <div className="table-container p-8 text-center">
          <p className="text-gray-500">Monthly bill not found</p>
          <Link to="/monthly-billing" className="text-primary font-medium mt-4 inline-block">
            ← Back to Monthly Billing
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="ml-64 p-6">
      <Header 
        title={`Monthly Bill: ${bill.billId}`} 
        subtitle="Audit view of monthly bill (Item IDs are read-only)" 
      />
      
      <div className="mb-6">
        <Link to="/monthly-billing" className="text-primary hover:text-opacity-80 font-medium">
          ← Back to Monthly Billing
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bill Summary */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Bill Summary</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Bill ID:</span>
                <span className="font-medium">{bill.billId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{bill.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Month:</span>
                <span className="font-medium">{bill.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${
                  bill.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {bill.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">{bill.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{bill.items}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="text-gray-600 font-bold">Total Amount:</span>
                <span className="font-bold text-lg">₹{bill.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders in this Bill */}
        <div className="table-container col-span-2">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Orders Included</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {bill.orders.map((orderId) => (
                <div key={orderId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{orderId}</h3>
                      <p className="text-sm text-gray-600">
                        From: {new Date().toLocaleDateString()} • Amount: ₹450
                      </p>
                    </div>
                    <Link
                      to={`/order/${orderId}`}
                      className="text-primary hover:text-opacity-80 text-sm font-medium"
                    >
                      View Order →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Item Details Table */}
      <div className="table-container mb-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Item Details (All Item IDs)</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Item ID</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Sub-Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {bill.itemDetails.map((item, index) => (
                  <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium">{item.itemId}</td>
                    <td className="p-4">{item.orderId}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">{item.subCategory}</td>
                    <td className="p-4 font-medium">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="p-4 text-right font-medium">Total:</td>
                  <td className="p-4 font-bold">₹{bill.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
        <div className="flex items-start">
          <div className="text-red-800 text-lg mr-3">❌</div>
          <div>
            <h3 className="font-medium text-red-900">Audit View - Read Only</h3>
            <p className="text-red-700 text-sm mt-1">
              This screen is for audit purposes only. Admin cannot:<br/>
              • Modify Item IDs<br/>
              • Add new items<br/>
              • Change item details<br/>
              • Regenerate IDs<br/>
              <span className="font-bold mt-2 block">✅ Item IDs are exactly as created in the apps</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBillDetail;