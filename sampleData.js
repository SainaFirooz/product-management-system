export const sampleProducts = [
  {
    name: "Laptop",
    category: "Electronics",
    price: 1000,
    cost: 800,
    stock: 50,
    supplier: {
      name: "Electronics Supplier Inc.",
      contact: {
        name: "John Doe",
        email: "john@electronicsupplier.com",
      },
    },
  },
  {
    name: "Smartphone",
    category: "Electronics",
    price: 800,
    cost: 600,
    stock: 40,
    supplier: {
      name: "Electronics Supplier Inc.",
      contact: {
        name: "John Doe",
        email: "john@electronicsupplier.com",
      },
    },
  },
  {
    name: "T-shirt",
    category: "Clothing",
    price: 20,
    cost: 10,
    stock: 100,
    supplier: {
      name: "Entersport Active Co.",
      contact: {
        name: "Thomas Thomzel",
        email: "Thomas@eactive.com",
      },
    },
  },
  {
    name: "Refrigerator",
    category: "Home Appliances",
    price: 1200,
    cost: 1000,
    stock: 30,
    supplier: {
      name: " Arlos Whitewash and Cleaning Inc.",
      contact: {
        name: "Jasmine Greenland",
        email: "greenlandjasmine@arlos.com",
      },
    },
  },
  {
    name: "Shampoo",
    category: "Beauty & Personal Care",
    price: 10,
    cost: 5,
    stock: 80,
    supplier: {
      name: "Fashion Supplier Co.",
      contact: {
        name: "Jane Smith",
        email: "jane@fashionsupplier.com",
      },
    },
  },
  {
    name: "Soccer Ball",
    category: "Sports & Outdoors",
    price: 30,
    cost: 20,
    stock: 60,
    supplier: {
      name: "Carlos Sports and Hiking Co.",
      contact: {
        name: "Carlos Di Amenni",
        email: "carlos78@sportsandhiking.com",
      },
    },
  },
];

export const sampleOffers = [
  {
    products: ["Laptop", "Smartphone"],
    price: 1800,
    active: true,
    category: ["Electronics"]
  },
  {
    products: ["T-shirt", "Shampoo"],
    price: 30,
    active: true,
    category: ["Clothing", "Beauty & Personal Care"]
  },
  {
    products: ["Refrigerator", "Smartphone", "Soccer Ball"],
    price: 1830,
    active: false,
    category: ["Home Appliances", "Electronics", "Sports & Outdoors"]
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
  {
    name: "Carlos Sports and Hiking Co.",
    contact: {
      name: "Carlos Di Amenni",
      email: "carlos78@sportsandhiking.com",
    },
  },
  {
    name: "Arlos Whitewash and Cleaning Inc.",
    contact: {
      name: "Jasmine Greenland",
      email: "greenlandjasmine@arlos.com",
    },
  },
  {
    name: "Entersport Active Co.",
    contact: {
      name: "Thomas Thomzel",
      email: "Thomas@eactive.com",
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
