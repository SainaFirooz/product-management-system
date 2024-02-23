import mongoose from "mongoose";

const OfferSchema = mongoose.Schema({
  products: { type: [String] },
  price: { type: Number },
  active: { type: Boolean },
  category: { type: [String] },
});

const SupplierSchema = mongoose.Schema({
  name: { type: String },
  contact: {
    name: { type: String },
    email: { type: String },
  },
});
const CategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  products: [String],
});
const ProductSchema = mongoose.Schema({
  name: { type: String },
  category: CategorySchema,
  price: { type: Number },
  cost: { type: Number },
  stock: { type: Number },
  supplier: SupplierSchema,
});

const SalesOrdersSchema = mongoose.Schema({
  offer: {
    type: [String],
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  additional_detail: {
    type: String,
  },
  total_price: {
    type: Number,
  },
  total_cost: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

export const CategoryModel = mongoose.model("Category", CategorySchema);
export const ProductModel = mongoose.model("Product", ProductSchema);
export const OfferModel = mongoose.model("Offer", OfferSchema);
export const SupplierModel = mongoose.model("Supplier", SupplierSchema);
export const SalesOrderModel = mongoose.model("SalesOrder", SalesOrdersSchema);
