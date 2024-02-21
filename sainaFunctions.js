import inquirer from "inquirer";
import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
} from "./models.js";
import { sampleOffers } from "./sampleData.js";

// menu option 5
export async function viewAllOffers() {
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

export async function specificCategory() {
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

// menu option 8
export async function orderForProducts() {
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
        message: "Choose a product: ",
        choices: [...allProducts.map((product) => product._id), "Exit"],
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
        additional_detail: additionalDetails,
      });

      await newOrder.save();
      console.log(`Order for ${newOrder.order[0]} has been created with the following details:
      Quantity: ${newOrder.quantity}
      Status: ${newOrder.status}
      Additional Detail: ${newOrder.additional_detail}
      Order ID: ${newOrder._id}`);
      }
  } catch (error) {
    console.log(error);
  }
}

// menu option 10
export async function shipOrders() {}

// menu option 13
export async function viewAllSales() {
}
