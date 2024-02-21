import mongoose, { connect } from "mongoose";
import {
  addNewProduct,
  orderForOffers,
  addNewSupplier,
} from "./mickeFunctions.js";
import inquirer from "inquirer";
import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
} from "./models.js";
import { sampleOffers } from "./sampleData.js";

let supplier_collection = SupplierModel.collection;
let offer_collection = OfferModel.collection;
let salesOrder_collection = SalesOrderModel.collection;
let product_collection = ProductModel.collection;
// await connect("mongodb://127.0.0.1:27017/mms_assignment_2");

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

// menu option 1
async function addNewCategory() {}

// menu option 2

// menu option 3
async function productsByCategory() {}

// menu option 4
async function productsBySupplier() {}

// menu option 5
async function viewAllOffers() {
  try {
    const { minPrice, maxPrice } = await inquirer.prompt([
      {
        type: "input",
        name: "minPrice",
        message: "Enter minimum price",
        validate: (value) => (!isNaN(value) ? true : "Please enter a number"),
        default: 0,
      },
      {
        type: "input",
        name: "maxPrice",
        message: "Enter maximum price",
        validate: (value) => (!isNaN(value) ? true : "Please enter a number"),
        default: 2000,
      },
    ]);

    const filteredOffers = await OfferModel.aggregate([
      {
        $match: {
          price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        },
      },
    ]);

    filteredOffers.forEach((offer, index) => {
      console.log(
        `All offers within a price range:\nOffer ${
          index + 1
        }:\nProducts: ${offer.products.join(", ")}\nPrice: $${
          offer.price
        }\nActive: ${offer.active ? "Yes" : "No"}\n------------------------`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

// menu option 6

async function specificCategory() {
  try {
    const allCategories = await ProductModel.aggregate([
      { $group: { _id: "$category" } },
    ]);

    const { category } = await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: "Choose a category",
        choices: allCategories.map((category) => category._id).concat("Exit"),
      },
    ]);

    if (category === "Exit") {
      return;
    }

    const offersContainingCategory = await OfferModel.aggregate([
      {
        $match: {
          $or: [{ category: category }, { category: { $in: [category] } }],
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$_id",
          price: { $first: "$price" },
          active: { $first: "$active" },
          products: { $push: "$products" },
        },
      },
    ]);

    if (offersContainingCategory.length === 0) {
      console.log(`No offers found for category: ${category}`);
      return;
    }

    offersContainingCategory.forEach((offer, index) => {
      console.log(
        `Offer ${index + 1}:\nPrice: $${offer.price} \nActive: ${
          offer.active ? "Yes" : "No"
        }\nIncluded Products: ${offer.products.join(
          ", "
        )}\n------------------------`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

// menu option 7
async function productsInStock() {}

// menu option 8
async function orderForProducts() {
  try {
    const allProducts = await ProductModel.aggregate([
      {
        $group: { _id: "$name" },
      },
    ]);
    const { product } = await inquirer.prompt([
      {
        type: "list",
        name: "product",
        message: "Choose a product",
        choices: allProducts.map((product) => product._id).concat("Exit"),
      },
    ]);

    if (product === "Exit") {
      return;
    } else {
      const { quantity, status, additionalDetails } = await inquirer.prompt([
        {
          type: "input",
          name: "quantity",
          message: "Enter quantity: ",
          validate: (value) => (!isNaN(value) ? true : "Please enter a number"),
          default: 1,
        },
        {
          type: "input",
          name: "status",
          message: "Enter status: ",
          default: "pending",
        },
        {
          type: "input",
          name: "additionalDetails",
          message: "Enter additional details: ",
          default: "N/A",
        },
      ]);

      const newOrder = new SalesOrderModel({
        order: product,
        quantity: quantity,
        status: status,
        orderadditional_detail: additionalDetails,
      });

      await newOrder.save();
      console.log(`Order for ${product} has been created\n ${newOrder}`);
    }
  } catch (error) {
    console.log(error);
  }
}

// menu option 9

// menu option 10
async function shipOrders() {}

// menu option 11

// menu option 12
async function viewSuppliers() {}
// menu option 13
async function viewAllSales() {}

// menu option 14
async function sumOfAllProfits() {}

// Exit
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
