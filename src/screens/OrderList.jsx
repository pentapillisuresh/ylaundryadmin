import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

// Import Lucide React icons for better visuals
import {
  Search,
  Filter,
  ShoppingBag,
  Smartphone,
  Truck,
  CreditCard,
  Calendar,
  User,
  Eye,
  Info,
  CheckCircle,
  Clock,
  Package,
  Home,
  AlertCircle
} from 'lucide-react';

const OrderList = () => {
  const [orders] = useState(dummyData.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || order.orderSource === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusConfig = (status) => {
    const configs = {
      'Delivered': {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-500'
      },
      'Processing': {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Clock className="w-4 h-4" />,
        bgColor: 'bg-blue-500'
      },
      'Ready': {
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <Package className="w-4 h-4" />,
        bgColor: 'bg-yellow-500'
      },
      'Picked Up': {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <Truck className="w-4 h-4" />,
        bgColor: 'bg-purple-500'
      },
      'Order Placed': {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <ShoppingBag className="w-4 h-4" />,
        bgColor: 'bg-gray-500'
      },
    };
    return configs[status] || configs['Order Placed'];
  };

  const getSourceConfig = (source) => {
    return source === 'Customer App'
      ? {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Smartphone className="w-4 h-4" />
      }
      : {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Home className="w-4 h-4" />
      };
  };

  const getPaymentIcon = (type) => {
    return type === 'Cash'
      ? <span className="text-lg">₹</span>
      : <CreditCard className="w-4 h-4" />;
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <Header
        title="Order Management"
        subtitle="Monitor and track all customer orders"
      />

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Filtered Orders</p>
              <p className="text-2xl font-semibold text-gray-800">{filteredOrders.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Filter className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer App</p>
              <p className="text-lg font-semibold text-gray-800">
                {orders.filter(o => o.orderSource === 'Customer App').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivery App</p>
              <p className="text-lg font-semibold text-gray-800">
                {orders.filter(o => o.orderSource === 'Delivery App').length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Filter className="w-5 h-5" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Processing">Processing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="Customer App">Customer App</option>
              <option value="Delivery App">Delivery App</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Order ID
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Source
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date & Time
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Payment
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const sourceConfig = getSourceConfig(order.orderSource);

                return (
                  <tr
                    key={order.orderId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{order.orderId}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-xs text-gray-500">{order.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full border ${sourceConfig.color}`}>
                        {sourceConfig.icon}
                        <span className="ml-2 text-xs font-medium">{order.orderSource}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{order.orderDate}</div>
                      <div className="text-xs text-gray-500">2:30 PM</div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="ml-2 text-xs font-semibold">{order.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${order.paymentType === 'Cash' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                          {getPaymentIcon(order.paymentType)}
                        </div>
                        <span className="ml-3 text-sm font-medium">{order.paymentType}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold text-gray-700">{order.totalClothes}</span>
                        </div>
                        <span className="text-sm text-gray-600">items</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-lg font-semibold text-gray-900">₹{order.totalAmount}</div>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/order/${order.orderId}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No orders match your current filters. Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* System Rules Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-start">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <AlertCircle className="w-6 h-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">System Rules & Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">No order creation in admin panel</p>
                  <p className="text-xs text-blue-600 mt-1">All orders must originate from customer-facing applications</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">No ID generation in admin panel</p>
                  <p className="text-xs text-blue-600 mt-1">Order and item IDs are generated exclusively in mobile applications</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Orders via Customer App / Delivery App only</p>
                  <p className="text-xs text-blue-600 mt-1">All order entries come through official mobile applications</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Item IDs generated in apps only</p>
                  <p className="text-xs text-blue-600 mt-1">One unique ID per cloth item, generated at source</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;