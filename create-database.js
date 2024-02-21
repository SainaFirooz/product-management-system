import mongoose, { connect } from "mongoose";
import {
  SalesOrderModel,
  ProductModel,
  OfferModel,
  SupplierModel,
  CategoryModel
} from "./models.js";
import {
  sampleOffers,
  sampleProducts,
  sampleOrders,
  sampleSuppliers,
  sampleCategories
} from "./sampleData.js";
await connect("mongodb://127.0.0.1:27017/mms_assignment_2");

const salesOrderModel_collection = await SalesOrderModel.createCollection();
const productModel_collection = await ProductModel.createCollection();
const offerModel_collection = await OfferModel.createCollection();
const supplierModel_collection = await SupplierModel.createCollection();
const categoryModel_collection = await CategoryModel.createCollection();

salesOrderModel_collection.insertMany(sampleOrders);
productModel_collection.insertMany(sampleProducts);
offerModel_collection.insertMany(sampleOffers);
supplierModel_collection.insertMany(sampleSuppliers);
categoryModel_collection.insertMany(sampleCategories)
