import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { storage } from '../utils/storage';

const CategoryManagement = () => {
  // Fixed main categories as per requirements
  const mainCategories = [
    "Men's Wear",
    "Women's Wear", 
    "Kids Wear",
    "Household",
    "Steam",
    "Wash & Iron",
    "Other"
  ];
  
  // State management
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Men's Wear");
  const [newSubCategory, setNewSubCategory] = useState('');
  const [price, setPrice] = useState('');
  
  // Editing states
  const [editingId, setEditingId] = useState(null);
  const [editSubCatName, setEditSubCatName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize from localStorage on component mount
  useEffect(() => {
    const savedCategories = storage.get('laundryCategories') || {};
    const savedPrices = storage.get('laundryCategoryPrices') || {};
    
    // Initialize empty arrays for categories that don't exist yet
    const initializedCategories = {};
    mainCategories.forEach(cat => {
      initializedCategories[cat] = savedCategories[cat] || [];
    });
    
    setCategories(initializedCategories);
  }, []);
  
  // Save to localStorage whenever categories change
  useEffect(() => {
    storage.set('laundryCategories', categories);
  }, [categories]);
  
  // Add new sub-category
  const handleAddSubCategory = () => {
    if (!newSubCategory.trim() || !price) {
      alert('Please enter both sub-category name and price');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    const updatedCategories = { ...categories };
    const updatedPrices = storage.get('laundryCategoryPrices') || {};
    
    // Check if sub-category already exists in this category
    if (updatedCategories[selectedCategory]?.includes(newSubCategory.trim())) {
      alert('This sub-category already exists in this category!');
      return;
    }
    
    // Add sub-category
    updatedCategories[selectedCategory] = [
      ...(updatedCategories[selectedCategory] || []),
      newSubCategory.trim()
    ];
    
    // Add price
    updatedPrices[newSubCategory.trim()] = priceValue;
    
    // Update state and storage
    setCategories(updatedCategories);
    storage.set('laundryCategoryPrices', updatedPrices);
    
    // Reset form
    setNewSubCategory('');
    setPrice('');
    
    alert(`Sub-category "${newSubCategory}" added successfully with price ₹${priceValue}`);
  };
  
  // Start editing a sub-category
  const handleStartEdit = (subCategory) => {
    setEditingId(subCategory);
    setEditSubCatName(subCategory);
    const savedPrices = storage.get('laundryCategoryPrices') || {};
    setEditPrice(savedPrices[subCategory] || '');
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSubCatName('');
    setEditPrice('');
  };
  
  // Save edited sub-category
  const handleSaveEdit = (oldSubCatName) => {
    if (!editSubCatName.trim() || !editPrice) {
      alert('Please enter both sub-category name and price');
      return;
    }
    
    const priceValue = parseFloat(editPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    const updatedCategories = { ...categories };
    const updatedPrices = storage.get('laundryCategoryPrices') || {};
    
    // Check if new name already exists (except for the one being edited)
    if (editSubCatName !== oldSubCatName && 
        updatedCategories[selectedCategory]?.includes(editSubCatName.trim())) {
      alert('This sub-category name already exists in this category!');
      return;
    }
    
    // Remove old sub-category and add new one
    const categoryIndex = updatedCategories[selectedCategory].indexOf(oldSubCatName);
    if (categoryIndex !== -1) {
      updatedCategories[selectedCategory][categoryIndex] = editSubCatName.trim();
    }
    
    // Update price - remove old key, add new key
    delete updatedPrices[oldSubCatName];
    updatedPrices[editSubCatName.trim()] = priceValue;
    
    // Update state and storage
    setCategories({...updatedCategories});
    storage.set('laundryCategoryPrices', updatedPrices);
    
    // Reset editing
    handleCancelEdit();
    
    alert(`Sub-category updated successfully to "${editSubCatName}" with price ₹${priceValue}`);
  };
  
  // Delete sub-category
  const handleDeleteSubCategory = (subCategory) => {
    if (!window.confirm(`Are you sure you want to delete "${subCategory}"?\nThis action cannot be undone.`)) {
      return;
    }
    
    const updatedCategories = { ...categories };
    const updatedPrices = storage.get('laundryCategoryPrices') || {};
    
    // Remove from category list
    updatedCategories[selectedCategory] = updatedCategories[selectedCategory].filter(
      item => item !== subCategory
    );
    
    // Remove price entry
    delete updatedPrices[subCategory];
    
    // Update state and storage
    setCategories({...updatedCategories});
    storage.set('laundryCategoryPrices', updatedPrices);
    
    // Cancel editing if deleting the item being edited
    if (editingId === subCategory) {
      handleCancelEdit();
    }
    
    alert(`Sub-category "${subCategory}" deleted successfully`);
  };
  
  // Get price for a sub-category
  const getPriceForSubCategory = (subCategory) => {
    const savedPrices = storage.get('laundryCategoryPrices') || {};
    const price = savedPrices[subCategory];
    return price ? `₹${price}` : 'Not set';
  };
  
  // Filter sub-categories based on search
  const filteredSubCategories = categories[selectedCategory]?.filter(subCat => 
    subCat.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Calculate total sub-categories
  const totalSubCategories = Object.values(categories).reduce(
    (total, subCats) => total + (subCats?.length || 0), 0
  );

  return (
    <div className="ml-64 p-6">
      <Header 
        title="Category & Sub-Category Management" 
        subtitle="Add, edit, and delete sub-categories with pricing"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Add Sub-Category Form */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Add New Sub-Category</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Select Main Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    handleCancelEdit(); // Cancel editing when switching categories
                  }}
                  className="input-field"
                >
                  {mainCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Sub-Category Name *
                </label>
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Shirt, Saree, Bedsheet"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-field"
                  placeholder="Enter price in rupees"
                  min="1"
                  step="1"
                />
              </div>
              
              <button
                onClick={handleAddSubCategory}
                className="btn-primary w-full py-3 flex items-center justify-center hover:bg-opacity-95 transition-all"
                disabled={!newSubCategory.trim() || !price}
              >
                <span className="mr-2">➕</span>
                Add Sub-Category
              </button>
              
              {(!newSubCategory.trim() || !price) && (
                <p className="text-sm text-gray-500 text-center">
                  * All fields are required
                </p>
              )}
            </div>
            
            {/* Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Main Categories</p>
                  <p className="text-2xl font-bold text-primary">{mainCategories.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Sub-Categories</p>
                  <p className="text-2xl font-bold text-accent">{totalSubCategories}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Selected Category</p>
                  <p className="text-lg font-bold text-gray-800">{selectedCategory}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Sub-Categories */}
        <div className="table-container">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Sub-Categories: {selectedCategory}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sub-categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field py-2 pl-9 pr-3 text-sm w-48"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredSubCategories.length} items
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {filteredSubCategories.length > 0 ? (
              <div className="space-y-4">
                {filteredSubCategories.map((subCat) => (
                  <div key={subCat} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all">
                    {editingId === subCat ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Sub-Category Name
                          </label>
                          <input
                            type="text"
                            value={editSubCatName}
                            onChange={(e) => setEditSubCatName(e.target.value)}
                            className="input-field py-2"
                            placeholder="Enter sub-category name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="input-field py-2"
                            placeholder="Enter price"
                            min="1"
                            step="1"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(subCat)}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-800 text-lg">{subCat}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600 mr-2">Price:</span>
                            <span className="text-lg font-bold text-primary">
                              {getPriceForSubCategory(subCat)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStartEdit(subCat)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSubCategory(subCat)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📂</div>
                {searchTerm ? (
                  <>
                    <p>No sub-categories found for "{searchTerm}"</p>
                    <p className="text-sm mt-2">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <p>No sub-categories added yet</p>
                    <p className="text-sm mt-2">Add your first sub-category using the form on the left</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* All Categories Overview */}
      <div className="table-container mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">All Categories Overview</h2>
            <span className="text-sm text-gray-500">Click any category to view its sub-categories</span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainCategories.map((category) => (
              <div
                key={category}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCategory === category 
                    ? 'border-primary bg-primary text-white shadow-md' 
                    : 'border-gray-200 hover:border-primary hover:shadow-sm'
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  handleCancelEdit();
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-800'}`}>
                    {category}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category 
                      ? 'bg-white text-primary' 
                      : 'bg-primary text-white'
                  }`}>
                    {categories[category]?.length || 0}
                  </span>
                </div>
                <div className={`text-sm ${selectedCategory === category ? 'text-gray-100' : 'text-gray-600'}`}>
                  {categories[category]?.length > 0 ? (
                    <>
                      <span className="font-medium">Sub-categories:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {categories[category]?.slice(0, 3).map((subCat, idx) => (
                          <span 
                            key={subCat} 
                            className={`px-2 py-1 rounded text-xs ${
                              selectedCategory === category 
                                ? 'bg-white bg-opacity-20' 
                                : 'bg-gray-100'
                            }`}
                          >
                            {subCat}
                          </span>
                        ))}
                        {categories[category]?.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs bg-gray-200">
                            +{categories[category].length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="italic">No sub-categories added</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Complete Pricing Table */}
      <div className="table-container">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Complete Pricing Table</h2>
          <p className="text-sm text-gray-600 mt-1">All sub-categories with prices across all categories</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Main Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Sub-Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Price (₹)</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mainCategories.map((mainCat) => (
                  categories[mainCat]?.map((subCat, index) => {
                    const priceValue = getPriceForSubCategory(subCat);
                    const isEditing = editingId === subCat;
                    
                    return (
                      <tr 
                        key={`${mainCat}-${subCat}`} 
                        className={`border-t border-gray-100 hover:bg-gray-50 ${
                          isEditing ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="p-4">
                          {index === 0 ? (
                            <div className="font-medium text-gray-800">{mainCat}</div>
                          ) : null}
                        </td>
                        
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editSubCatName}
                              onChange={(e) => setEditSubCatName(e.target.value)}
                              className="input-field py-2 text-sm"
                              placeholder="Sub-category name"
                            />
                          ) : (
                            <div className="font-medium">{subCat}</div>
                          )}
                        </td>
                        
                        <td className="p-4">
                          {isEditing ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">₹</span>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="input-field py-2 text-sm w-32"
                                placeholder="Price"
                                min="1"
                                step="1"
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-primary">{priceValue}</span>
                          )}
                        </td>
                        
                        <td className="p-4">
                          {isEditing ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(subCat)}
                                className="text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-sm bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCategory(mainCat);
                                  handleStartEdit(subCat);
                                }}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCategory(mainCat);
                                  handleDeleteSubCategory(subCat);
                                }}
                                className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )).flat()}
              </tbody>
              {totalSubCategories === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      <div className="text-3xl mb-2">📋</div>
                      <p>No sub-categories added yet</p>
                      <p className="text-sm mt-1">Use the form above to add your first sub-category</p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="p-4 text-right font-medium">Total Sub-Categories:</td>
                    <td colSpan="2" className="p-4 font-bold text-primary">{totalSubCategories}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
      
      {/* System Rules */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <div className="text-blue-800 text-lg mr-3">📋</div>
          <div>
            <h3 className="font-medium text-blue-900">Category Management Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div className="text-blue-700 text-sm">
                <span className="font-bold block mb-1">📝 Add New:</span>
                <ul className="ml-4 list-disc">
                  <li>Select main category</li>
                  <li>Enter sub-category name</li>
                  <li>Set price</li>
                  <li>Prevents duplicates</li>
                </ul>
              </div>
              <div className="text-blue-700 text-sm">
                <span className="font-bold block mb-1">✏️ Edit Existing:</span>
                <ul className="ml-4 list-disc">
                  <li>Edit sub-category name</li>
                  <li>Edit price</li>
                  <li>Inline editing</li>
                  <li>Save/Cancel options</li>
                </ul>
              </div>
              <div className="text-blue-700 text-sm">
                <span className="font-bold block mb-1">🗑️ Delete:</span>
                <ul className="ml-4 list-disc">
                  <li>Delete sub-categories</li>
                  <li>Confirmation dialog</li>
                  <li>Removes from all lists</li>
                  <li>Removes price entry</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-blue-200">
              <p className="text-blue-800 text-sm font-medium">💡 Important Notes:</p>
              <ul className="text-blue-700 text-sm mt-1 ml-4 list-disc">
                <li>Main categories are fixed and cannot be modified</li>
                <li>Only sub-categories can be added, edited, or deleted</li>
                <li>All data is saved automatically to localStorage</li>
                <li>Search functionality available for easy filtering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;