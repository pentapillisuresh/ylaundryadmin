import React, { useState } from 'react';
import Header from '../components/Header';
import { dummyData } from '../utils/data';

const DeliveryPerson = () => {
  const [deliveryPersons] = useState(dummyData.deliveryPersons);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPersons = deliveryPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.mobile.includes(searchTerm) ||
    person.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="ml-64 p-6">
      <Header title="Delivery Person Management" subtitle="View delivery persons who appear after login" />
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search delivery persons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 pr-4 py-2 w-64"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredPersons.length} delivery persons
          </div>
        </div>
      </div>
      
      <div className="table-container mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Delivery Person ID</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Mobile</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Join Date</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Orders Created</th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">Clothes Count (Item IDs)</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersons.map((person) => (
                <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium">{person.id}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                        <span>{person.name.charAt(0)}</span>
                      </div>
                      <span>{person.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{person.mobile}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      person.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="p-4">{person.joinDate}</td>
                  <td className="p-4 font-medium">{person.totalOrders}</td>
                  <td className="p-4 font-medium">{person.totalClothes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPersons.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No delivery persons found
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Delivery Persons</p>
              <p className="text-2xl font-bold mt-2">{deliveryPersons.length}</p>
            </div>
            <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🚚</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders Handled</p>
              <p className="text-2xl font-bold mt-2">
                {deliveryPersons.reduce((sum, person) => sum + person.totalOrders, 0)}
              </p>
            </div>
            <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clothes Delivered</p>
              <p className="text-2xl font-bold mt-2">
                {deliveryPersons.reduce((sum, person) => sum + person.totalClothes, 0)}
              </p>
            </div>
            <div className="bg-warning w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">👕</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <div className="flex items-start">
          <div className="text-yellow-800 text-lg mr-3">⚠️</div>
          <div>
            <h3 className="font-medium text-yellow-900">System Rules</h3>
            <p className="text-yellow-700 text-sm mt-1">
              • Delivery person appears after login in Delivery App<br/>
              • Admin sees their information<br/>
              <span className="font-bold mt-2 block">
                ❌ Admin does not assign IDs<br/>
                ❌ Admin does not create orders for delivery persons<br/>
                ❌ Delivery Person IDs are auto-generated in app
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPerson;