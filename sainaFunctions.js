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
        }\nActive: ${
          offer.active ? "Yes" : "No"
        }\n---------------------------------------------`
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
          validate: (value) =>
            !isNaN(value) ? true : "Please enter a number: ",
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
      console.log(`Order for ${newOrder.order} has been created with the following details:
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

export async function shipOrders() {
  try {
    const allOrders = await SalesOrderModel.find({ status: "pending" });

    let choices = [];

    allOrders.forEach((order) => {
      if (order.order) {
        choices.push(order.order);
      } else if (order.offer) {
        choices.push(order.offer);
      }
    });

    choices.push("Exit");

    const { orderOrOffer } = await inquirer.prompt([
      {
        type: "list",
        name: "orderOrOffer",
        message: "Choose an order to ship: ",
        choices: choices,
      },
    ]);

    if (orderOrOffer === "Exit") {
      return;
    } else {
      const orderToFetch = await SalesOrderModel.findOne({
        $or: [{ order: orderOrOffer }, { offer: orderOrOffer }],
      });

      if (orderToFetch) {
        const products = orderOrOffer.split(' ');

        let totalPrice = 0;
        let totalCost = 0;

        for (const productName of products) {
          let product = await ProductModel.findOne({ name: productName.trim() });

          if (!product) {
            console.log(`Product ${productName} not found`);
            continue;
          }

          if (product.stock < orderToFetch.quantity) {
            console.log('Not enough stock to complete the order');
            return;
          }

          console.log(`Stock before sale for ${productName}: ${product.stock}`);
          product.stock -= orderToFetch.quantity;
          console.log(`Stock after sale for ${productName}: ${product.stock}`);
          await product.save();

          totalPrice += product.price * orderToFetch.quantity;
          totalCost += product.cost * orderToFetch.quantity;
        }

        if (orderToFetch.quantity >= 11) {
          totalPrice *= 0.9; 
          console.log("A 10% discount has been applied to your order.");
        }

        const orderToShip = await SalesOrderModel.findOneAndUpdate(
          { $or: [{ order: orderOrOffer }, { offer: orderOrOffer }] },
          { status: "shipped", total_price: totalPrice, total_cost: totalCost },
          { new: true }
        ).exec();

        console.log(`Updated Order Details:
        ID: ${orderToShip._id}
        Product: ${orderToShip.order || orderToShip.offer}
        Quantity: ${orderToShip.quantity}
        Status: ${orderToShip.status} (updated)
        Additional Details: ${orderToShip.additional_detail}
        Total Price: ${orderToShip.total_price}
        Total Cost: ${orderToShip.total_cost}
         `);
        console.log(
          "Order has been shipped successfully!\nIt will be delivered within 7 business days\n---------------------------------------------"
        );
      } else {
        console.log("No order or offer found with the provided name");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// menu option 13

export async function viewAllSales() {
  try {
    const allSales = await SalesOrderModel.find({});

    allSales.forEach((sale, index) => {
      let orderOrOffer = sale.order
        ? `Order: ${sale.order}`
        : `Offer: ${sale.offer}`;
      console.log(
        `Sale ${index + 1}:\n${orderOrOffer}\nQuantity: ${
          sale.quantity
        }\nStatus: ${sale.status}\nAdditional Details: ${
          sale.additional_detail
        }\n------------------------`
      );
    });
  } catch (error) {
    console.log(error);
  }
}
