import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [amountPaid, setAmountPaid] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    const foundOrder = dummyData.orders.find(o => o.orderId === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
      setPaymentStatus(foundOrder.paymentStatus || 'Unpaid');
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="ml-64 p-8">
        <Header title="Order Not Found" />
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-6">Order not found</p>
          <Link to="/orders" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Ready': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Picked Up': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Order Placed': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const tabs = [
    { id: 'items', label: 'Cloth Items', icon: '🧺' },
    { id: 'customer', label: 'Customer Info', icon: '👤' },
    { id: 'delivery', label: 'Delivery', icon: '🚚' },
    { id: 'payment', label: 'Payment & Receipt', icon: '💰' },
  ];

  const customer = dummyData.customers.find(c => c.id === order.customerId);
  const customerMobile = customer?.mobile?.replace(/\D/g, '') || '';

  const getBase64Image = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const createFallbackLogo = () => {
        canvas.width = 100;
        canvas.height = 40;
        
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(0, 0, 100, 40);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('YASHODA', 50, 15);
        ctx.font = '10px Arial';
        ctx.fillText('LAUNDRY', 50, 28);
        
        return canvas.toDataURL('image/png');
      };

      const logoImg = new Image();
      logoImg.crossOrigin = 'Anonymous';
      logoImg.src = '/images/logo.jpeg';
      
      logoImg.onload = () => {
        try {
          canvas.width = logoImg.width;
          canvas.height = logoImg.height;
          ctx.drawImage(logoImg, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        } catch (error) {
          console.log('Error drawing logo, using fallback:', error);
          resolve(createFallbackLogo());
        }
      };
      
      logoImg.onerror = () => {
        console.log('Logo image failed to load, using fallback');
        resolve(createFallbackLogo());
      };
      
      if (logoImg.complete) {
        canvas.width = logoImg.width;
        canvas.height = logoImg.height;
        ctx.drawImage(logoImg, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      }
    });
  };

  const generatePDF = async (forWhatsApp = false) => {
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      const logoBase64 = await getBase64Image();
      const logoType = logoBase64.includes('data:image/jpeg') ? 'JPEG' : 'PNG';
      doc.addImage(logoBase64, logoType, 14, 10, 25, 25);
      
      doc.setFontSize(16);
      doc.setTextColor(33, 150, 243);
      doc.setFont('helvetica', 'bold');
      doc.text('YASHODA LAUNDRY', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Dry Clean & Laundry Service', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT RECEIPT', pageWidth / 2, 35, { align: 'center' });
      
      doc.setDrawColor(33, 150, 243);
      doc.setLineWidth(0.5);
      doc.line(14, 40, pageWidth - 14, 40);
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      let yPos = 50;
      
      doc.text(`Receipt No: ${order.orderId}`, 14, yPos);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, yPos + 5);
      doc.text(`Time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, 14, yPos + 10);
      
      doc.text(`Customer: ${order.customerName}`, 120, yPos);
      doc.text(`Phone: ${customer?.mobile || 'N/A'}`, 120, yPos + 5);
      
      yPos += 20;
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Payment Status: ${paymentStatus}`, 14, yPos);
      if (paymentStatus === 'Partial' && amountPaid) {
        doc.text(`Amount Paid: ₹${amountPaid}`, 120, yPos);
      }
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(33, 150, 243);
      doc.rect(14, yPos, pageWidth - 28, 8, 'F');
      doc.text('Item ID', 20, yPos + 5.5);
      doc.text('Category', 60, yPos + 5.5);
      doc.text('Sub-Category', 100, yPos + 5.5);
      doc.text('Notes', 140, yPos + 5.5);
      doc.text('Price', pageWidth - 20, yPos + 5.5, { align: 'right' });
      
      yPos += 10;
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      order.items.forEach((item, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(14, yPos, pageWidth - 28, 8, 'F');
        }
        
        doc.text(item.itemId, 20, yPos + 5.5);
        doc.text(item.category.substring(0, 15), 60, yPos + 5.5);
        doc.text(item.subCategory.substring(0, 15), 100, yPos + 5.5);
        doc.text(item.notes.substring(0, 15), 140, yPos + 5.5);
        doc.text(`₹${item.price}`, pageWidth - 20, yPos + 5.5, { align: 'right' });
        
        yPos += 8;
      });
      
      yPos += 5;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(14, yPos, pageWidth - 14, yPos);
      yPos += 10;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Sub Total:', pageWidth - 80, yPos);
      doc.text(`₹${order.totalAmount}`, pageWidth - 20, yPos, { align: 'right' });
      
      yPos += 8;
      
      if (paymentStatus === 'Partial' && amountPaid) {
        doc.text('Amount Paid:', pageWidth - 80, yPos);
        doc.text(`₹${amountPaid}`, pageWidth - 20, yPos, { align: 'right' });
        yPos += 8;
        
        const remaining = order.totalAmount - parseFloat(amountPaid || 0);
        doc.text('Remaining Balance:', pageWidth - 80, yPos);
        doc.text(`₹${remaining}`, pageWidth - 20, yPos, { align: 'right' });
        yPos += 8;
      }
      
      doc.setFontSize(13);
      doc.setTextColor(33, 150, 243);
      doc.text('Grand Total:', pageWidth - 80, yPos);
      doc.text(`₹${order.totalAmount}`, pageWidth - 20, yPos, { align: 'right' });
      
      yPos += 15;
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
      doc.text('For any queries, contact: +91 9876543210', pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
      doc.text('www.yashodalaundry.com', pageWidth / 2, yPos, { align: 'center' });
      
      doc.setDrawColor(33, 150, 243);
      doc.setLineWidth(0.5);
      doc.line(14, 280, pageWidth - 14, 280);
      doc.setFontSize(7);
      doc.text('This is a computer-generated receipt', pageWidth / 2, 285, { align: 'center' });

      if (!forWhatsApp) {
        const fileName = `Yashoda_Receipt_${order.orderId}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        alert(`✅ Receipt PDF downloaded successfully!\nFilename: ${fileName}`);
      } else {
        const pdfBlob = doc.output('blob');
        pdfRef.current = pdfBlob;
      }
      
      setIsGeneratingPDF(false);
      return doc;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGeneratingPDF(false);
      alert('Error generating PDF. Please try again.');
      return null;
    }
  };

  const handleDownloadPDF = () => {
    generatePDF(false);
  };

  const handleShareViaWhatsApp = async () => {
    if (!customerMobile) {
      alert('Customer mobile number not found');
      return;
    }

    const pdfDoc = await generatePDF(true);
    
    if (!pdfDoc) return;

    const message = `Hi ${order.customerName},

📄 *Yashoda Laundry - Payment Receipt*

🔸 *Order ID:* ${order.orderId}
🔸 *Customer:* ${order.customerName}
🔸 *Total Amount:* ₹${order.totalAmount}
🔸 *Payment Status:* ${paymentStatus}
🔸 *Date:* ${new Date().toLocaleDateString('en-IN')}

✅ Your payment receipt is attached as PDF.

Thank you for choosing Yashoda Laundry!
For queries: +91 9876543210`;

    const pdfBlob = pdfRef.current || pdfDoc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `Yashoda_Receipt_${order.orderId}.pdf`;

    const whatsappUrl = `https://wa.me/${customerMobile}?text=${encodeURIComponent(message)}`;

    downloadLink.click();

    setTimeout(() => {
      const userConfirmed = window.confirm(
        `✅ PDF downloaded successfully!\n\nNow open WhatsApp to send the receipt to ${customer?.mobile}?\n\nInstructions:\n1. Open WhatsApp\n2. Select the customer\n3. Attach the downloaded PDF file\n4. Send the message`
      );
      
      if (userConfirmed) {
        window.open(whatsappUrl, '_blank');
      }
    }, 1000);
  };

  const handleDirectWhatsAppShare = () => {
    if (!customerMobile) {
      alert('Customer mobile number not found');
      return;
    }

    const message = `Hi ${order.customerName},

📄 *Yashoda Laundry - Payment Receipt*

🔸 *Order ID:* ${order.orderId}
🔸 *Customer:* ${order.customerName}
🔸 *Total Amount:* ₹${order.totalAmount}
🔸 *Payment Status:* ${paymentStatus}
🔸 *Date:* ${new Date().toLocaleDateString('en-IN')}

📋 *Item Details:*
${order.items.map(item => `   • ${item.itemId} - ${item.category} (${item.subCategory}): ₹${item.price}`).join('\n')}

Total: ₹${order.totalAmount}
${paymentStatus === 'Partial' && amountPaid ? `Paid: ₹${amountPaid} | Remaining: ₹${order.totalAmount - parseFloat(amountPaid)}` : ''}

Thank you for choosing Yashoda Laundry!
For queries: +91 9876543210`;

    const whatsappUrl = `https://wa.me/${customerMobile}?text=${encodeURIComponent(message)}`;
    
    const userConfirmed = window.confirm(
      `Send receipt details to ${customer?.mobile} via WhatsApp?\n\nNote: This will send the receipt details as text message. For PDF file, use "Share PDF via WhatsApp" button.`
    );
    
    if (userConfirmed) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const updatePaymentStatus = () => {
    alert(`Payment status updated to ${paymentStatus}${paymentStatus === 'Partial' ? ` (₹${amountPaid} paid)` : ''}`);
  };

  const remainingAmount = order.totalAmount - (amountPaid ? parseFloat(amountPaid) : 0);

  return (
    <div className="ml-64 p-8">
      <Header
        title={`Order: ${order.orderId}`}
        subtitle="View order details and manage payments"
      />

      <div className="mb-8">
        <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Orders
        </Link>
      </div>

      {/* Order Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-3">📦</span>
              Order Information
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{order.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Order Source:</span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${order.orderSource === 'Customer App'
                    ? 'bg-primary bg-opacity-10 text-primary'
                    : 'bg-accent bg-opacity-10 text-accent'
                  }`}>
                  {order.orderSource}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Order Date & Time:</span>
                <span className="font-medium text-gray-900">{order.orderDate}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Payment Type:</span>
                <span className="font-medium text-gray-900">{order.paymentType}</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4 border-t border-gray-100">
                <span className="text-gray-600 font-medium">Total Amount:</span>
                <span className="font-bold text-xl text-gray-900">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-3">👤</span>
              Customer & Address
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium text-gray-900">
                  {customer?.mobile || 'N/A'}
                </span>
              </div>
              <div className="py-2">
                <span className="text-gray-600 block mb-3">Pickup Address:</span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-900">{order.pickupAddress}</p>
                </div>
              </div>
              <div className="py-2">
                <span className="text-gray-600 block mb-3">Delivery Address:</span>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Preferred Delivery:</span>
                <span className="font-medium text-gray-900">{order.preferredDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Person Section */}
      {order.deliveryPerson && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-3">🚚</span>
              Delivery Person Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-gray-600 block text-sm mb-2">Name:</span>
                <span className="font-medium text-lg text-gray-900">{order.deliveryPerson.name}</span>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-gray-600 block text-sm mb-2">Delivery Person ID:</span>
                <span className="font-medium text-lg text-gray-900">{order.deliveryPerson.id}</span>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <span className="text-gray-600 block text-sm mb-2">Mobile:</span>
                <span className="font-medium text-lg text-gray-900">{order.deliveryPerson.mobile}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs for Item Details */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-medium text-sm flex items-center border-b-2 transition-all ${activeTab === tab.id
                    ? 'border-primary text-primary bg-primary bg-opacity-5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'items' && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cloth-Level Item Details</h3>
                <p className="text-gray-600">
                  Item IDs are generated in Customer App / Delivery App. Admin panel displays read-only data.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Item ID</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Category</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Sub-Category</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Notes</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.itemId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 border-r border-gray-100">{item.itemId}</td>
                        <td className="p-4 text-gray-700 border-r border-gray-100">{item.category}</td>
                        <td className="p-4 text-gray-700 border-r border-gray-100">{item.subCategory}</td>
                        <td className="p-4 border-r border-gray-100">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm">
                            {item.notes}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-gray-900">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="4" className="p-4 text-right font-semibold text-gray-700">Total:</td>
                      <td className="p-4 font-bold text-xl text-gray-900">₹{order.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start">
                  <div className="text-blue-600 text-2xl mr-4">📌</div>
                  <div>
                    <h3 className="font-semibold text-blue-900 text-lg mb-2">Item ID Generation Rule</h3>
                    <p className="text-blue-800 mb-3">
                      In Customer App / Delivery App:<br />
                      1. User selects Category<br />
                      2. User selects Sub-Category<br />
                      3. User adds quantity<br />
                      4. System generates ONE Item ID per cloth<br />
                      5. Order is submitted with Item IDs
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex items-center text-green-600 mb-2">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Allowed</span>
                        </div>
                        <p className="text-sm text-gray-600">Admin Dashboard displays existing Item IDs only</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <div className="flex items-center text-red-600 mb-2">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">Not Allowed</span>
                        </div>
                        <p className="text-sm text-gray-600">Admin cannot create/edit/regenerate Item IDs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'customer' && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="mr-2">👤</span>
                    Customer Information
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <span className="text-gray-600 text-sm block mb-1">Name:</span>
                      <p className="font-medium text-gray-900 text-lg">{order.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm block mb-1">Mobile:</span>
                      <p className="font-medium text-gray-900">{customer?.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm block mb-1">Email:</span>
                      <p className="font-medium text-gray-900">{customer?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm block mb-1">Monthly Billing:</span>
                      <p className={`font-medium ${customer?.monthlyBilling === 'ON' ? 'text-green-600' : 'text-gray-900'}`}>
                        {customer?.monthlyBilling || 'OFF'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="mr-2">📍</span>
                    Address Details
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <span className="text-gray-600 text-sm block mb-2">Pickup Address:</span>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900">{order.pickupAddress}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm block mb-2">Delivery Address:</span>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="p-4">
              {order.deliveryPerson ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="mr-2">🚚</span>
                      Delivery Person
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">Name:</span>
                        <p className="font-medium text-gray-900 text-lg">{order.deliveryPerson.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">ID:</span>
                        <p className="font-medium text-gray-900">{order.deliveryPerson.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">Mobile:</span>
                        <p className="font-medium text-gray-900">{order.deliveryPerson.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="mr-2">📦</span>
                      Delivery Information
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">Order Source:</span>
                        <p className="font-medium text-gray-900">{order.orderSource}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">Preferred Delivery Date:</span>
                        <p className="font-medium text-gray-900">{order.preferredDelivery}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm block mb-1">Current Status:</span>
                        <p className="font-medium text-gray-900">{order.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">Customer App Order</p>
                  <p className="text-gray-500">No delivery person assigned for this order.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Management */}
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">💰</span>
                    Payment Management
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">Order ID:</span>
                        <p className="font-medium text-gray-900">{order.orderId}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Customer:</span>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-gray-600 text-sm">Total Amount:</span>
                      <p className="font-bold text-2xl text-gray-900">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-4">
                    Payment Status:
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Paid', 'Partial', 'Unpaid'].map((status) => (
                      <div
                        key={status}
                        onClick={() => setPaymentStatus(status)}
                        className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center ${paymentStatus === status
                            ? 'border-primary bg-primary text-white shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-lg mb-2">
                          {status === 'Paid' ? '✅' : status === 'Partial' ? '⚡' : '⏳'}
                        </span>
                        <span className="font-medium">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {paymentStatus === 'Partial' && (
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-3">
                      Amount Paid (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-colors"
                        placeholder="Enter amount paid"
                        min="0"
                        max={order.totalAmount}
                      />
                    </div>
                    {amountPaid && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Remaining:</span> ₹{remainingAmount >= 0 ? remainingAmount : 0}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={updatePaymentStatus}
                  className="w-full py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md mb-6 flex items-center justify-center"
                  disabled={isGeneratingPDF}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Payment Status
                </button>

                <div className="space-y-4">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-4 bg-white border-2 border-gray-200 text-gray-800 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center shadow-sm"
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF Receipt
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareViaWhatsApp}
                    className="w-full py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
                    disabled={!customerMobile || isGeneratingPDF}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.692.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.897 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                    </svg>
                    {customerMobile ? 'Share PDF via WhatsApp' : 'Mobile Not Available'}
                  </button>

                  <button
                    onClick={handleDirectWhatsAppShare}
                    className="w-full py-4 bg-white border-2 border-green-200 text-green-700 font-medium rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors flex items-center justify-center shadow-sm"
                    disabled={!customerMobile}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.96.66 3.77 1.76 5.23L2 22l4.77-1.76C8.23 21.34 10.04 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-2 15l-.25-.25.25.25zm2.5-1.5c-1.33 0-2.25-.75-2.25-2s.92-2 2.25-2c1.33 0 2.25.75 2.25 2s-.92 2-2.25 2zm5-3.5c0 1.5-1.5 3-4.5 3-1.5 0-2.5-.25-3.5-.75l-.75-.25-.75.25c-.5.25-1.25.5-2 .5h-.25l-.25-.25.25.25c.25-1.5 1-2.5 1.75-3.25-.75-1.25-1-2.5-1-3.75 0-2.5 2-5 5.5-5s5.5 2.5 5.5 5z" />
                    </svg>
                    Send Text via WhatsApp
                  </button>
                </div>
              </div>

              {/* Receipt Preview */}
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="mr-2">📄</span>
                    Receipt Preview
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 mb-8 border-2 border-gray-200 shadow-sm">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary bg-opacity-10 rounded-full mb-4">
                      <div className="">
                        <img
                          src="/images/logo.jpeg"
                          alt="Logo"
                          className="h-16 w-16 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span className="text-3xl text-primary">🧺</span>';
                          }}
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-1">YASHODA LAUNDRY</h3>
                    <p className="text-gray-600 mb-2">Professional Dry Clean & Laundry Service</p>
                    <div className="inline-block px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      PAYMENT RECEIPT
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="text-gray-600 text-sm">Receipt No:</span>
                        <p className="font-medium text-gray-900">{order.orderId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600 text-sm">Date:</span>
                        <p className="font-medium text-gray-900">{new Date().toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-medium text-gray-700 mb-3">Customer Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600 text-sm">Name:</span>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Phone:</span>
                          <p className="font-medium text-gray-900">{customer?.mobile || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Item Details</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.itemId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <span className="font-medium text-gray-900">{item.itemId}</span>
                              <span className="text-gray-500 text-sm ml-2">({item.category})</span>
                            </div>
                            <span className="font-medium text-gray-900">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <div className="flex justify-between font-bold text-xl mb-3">
                        <span className="text-gray-800">Total Amount</span>
                        <span className="text-primary">₹{order.totalAmount}</span>
                      </div>
                      
                      {paymentStatus === 'Partial' && amountPaid && (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount Paid</span>
                            <span className="font-medium text-green-600">₹{amountPaid}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-medium text-amber-600">₹{remainingAmount >= 0 ? remainingAmount : 0}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">Payment Status</span>
                        <span className={`font-medium ${paymentStatus === 'Paid' ? 'text-green-600' :
                            paymentStatus === 'Partial' ? 'text-amber-600' :
                              'text-red-600'
                          }`}>
                          {paymentStatus}
                          {paymentStatus === 'Partial' && amountPaid && ` (₹${amountPaid} paid)`}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">This is a computer-generated receipt</p>
                      <p className="text-xs text-gray-500">For queries: +91 9876543210 | www.yashodalaundry.com</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    Receipt Sharing Options
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-800"><strong>Download PDF:</strong> Professional receipt with company logo</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-800"><strong>Share PDF via WhatsApp:</strong> Download + WhatsApp instructions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-800"><strong>Send Text via WhatsApp:</strong> Direct text message with details</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-800">Payment status and partial payment tracking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-blue-800">Indian date and currency format</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to={`/order-status/${order.orderId}`}
          className="py-4 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Change Order Status
        </Link>
        <button
          onClick={() => setActiveTab('payment')}
          className="py-4 px-6 bg-white border-2 border-gray-200 text-gray-800 font-medium rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Manage Payment & Receipt
        </button>
      </div>

      {/* Receipt Information Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start">
          <div className="text-green-600 text-2xl mr-4">💡</div>
          <div>
            <h3 className="font-semibold text-green-900 text-lg mb-3">Payment & Receipt Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Download PDF Receipt</span>
                </div>
                <p className="text-sm text-gray-600">Professional PDF with company logo and itemized details</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">WhatsApp Integration</span>
                </div>
                <p className="text-sm text-gray-600">Share receipts directly via WhatsApp with customer's mobile number</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Payment Tracking</span>
                </div>
                <p className="text-sm text-gray-600">Track partial payments and remaining balances</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center text-green-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Real-time Preview</span>
                </div>
                <p className="text-sm text-gray-600">Preview receipt before generating PDF</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-medium">Note:</span> For direct PDF attachment in WhatsApp, user needs to manually attach the downloaded file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;