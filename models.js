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

const salesOrdersSchema = mongoose.Schema({
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

const SalesOrder = mongoose.model("SalesOrder", salesOrdersSchema);

export const productModel = mongoose.model("Product", productSchema);
export const offerModel = mongoose.model("Offer", offerSchema);
export const supplierModel = mongoose.model("Supplier", supplierSchema);
export const salesOrderModel = mongoose.model("SalesOrder", salesOrdersSchema);
