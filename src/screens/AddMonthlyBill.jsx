import React, { useState, useEffect } from 'react';
import { generateNextBillId, generateItemId } from '../utils/data';

const AddMonthlyBill = ({ onClose, onAddBill }) => {
  const [formData, setFormData] = useState({
    billId: generateNextBillId(),
    customerName: '',
    mobile: '',
    companyName: '',
    month: new Date().toISOString().slice(0, 7),
    status: 'Pending',
    totalAmount: 0,
    items: 0,
    orders: ['NEW-ORDER'],
    itemDetails: [],
    createdAt: new Date().toISOString().split('T')[0],
    email: '',
    address: ''
  });

  const [items, setItems] = useState([
    { id: 1, itemId: generateItemId(), itemName: '', price: 0, quantity: 1 }
  ]);

  useEffect(() => {
    // Calculate total amount
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      items: items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0)
    }));
  }, [items]);

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      itemId: generateItemId(),
      itemName: '',
      price: 0,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setItems(updatedItems);
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    if (!formData.mobile.trim()) {
      alert('Please enter mobile number');
      return;
    }
    
    if (items.some(item => !item.itemName.trim() || !item.price)) {
      alert('Please fill all item details');
      return;
    }
    
    // Generate a customer ID for new customers
    const customerId = `CUST-${Date.now().toString().slice(-6)}`;
    
    const newBill = {
      ...formData,
      customerId: customerId,
      itemDetails: items.map(item => ({
        itemId: item.itemId,
        orderId: `ORD-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        itemName: item.itemName,
        category: 'General',
        subCategory: 'General',
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1
      })),
      orders: [`ORD-${Date.now().toString().slice(-8)}`]
    };

    onAddBill(newBill);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Create New Monthly Bill</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                required
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                className="input-field w-full"
                value={formData.mobile}
                onChange={(e) => handleFormChange('mobile', e.target.value)}
                required
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={formData.companyName}
                onChange={(e) => handleFormChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                className="input-field w-full"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address (Optional)
              </label>
              <textarea
                className="input-field w-full"
                rows="2"
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
                placeholder="Enter customer address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill ID
              </label>
              <input
                type="text"
                className="input-field w-full bg-gray-50"
                value={formData.billId}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month *
              </label>
              <input
                type="month"
                className="input-field w-full"
                value={formData.month}
                onChange={(e) => handleFormChange('month', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="input-field w-full"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Items Section - Simplified */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Bill Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-primary hover:text-opacity-80 font-medium"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Item ID</label>
                    <input
                      type="text"
                      className="input-field w-full bg-gray-100"
                      value={item.itemId}
                      readOnly
                    />
                  </div>
                  
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-sm text-gray-600 mb-1">Item Name *</label>
                    <input
                      type="text"
                      className="input-field w-full"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                      required
                      placeholder="e.g., Towels, Shirts, Bedsheets"
                    />
                  </div>
                  
                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Quantity *</label>
                    <input
                      type="number"
                      className="input-field w-full"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                  
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-sm text-gray-600 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      className="input-field w-full"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                      required
                      min="0"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount Display */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Total Items: {formData.items}</h3>
                <p className="text-sm text-gray-600">Total amount is calculated automatically</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-blue-700">₹{formData.totalAmount}</div>
              </div>
            </div>
          </div>

          {/* Quick Item Suggestions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add Common Items:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Towels', price: 50 },
                { name: 'Shirts', price: 80 },
                { name: 'Trousers', price: 120 },
                { name: 'Bedsheets', price: 120 },
                { name: 'Sarees', price: 150 },
                { name: 'Jackets', price: 120 },
                { name: 'Shoes', price: 150 },
                { name: 'Bags', price: 200 }
              ].map((item) => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => handleAddItem()}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  {item.name} (₹{item.price})
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMonthlyBill;