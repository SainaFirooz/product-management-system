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

const ProductSchema = mongoose.Schema({
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  cost: { type: Number },
  stock: { type: Number },
  supplier: SupplierSchema,
});

const SalesOrdersSchema = mongoose.Schema({
  order: {
    type: [String],
  },
  offer: {
    type: String,
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
});

const CategorySchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  products: [String]
})

export const CategoryModel = mongoose.model("Category", CategorySchema)
export const ProductModel = mongoose.model("Product", ProductSchema);
export const OfferModel = mongoose.model("Offer", OfferSchema);
export const SupplierModel = mongoose.model("Supplier", SupplierSchema);
export const SalesOrderModel = mongoose.model("SalesOrder", SalesOrdersSchema);
