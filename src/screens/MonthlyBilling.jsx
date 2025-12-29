import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData, saveData, getData, generateNextBillId } from '../utils/data';
import AddMonthlyBill from '../screens/AddMonthlyBill';

const MonthlyBilling = () => {
  const [bills, setBills] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    // Load bills from localStorage or use dummy data
    const savedBills = getData('monthlyBills');
    if (savedBills && savedBills.length > 0) {
      setBills(savedBills);
    } else {
      setBills(dummyData.monthlyBills);
      saveData('monthlyBills', dummyData.monthlyBills);
    }
  }, []);

  const handleAddBill = (newBill) => {
    const updatedBills = [...bills, newBill];
    setBills(updatedBills);
    saveData('monthlyBills', updatedBills);
    setShowAddForm(false);
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.mobile.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'All' || bill.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="ml-64 p-6">
      <Header 
        title="Monthly Billing" 
        subtitle="Manage all monthly bills and payments" 
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bills..."
              className="input-field pl-10 pr-4 py-2 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          + Add New Bill
        </button>
      </div>

      {showAddForm && (
        <AddMonthlyBill 
          onClose={() => setShowAddForm(false)}
          onAddBill={handleAddBill}
          customers={dummyData.customers}
        />
      )}

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Bill ID</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Month</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Mobile</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Due Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.billId} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <Link to={`/monthly-bill/${bill.billId}`} className="font-medium text-primary hover:underline">
                      {bill.billId}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{bill.customerName}</div>
                      <div className="text-sm text-gray-600">{bill.companyName}</div>
                    </div>
                  </td>
                  <td className="p-4">{bill.month}</td>
                  <td className="p-4">{bill.mobile}</td>
                  <td className="p-4 font-medium">₹{bill.totalAmount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-4">{bill.dueDate}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/monthly-bill/${bill.billId}`}
                        className="text-primary hover:text-opacity-80 font-medium text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDownloadPDF(bill)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleShareWhatsApp(bill)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBills.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No bills found</p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-600 font-medium">Total Bills</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{bills.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-sm text-green-600 font-medium">Paid Amount</div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            ₹{bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.totalAmount, 0)}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="text-sm text-red-600 font-medium">Pending Amount</div>
          <div className="text-2xl font-bold text-red-700 mt-1">
            ₹{bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + b.totalAmount, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

const handleDownloadPDF = (bill) => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  
  const logoUrl = 'https://via.placeholder.com/150x50/3B82F6/FFFFFF?text=Laundry+Logo';
  
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
        <!-- Logo will be loaded from URL -->
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
  
  // Auto-print after content loads
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};

const handleShareWhatsApp = (bill) => {
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

export default MonthlyBilling;