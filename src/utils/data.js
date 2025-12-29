// Dummy data for the entire application
export const dummyData = {
  admin: {
    username: "admin@laundry.com",
    password: "admin123"
  },
  
  stats: {
    totalCustomers: 156,
    totalOrders: 342,
    totalClothes: 1287,
    deliveredOrders: 298,
    pendingPayments: 44,
    monthlyBillingCustomers: 38
  },
  
  customers: [
    {
      id: "CUST-001",
      name: "Suresh Kumar",
      mobile: "+91 9876543210",
      loginMethod: "OTP",
      registrationDate: "2023-10-15",
      lastLogin: "2023-12-01 14:30",
      totalOrders: 12,
      totalClothes: 45,
      monthlyBilling: "ON",
      email: "suresh.kumar@example.com",
      address: "123 Main St, Mumbai"
    },
    {
      id: "CUST-002",
      name: "Priya Sharma",
      mobile: "+91 9876543211",
      loginMethod: "Email",
      registrationDate: "2023-09-22",
      lastLogin: "2023-12-02 10:15",
      totalOrders: 8,
      totalClothes: 32,
      monthlyBilling: "OFF",
      email: "priya.sharma@example.com",
      address: "456 Park Ave, Delhi"
    },
    {
      id: "CUST-003",
      name: "Rahul Patel",
      mobile: "+91 9876543212",
      loginMethod: "OTP",
      registrationDate: "2023-11-05",
      lastLogin: "2023-12-01 16:45",
      totalOrders: 5,
      totalClothes: 18,
      monthlyBilling: "ON",
      email: "rahul.patel@example.com",
      address: "789 Oak St, Bangalore"
    },
    {
      id: "CUST-004",
      name: "Anjali Reddy",
      mobile: "+91 9876543213",
      loginMethod: "Email",
      registrationDate: "2023-08-30",
      lastLogin: "2023-11-30 09:20",
      totalOrders: 15,
      totalClothes: 62,
      monthlyBilling: "ON",
      email: "anjali.reddy@example.com",
      address: "321 Pine Rd, Chennai"
    },
    {
      id: "CUST-005",
      name: "Vikram Singh",
      mobile: "+91 9876543214",
      loginMethod: "OTP",
      registrationDate: "2023-10-28",
      lastLogin: "2023-12-02 18:10",
      totalOrders: 3,
      totalClothes: 11,
      monthlyBilling: "OFF",
      email: "vikram.singh@example.com",
      address: "654 Maple St, Kolkata"
    }
  ],
  
  orders: [
    {
      orderId: "ORD-2409-001",
      customerName: "Suresh Kumar",
      customerId: "CUST-001",
      orderSource: "Customer App",
      orderDate: "2023-12-01 10:30",
      status: "Processing",
      paymentType: "Cash on Delivery",
      totalClothes: 5,
      paymentStatus: "Unpaid",
      totalAmount: 450,
      pickupAddress: "123 Main St, Mumbai",
      deliveryAddress: "123 Main St, Mumbai",
      preferredDelivery: "2023-12-03",
      deliveryPerson: null,
      items: [
        { itemId: "ITEM-2409-001", category: "Men's Wear", subCategory: "Shirt", notes: "Collar stain", price: 80 },
        { itemId: "ITEM-2409-002", category: "Men's Wear", subCategory: "Shirt", notes: "Normal", price: 80 },
        { itemId: "ITEM-2409-003", category: "Men's Wear", subCategory: "Trouser", notes: "Wash & Iron", price: 120 },
        { itemId: "ITEM-2409-004", category: "Men's Wear", subCategory: "Blazer", notes: "Dry Clean", price: 150 },
        { itemId: "ITEM-2409-005", category: "Household", subCategory: "Bedsheet", notes: "Double bed", price: 120 }
      ]
    },
    {
      orderId: "ORD-2409-002",
      customerName: "Priya Sharma",
      customerId: "CUST-002",
      orderSource: "Delivery App",
      orderDate: "2023-12-01 14:15",
      status: "Picked Up",
      paymentType: "Online",
      totalClothes: 3,
      paymentStatus: "Paid",
      totalAmount: 290,
      pickupAddress: "456 Park Ave, Delhi",
      deliveryAddress: "456 Park Ave, Delhi",
      preferredDelivery: "2023-12-02",
      deliveryPerson: { name: "Raj Kumar", id: "DP-001", mobile: "+91 9876543290" },
      items: [
        { itemId: "ITEM-2409-006", category: "Women's Wear", subCategory: "Saree", notes: "Silk", price: 150 },
        { itemId: "ITEM-2409-007", category: "Women's Wear", subCategory: "Kurti", notes: "Cotton", price: 90 },
        { itemId: "ITEM-2409-008", category: "Women's Wear", subCategory: "Dress", notes: "Party wear", price: 150 }
      ]
    },
    {
      orderId: "ORD-2409-003",
      customerName: "Rahul Patel",
      customerId: "CUST-003",
      orderSource: "Customer App",
      orderDate: "2023-11-30 09:45",
      status: "Ready",
      paymentType: "Monthly Billing",
      totalClothes: 4,
      paymentStatus: "Pending",
      totalAmount: 320,
      pickupAddress: "789 Oak St, Bangalore",
      deliveryAddress: "789 Oak St, Bangalore",
      preferredDelivery: "2023-12-01",
      deliveryPerson: null,
      items: [
        { itemId: "ITEM-2409-009", category: "Men's Wear", subCategory: "Shirt", notes: "Normal", price: 80 },
        { itemId: "ITEM-2409-010", category: "Men's Wear", subCategory: "Jeans", notes: "Dark wash", price: 100 },
        { itemId: "ITEM-2409-011", category: "Men's Wear", subCategory: "Jacket", notes: "Winter", price: 120 },
        { itemId: "ITEM-2409-012", category: "Wash & Iron", subCategory: "Regular", notes: "Normal load", price: 20 }
      ]
    }
  ],
  
  monthlyBills: [
    {
      billId: "BILL-2023-11",
      customerId: "CUST-001",
      customerName: "Suresh Kumar",
      mobile: "+91 9876543210",
      companyName: "Suresh Enterprises",
      month: "November 2023",
      status: "Paid",
      totalAmount: 1250,
      items: 15,
      orders: ["ORD-2311-001", "ORD-2311-002", "ORD-2311-003"],
      itemDetails: [
        { itemId: "ITEM-2311-001", orderId: "ORD-2311-001", category: "Men's Wear", subCategory: "Shirt", price: 80 },
        { itemId: "ITEM-2311-002", orderId: "ORD-2311-001", category: "Men's Wear", subCategory: "Trouser", price: 120 }
      ],
      createdAt: "2023-11-30",
      dueDate: "2023-12-10"
    },
    {
      billId: "BILL-2023-10",
      customerId: "CUST-002",
      customerName: "Priya Sharma",
      mobile: "+91 9876543211",
      companyName: "Priya Fashion House",
      month: "October 2023",
      status: "Pending",
      totalAmount: 890,
      items: 8,
      orders: ["ORD-2310-001", "ORD-2310-002"],
      itemDetails: [
        { itemId: "ITEM-2310-001", orderId: "ORD-2310-001", category: "Women's Wear", subCategory: "Saree", price: 150 },
        { itemId: "ITEM-2310-002", orderId: "ORD-2310-001", category: "Women's Wear", subCategory: "Kurti", price: 90 }
      ],
      createdAt: "2023-10-31",
      dueDate: "2023-11-10"
    }
  ],
  
  deliveryPersons: [
    {
      id: "DP-001",
      name: "Raj Kumar",
      mobile: "+91 9876543290",
      totalOrders: 45,
      totalClothes: 210,
      status: "Active",
      joinDate: "2023-08-15"
    },
    {
      id: "DP-002",
      name: "Amit Singh",
      mobile: "+91 9876543291",
      totalOrders: 38,
      totalClothes: 185,
      status: "Active",
      joinDate: "2023-09-01"
    }
  ],
  
  categories: {
    "Men's Wear": ["Shirt", "Trouser", "Jeans", "Blazer", "Jacket", "T-shirt", "Shorts"],
    "Women's Wear": ["Saree", "Kurti", "Dress", "Blouse", "Skirt", "Top", "Lehenga"],
    "Kids Wear": ["T-shirt", "Shorts", "Dress", "School Uniform", "Sweater"],
    "Household": ["Bedsheet", "Curtain", "Table cloth", "Towel", "Blanket"],
    "Steam": ["Suit", "Coat", "Dress Material", "Formal Wear"],
    "Wash & Iron": ["Regular", "Express", "Bulk"],
    "Other": ["Bag", "Shoes", "Cap", "Accessories"]
  },
  
  categoryPrices: {
    "Shirt": 80,
    "Trouser": 120,
    "Saree": 150,
    "Kurti": 90,
    "Bedsheet": 120,
    "Curtain": 180,
    "Suit": 150,
    "Regular": 20,
    "Bag": 200
  }
};

// Export order statuses
export const orderStatuses = [
  "Order Placed",
  "Picked Up",
  "Processing",
  "Ready",
  "Delivered"
];

// Helper function to get data from storage
export const getData = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
};

// Helper function to save data to storage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Helper function to get stats
export const getStats = () => {
  try {
    const item = localStorage.getItem('laundryStats');
    return item ? JSON.parse(item) : {
      totalCustomers: 0,
      totalOrders: 0,
      totalClothes: 0,
      deliveredOrders: 0,
      pendingPayments: 0,
      monthlyBillingCustomers: 0
    };
  } catch (error) {
    console.error('Error reading stats:', error);
    return {
      totalCustomers: 0,
      totalOrders: 0,
      totalClothes: 0,
      deliveredOrders: 0,
      pendingPayments: 0,
      monthlyBillingCustomers: 0
    };
  }
};

// Helper function to generate next bill ID
export const generateNextBillId = () => {
  const bills = getData('monthlyBills') || dummyData.monthlyBills;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const formattedMonth = currentMonth.toString().padStart(2, '0');
  
  const currentMonthBills = bills.filter(bill => 
    bill.billId.includes(`-${currentYear}-${formattedMonth}`)
  );
  
  const nextNumber = currentMonthBills.length + 1;
  return `BILL-${currentYear}-${formattedMonth}-${nextNumber.toString().padStart(3, '0')}`;
};

// Helper function to generate item ID
export const generateItemId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ITEM-${timestamp}-${random}`;
};