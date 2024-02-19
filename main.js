import mongoose, { connect } from "mongoose";
import inquirer from "inquirer";
import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
} from "./models.js";

let supplierModel_collection = SupplierModel.collection;
await connect("mongodb://127.0.0.1:27017/mms_assignment_2");
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
          break;
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
};

// menu option 1
async function addNewCategory() {}

// menu option 2
async function addNewProduct() {
  try {
    let allSuppliers = await SupplierModel.aggregate([
      {
        $group: { _id: "$name" },
      },
    ]);
    console.log(allSuppliers);

    let suppliersList = allSuppliers.map((supplier) => supplier._id);

    while (true) {
      const { supplier_choice } = await inquirer.prompt([
        {
          type: "list",
          name: "Suppliers list",
          message: "Choose Supplier",
          choices: [...suppliersList, "New supplier", "Exit"],
        },
      ]);
      if (supplier_choice === "New Supplier") {
      } else if (supplier_choice === "Exit") {
        break;
      } else {
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// menu option 3
async function productsByCategory() {}

// menu option 4
async function productsBySupplier() {}

// menu option 5
async function viewAllOffers() {}

// menu option 6
async function specificCategory() {}

// menu option 7
async function productsInStock() {}

// menu option 8
async function orderForProducts() {}

// menu option 9
async function orderForOffers() {}

// menu option 10
async function shipOrders() {}

// menu option 11
async function addNewSupplier() {   
      
}


// menu option 12
async function viewSuppliers() {}
// menu option 13
async function viewAllSales() {}

// menu option 14
async function sumOfAllProfits() {}

// Exit
async function closeDBconnection() {
  await mongoose.connection.close();
  process.exit();
}

(async () => {

    await menu();
  })();
  

