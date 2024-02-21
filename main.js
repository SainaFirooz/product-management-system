import mongoose, { connect } from "mongoose";
import {
  addNewProduct,
  orderForOffers,
  addNewSupplier,
  sumOfAllProfits,
} from "./mickeFunctions.js";
import inquirer from "inquirer";
import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
  CategoryModel,
} from "./models.js";
import { sampleOffers } from "./sampleData.js";
import { viewAllOffers, specificCategory, orderForProducts, shipOrders, viewAllSales } from "./sainaFunctions.js";
import {addNewCategory, productsByCategory, productsBySupplier, viewSuppliers} from "./miggeFunctions.js"

let supplier_collection = SupplierModel.collection;
let offer_collection = OfferModel.collection;
let salesOrder_collection = SalesOrderModel.collection;
let product_collection = ProductModel.collection;

const connectToDB = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/mms_assignment_2");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

const menu = async () => {
  try {
    while (true) {
      const { choice } = await inquirer.prompt([
        {
          type: "list",
          name: "choice",
          message: "Menu",
          choices: [
            "Add new category",
            "Add new product",
            "View products by category",
            "View products by supplier",
            "View all offers within a price range",
            "View all offers that contain a product from a specific category",
            "View the number of offers based on the number of its products in stock",
            "Create order for products",
            "Create order for offers",
            "Ship orders",
            "Add a new supplier",
            "View suppliers",
            "View all sales",
            "View sum of all profits",
            "Exit",
          ],
        },
      ]);

      switch (choice) {
        case "Add new category":
          await addNewCategory();
          break;
        case "Add new product":
          await addNewProduct();
          break;
        case "View products by category":
          await productsByCategory();
          break;
        case "View products by supplier":
          await productsBySupplier();
          break;
        case "View all offers within a price range":
          await viewAllOffers();
          break;
        case "View all offers that contain a product from a specific category":
          await specificCategory();
          break;
        case "View the number of offers based on the number of its products in stock":
          await productsInStock();
          break;
        case "Create order for products":
          await orderForProducts();
          break;
        case "Create order for offers":
          await orderForOffers();
          break;
        case "Ship orders":
          await shipOrders();
          break;
        case "Add a new supplier":
          await addNewSupplier();
          break;
        case "View suppliers":
          await viewSuppliers();
          break;
        case "View all sales":
          await viewAllSales();
          break;
        case "View sum of all profits":
          await sumOfAllProfits();
          break;
        case "Exit":
          await closeDBconnection();
          return;
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
};

async function closeDBconnection() {
  try {
    await mongoose.disconnect();
    console.log("Leaving menu.", "Disconnected from MongoDB");
  } catch (error) {
    console.log("Error disconnecting from MongoDB", error);
  }
}

(async () => {
  await connectToDB();
  await menu();
})();
