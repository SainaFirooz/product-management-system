export const sampleProducts = [
  {
    name: "Laptop",
    category: "Electronics",
    price: 1000,
    cost: 800,
    stock: 50,
  },
  {
    name: "Smartphone",
    category: "Electronics",
    price: 800,
    cost: 600,
    stock: 40,
  },
  {
    name: "T-shirt",
    category: "Clothing",
    price: 20,
    cost: 10,
    stock: 100,
  },
  {
    name: "Refrigerator",
    category: "Home Appliances",
    price: 1200,
    cost: 1000,
    stock: 30,
  },
  {
    name: "Shampoo",
    category: "Beauty & Personal Care",
    price: 10,
    cost: 5,
    stock: 80,
  },
  {
    name: "Soccer Ball",
    category: "Sports & Outdoors",
    price: 30,
    cost: 20,
    stock: 60,
  },
];

export const sampleOffers = [
  {
    products: ["Laptop", "Smartphone"],
    price: 1800,
    active: true,
  },
  {
    products: ["T-shirt", "Shampoo"],
    price: 30,
    active: true,
  },
  {
    products: ["Refrigerator", "Smartphone", "Soccer Ball"],
    price: 1830,
    active: false,
  },
];
export const sampleSuppliers = [
  {
    name: "Electronics Supplier Inc.",
    contact: {
      name: "John Doe",
      email: "john@electronicsupplier.com",
    },
  },
  {
    name: "Fashion Supplier Co.",
    contact: {
      name: "Jane Smith",
      email: "jane@fashionsupplier.com",
    },
  },
];
export const sampleOrders = [
  {
    offer: "Offer 1",
    quantity: 2,
    status: "pending",
  },
  {
    offer: "Offer 3",
    quantity: 1,
    status: "pending",
  },
];
