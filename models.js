import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  cost: { type: Number },
  stock: { type: Number },
});

const offerSchema = mongoose.Schema({
  products: { type: String },
  price: { type: Number },
  active: { type: Boolean },
});

const supplierSchema = mongoose.Schema({
  name: { type: String },
  contact: {
    name: { type: String },
    email: { type: String },
  },
});

//chatGPT förslag

const salesOrderSchema = mongoose.Schema({
  items: [
    {
      type: { type: String, enum: ["product", "offer"] }, // Either "product" or "offer"
      item: { type: mongoose.Schema.Types.ObjectId, refPath: "items.type" }, // Reference to either Product or Offer
      quantity: { type: Number },
    },
  ],
  status: { type: String },
  totalCost: { type: Number },
  totalRevenue: { type: Number },
  totalProfit: { type: Number },
  profitTax: { type: Number },
  profitPerOffer: [
    {
      offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
      profit: { type: Number },
    },
  ],
  date: { type: Date },
});

//Sainas förslag
const salesOrdersSchema = new mongoose.Schema({
  order: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);

export const productModel = mongoose.model("Product", productSchema);
export const offerModel = mongoose.model("Offer", offerSchema);
export const supplierModel = mongoose.model("Supplier", supplierSchema);
export const salesOrderModel = mongoose.model("SalesOrder", salesOrderSchema);
