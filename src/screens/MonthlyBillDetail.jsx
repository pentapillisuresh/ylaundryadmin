import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { getData, dummyData } from '../utils/data';

const MonthlyBillDetail = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = () => {
      setLoading(true);
      const savedBills = getData('monthlyBills');
      const bills = savedBills && savedBills.length > 0 ? savedBills : dummyData.monthlyBills;
      const foundBill = bills.find(b => b.billId === billId);
      setBill(foundBill);
      setLoading(false);
    };

    fetchBill();
  }, [billId]);

  const handleDownloadPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${bill.billId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { max-width: 200px; margin-bottom: 20px; }
          .bill-details { margin-bottom: 30px; }
          .detail-row { margin-bottom: 8px; display: flex; justify-content: space-between; }
          .detail-label { font-weight: bold; color: #555; }
          .detail-value { }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th { background-color: #f8fafc; text-align: left; padding: 12px; border: 1px solid #e2e8f0; }
          .table td { padding: 12px; border: 1px solid #e2e8f0; }
          .total-row { font-weight: bold; font-size: 1.1em; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 0.9em; }
          .status-paid { color: #059669; font-weight: bold; }
          .status-pending { color: #d97706; font-weight: bold; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="margin-bottom: 20px;">
            <div style="font-size: 24px; font-weight: bold; color: #3B82F6;">LaundryPro</div>
            <div style="color: #666;">Professional Laundry Services</div>
          </div>
          <h1>Monthly Bill Invoice</h1>
        </div>
        
        <div class="bill-details">
          <div class="detail-row">
            <span class="detail-label">Bill ID:</span>
            <span class="detail-value">${bill.billId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Customer Name:</span>
            <span class="detail-value">${bill.customerName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Company:</span>
            <span class="detail-value">${bill.companyName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mobile:</span>
            <span class="detail-value">${bill.mobile}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Month:</span>
            <span class="detail-value">${bill.month}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Bill Date:</span>
            <span class="detail-value">${bill.createdAt}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Due Date:</span>
            <span class="detail-value">${bill.dueDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value ${bill.status === 'Paid' ? 'status-paid' : 'status-pending'}">
              ${bill.status}
            </span>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Order ID</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.itemDetails.map(item => `
              <tr>
                <td>${item.itemId}</td>
                <td>${item.orderId}</td>
                <td>${item.category}</td>
                <td>${item.subCategory}</td>
                <td>₹${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">Total Amount:</td>
              <td>₹${bill.totalAmount}</td>
            </tr>
            ${bill.status === 'Pending' ? `
              <tr>
                <td colspan="5" style="text-align: center; color: #dc2626; padding-top: 20px;">
                  <strong>Payment Due: ₹${bill.totalAmount}</strong><br>
                  <small>Please pay before ${bill.dueDate}</small>
                </td>
              </tr>
            ` : ''}
          </tfoot>
        </table>
        
        <div class="footer">
          <p>Thank you for choosing our services!</p>
          <p>LaundryPro • 123 Service Street • City, State 12345</p>
          <p>Phone: +91 9876543210 • Email: billing@laundrypro.com</p>
          <p style="margin-top: 20px; font-size: 0.8em;">
            Generated on ${new Date().toLocaleDateString()}
          </p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print or Save as PDF
          </button>
          <p style="margin-top: 10px; color: #666; font-size: 0.9em;">
            Click above button to print or save as PDF
          </p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const handleShareWhatsApp = () => {
    const message = `*Monthly Bill Notification*\n\n` +
      `*Bill ID:* ${bill.billId}\n` +
      `*Customer:* ${bill.customerName}\n` +
      `*Company:* ${bill.companyName}\n` +
      `*Month:* ${bill.month}\n` +
      `*Total Amount:* ₹${bill.totalAmount}\n` +
      `*Status:* ${bill.status}\n` +
      `*Due Date:* ${bill.dueDate}\n\n` +
      `Please check your bill details.\n` +
      `Thank you for choosing our services!`;
    
    const whatsappUrl = `https://wa.me/${bill.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="ml-64 p-6">
        <Header title="Loading Bill Details..." />
        <div className="table-container p-8 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

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
      
      <div className="flex justify-between items-center mb-6">
        <Link to="/monthly-billing" className="text-primary hover:text-opacity-80 font-medium">
          ← Back to Monthly Billing
        </Link>
        
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          
          <button
            onClick={handleShareWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.158 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.89-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            Share on WhatsApp
          </button>
        </div>
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
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{bill.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{bill.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Month:</span>
                <span className="font-medium">{bill.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${
                  bill.status === 'Paid' ? 'text-green-600' : 
                  bill.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {bill.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bill Date:</span>
                <span className="font-medium">{bill.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{bill.dueDate}</span>
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
                        From: {bill.createdAt} • Amount: ₹{Math.floor(bill.totalAmount / bill.orders.length)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">Included in monthly bill</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Item Details Table */}
  
{/* Item Details Table */}
<div className="table-container mb-6">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800">Item Details</h2>
  </div>
  <div className="p-6">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left text-sm font-medium text-gray-600">Item ID</th>
            <th className="p-4 text-left text-sm font-medium text-gray-600">Item Name</th>
            <th className="p-4 text-left text-sm font-medium text-gray-600">Quantity</th>
            <th className="p-4 text-left text-sm font-medium text-gray-600">Unit Price</th>
            <th className="p-4 text-left text-sm font-medium text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.itemDetails.map((item, index) => (
            <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="p-4 font-medium">{item.itemId}</td>
              <td className="p-4">{item.itemName || item.subCategory}</td>
              <td className="p-4">{item.quantity || 1}</td>
              <td className="p-4">₹{item.price}</td>
              <td className="p-4 font-medium">₹{(item.price * (item.quantity || 1)).toFixed(2)}</td>
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