import mongoose, { connect } from "mongoose";
import {
  salesOrderModel,
  productModel,
  offerModel,
  supplierModel,
} from "./models.js";
import {
  sampleOffers,
  sampleProducts,
  sampleOrders,
  sampleSuppliers,
} from "./sampleData.js";
await connect("mongodb://127.0.0.1:27017/mms_assignment_2");

const salesOrderModel_collection = await salesOrderModel.createCollection();
const productModel_collection = await productModel.createCollection();
const offerModel_collection = await offerModel.createCollection();
const supplierModel_collection = await supplierModel.createCollection();

salesOrderModel_collection.insertMany(sampleOrders);
productModel_collection.insertMany(sampleProducts);
offerModel_collection.insertMany(sampleOffers);
supplierModel_collection.insertMany(sampleSuppliers);
