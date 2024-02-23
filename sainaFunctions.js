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
    console.log('---------------------------------------------\nAll offers within a price range:\n');

    filteredOffers.forEach((offer, index) => {
      console.log(
        `Offer ${
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
      { $group: { _id: "$category.name" } },
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
          category: { $in: [category] },
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

    console.log(`---------------------------------------------\nOffers for category: ${category}\n`);

    offersContainingCategory.forEach((offer, index) => {
      console.log(
        `Offer ${index + 1}:\nPrice: $${offer.price} \nActive: ${
          offer.active ? "Yes" : "No"
        }\nIncluded Products: ${offer.products.join(
          ", "
        )}\n---------------------------------------------`
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
        offer: product,
        quantity: quantity,
        status: status,
        additional_detail: additionalDetails,
      });

      await newOrder.save();
      console.log(`---------------------------------------------\nOrder for ${newOrder.offer} has been created with the following details:
      Quantity: ${newOrder.quantity}
      Status: ${newOrder.status}
      Additional Detail: ${newOrder.additional_detail}
      Order ID: ${newOrder._id}\n---------------------------------------------`);
    }
  } catch (error) {
    console.log(error);
  }
}

// menu option 10

export async function shipOrders() {
  try {
    const getPendingOrderChoices = async () => {
      const allOrders = await SalesOrderModel.find({ status: "pending" });
      let choices = [];
      allOrders.forEach((order) => {
        if (order.offer && order.offer.length > 0) {
          choices = choices.concat(order.offer);
        }
      });
      choices.push("Exit");
      return choices;
    };

    let choices = await getPendingOrderChoices();

    const { orderOrOffer } = await inquirer.prompt([
      {
        type: "list",
        name: "orderOrOffer",
        message: "Choose an offer to ship: ",
        choices: choices,
      },
    ]);

    if (orderOrOffer === "Exit") {
      return;
    } else {
      const orderToFetch = await SalesOrderModel.findOne({
        offer: { $all: orderOrOffer.split(', '), $size: orderOrOffer.split(', ').length },
      });

      if (orderToFetch) {
        const products = orderOrOffer.split(', ');

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

          console.log(`\n---------------------------------------------\nStock before sale for ${productName}: ${product.stock}`);
          product.stock -= orderToFetch.quantity;
          console.log(`Stock after sale for ${productName}: ${product.stock}\n---------------------------------------------`);
          await product.save();

          totalPrice += product.price * orderToFetch.quantity;
          totalCost += product.cost * orderToFetch.quantity;
        }

        if (orderToFetch.quantity >= 11) {
          totalPrice *= 0.9; 
          console.log("\nA 10% discount has been applied to your order.\n---------------------------------------------");
        }

        const orderToShip = await SalesOrderModel.findOneAndUpdate(
          { _id: orderToFetch._id },
          { 
            status: "shipped", 
            total_price: totalPrice, 
            total_cost: totalCost,
            date: new Date() 
          },
          { new: true }
        ).exec();

        console.log(`\nUpdated Order Details:\n
        ID: ${orderToShip._id}
        Order: ${orderToShip.offer.join(', ')}
        Quantity: ${orderToShip.quantity}
        Status: ${orderToShip.status} (updated)
        Additional Details: ${orderToShip.additional_detail}
        Total Price: $${orderToShip.total_price}
        Total Cost: $${orderToShip.total_cost}
        Shipped Date: ${orderToShip.date}
        \n---------------------------------------------`);
        console.log(
          "Order has been shipped successfully!\nIt will be delivered within 7 business days\n---------------------------------------------"
        );
      } else {
        console.log("No offer found with the provided name");
      }
    }
    
    choices = await getPendingOrderChoices();


  } catch (error) {
    console.log(error);
  }
}

// menu option 13

export async function viewAllSales() {
  try {
    const allSales = await SalesOrderModel.find({ status: "shipped" });

    if (allSales.length === 0) {
      console.log("No sales found");
      return;
    } else {  
      allSales.forEach((sale, index) => {
        console.log(`Sale ${index + 1}:\n
        Order: ${sale.offer.join(', ')}
        Quantity: ${sale.quantity}
        Status: ${sale.status}
        Additional Details: ${sale.additional_detail}
        Total Price: $${sale.total_price}
        Total Cost: $${sale.total_cost}
        Shipped Date: ${sale.date}
        \n---------------------------------------------`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}
