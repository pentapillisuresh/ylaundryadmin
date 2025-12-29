// Update the handleDownloadPDF function in MonthlyBilling.js
const handleDownloadPDF = (bill) => {
  const printWindow = window.open('', '_blank');
  
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Calculate subtotal and tax
  const subtotal = bill.totalAmount;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + tax;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${bill.billId} - Monthly Bill</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Inter', Arial, sans-serif; 
          padding: 20px;
          background: #ffffff;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
        }
        .header { 
          text-align: center;
          padding: 30px 0;
          border-bottom: 3px solid #3B82F6;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 36px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .company-tagline {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 28px;
          color: #333;
          font-weight: 600;
          margin: 20px 0;
        }
        .bill-info {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }
        .info-value {
          color: #333;
          font-size: 14px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 25px 0;
        }
        .items-table th {
          background: #3B82F6;
          color: white;
          text-align: left;
          padding: 15px;
          font-weight: 600;
        }
        .items-table td {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
        }
        .items-table tr:nth-child(even) {
          background: #f8fafc;
        }
        .total-section {
          background: #f8fafc;
          padding: 25px;
          border-radius: 10px;
          margin-top: 30px;
          border: 1px solid #e2e8f0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .total-row:last-child {
          border-bottom: none;
          font-size: 20px;
          font-weight: 700;
          color: #3B82F6;
          margin-top: 10px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px dashed #ddd;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-overdue {
          background: #fee2e2;
          color: #991b1b;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="company-name">LAUNDRY SERVICES</div>
          <div class="company-tagline">Professional Laundry & Dry Cleaning</div>
          <div class="invoice-title">MONTHLY BILL INVOICE</div>
        </div>
        
        <div class="bill-info">
          <div class="info-grid">
            <div>
              <div class="info-row">
                <span class="info-label">Bill ID:</span>
                <span class="info-value">${bill.billId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Customer:</span>
                <span class="info-value">${bill.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Company:</span>
                <span class="info-value">${bill.companyName || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Mobile:</span>
                <span class="info-value">${bill.mobile}</span>
              </div>
            </div>
            <div>
              <div class="info-row">
                <span class="info-label">Month:</span>
                <span class="info-value">${bill.month}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Bill Date:</span>
                <span class="info-value">${bill.createdAt}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                  <span class="status-badge status-${bill.status.toLowerCase()}">
                    ${bill.status}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price (₹)</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.itemDetails.map(item => `
              <tr>
                <td>${item.itemId}</td>
                <td>${item.itemName || item.subCategory}</td>
                <td>${item.quantity || 1}</td>
                <td>₹${item.price}</td>
                <td>₹${(item.price * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>GST (18%):</span>
            <span>₹${tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Grand Total:</span>
            <span>₹${grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>Laundry Services • 123 Main Street • Mumbai • Phone: +91 9876543210</p>
          <p>Email: billing@laundryservice.com • GSTIN: 27AABCU9603R1ZX</p>
          <p>Invoice generated on: ${currentDate}</p>
          <p style="font-size: 12px; color: #888; margin-top: 10px;">
            This is a computer generated invoice and does not require a signature.
          </p>
        </div>
      </div>
      
      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="
          padding: 12px 30px;
          background: #3B82F6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        ">
          📄 Print / Save as PDF
        </button>
        <p style="margin-top: 10px; color: #666; font-size: 14px;">
          Click the button above to print or save as PDF
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