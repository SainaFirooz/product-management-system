import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
  CategoryModel,
} from "./models.js";
import { addNewCategory } from "./miggeFunctions.js";
import inquirer from "inquirer";
let supplier_collection = SupplierModel.collection;
let offer_collection = OfferModel.collection;
let salesOrder_collection = SalesOrderModel.collection;
let product_collection = ProductModel.collection;
let category_collection = CategoryModel.collection;

// Option 2 Add new product
export const addNewProduct = async () => {
  try {
    while (true) {
      const { menu } = await inquirer.prompt([
        {
          type: "list",
          name: "menu",
          message: "Choose from:",
          choices: ["Current suppliers", "New Supplier", "Exit"],
        },
      ]);
      let allSuppliers = await SupplierModel.aggregate([
        {
          $group: { _id: "$name" },
        },
      ]);
      let suppliersList = allSuppliers.map((supplier) => supplier._id);

      if (menu === "New Supplier") {
        await contructProduct(await addNewSupplier());
        return;
      } else if (menu === "Exit") {
        return;
      } else {
        await contructProduct(null);
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const contructProduct = async (newSupplier) => {
  let allSuppliers = await SupplierModel.aggregate([
    {
      $group: { _id: "$name" },
    },
  ]);
  let suppliersList = allSuppliers.map((supplier) => supplier._id);
  console.log("NEW SUPPLIER:", newSupplier);
  if (!newSupplier) {
    console.log("current supplier chosen");
  }
  let supplier_choice = null;
  if (!newSupplier) {
    const { supplier_prompt } = await inquirer.prompt([
      {
        type: "list",
        name: "supplier_prompt",
        message: "Choose Supplier",
        choices: [...suppliersList],
      },
    ]);
    supplier_choice = supplier_prompt;
  } else {
    supplier_choice = newSupplier;
  }

  console.log("SUPPLIER CHOICE: ", supplier_choice);
  const supplier_productList = await ProductModel.aggregate([
    {
      $match: { "supplier.name": supplier_choice },
    },
    {
      $project: {
        _id: 0,
        supplier: 0,
      },
    },
  ]);
  console.log(supplier_productList);
  console.log(`Products from ${supplier_choice}`);
  supplier_productList.forEach((product) => {
    console.log(product.name);
  });

  const currentSupplier = newSupplier
    ? newSupplier
    : await SupplierModel.aggregate([
        {
          $match: { name: supplier_choice },
        },
        { $project: { _id: 0 } },
      ]);
  let newProduct = {
    name: "N/A",
    category: {
      name: "N/A",
      description: "N/A",
      products: [],
    },
    price: 0,
    cost: 0,
    stock: 0,
    supplier: currentSupplier,
  };
  let newItems = { ...newProduct };
  for (const key in newItems) {
    if (key != "category" && key != "supplier") {
      if (isNaN(newItems[key])) {
        newItems[key] = "";
        const { choice } = await inquirer.prompt([
          {
            type: "input",
            name: "choice",
            message: `Enter product ${key}`,
            validate: (value) =>
              isNaN(value) ? true : "Dont use only numbers",
          },
        ]);
        newProduct[key] = await choice;
      } else {
        newItems[key] = 0;
        const { choice } = await inquirer.prompt([
          {
            type: "input",
            name: "choice",
            message: `Enter: ${key}`,
            validate: (value) => (!isNaN(value) ? true : "Use numbers"),
          },
        ]);
        if (key === "cost") {
        }
        newProduct[key] = await choice;
      }
    } else if (key != "supplier") {
      const currentCategories = await CategoryModel.aggregate([
        {
          $group: { _id: "$name" },
        },
      ]);

      const { category_menu } = await inquirer.prompt([
        {
          type: "list",
          name: "category_menu",
          message: "Pick:",
          choices: ["Existing category", "New category"],
          default: "Existing category",
        },
      ]);
      switch (category_menu) {
        case "Existing category": {
          const { category_choice } = await inquirer.prompt([
            {
              type: "list",
              name: "category_choice",
              message: "Add a category",
              choices: [...currentCategories.map((x) => x._id)],
            },
          ]);
          {
            const categoryInfo = await CategoryModel.aggregate([
              {
                $match: { name: category_choice },
              },
            ]);
            newProduct[key] = categoryInfo[0];
            console.log("ADDED CATEGORY:\n-------------------");
            console.log("Name: ", newProduct[key].name);
            console.log("Description: ", newProduct[key].description);
            console.log("-------------------");

            break;
          }
        }
        case "New category": {
          newProduct[key] = await addNewCategory();
          break;
        }
      }
    }
  }
  console.log(
    `-----PRODUCT READY TO INSERT-----\n
  Name: ${newProduct.name}\n
  Category: ${newProduct.category.name}\n
  Price: ${newProduct.price}\n
  Cost: ${newProduct.cost}\n
  Stock Quantity: ${newProduct.stock}\n
  Supplier: ${newProduct.supplier.name}\n
  -----------------------------------`
  );
  const { decision } = await inquirer.prompt([
    {
      name: "decision",
      type: "confirm",
      message: "Insert into collection? (y/n)",
      default: false,
    },
  ]);
  if (decision) {
    await product_collection.insertOne(newProduct);
  } else {
    console.log("Insertion cancelled.\n -------------------------");
    return;
  }
};
//Option 9 Order for offers
export const orderForOffers = async () => {
  try {
    let currentOffers = await OfferModel.find({});
    const mappedOffers = currentOffers.map((offer, index) => {
      return `${index + 1}: ${offer.products.join(", ")}`;
    });
    const { offer_choice } = await inquirer.prompt([
      {
        type: "list",
        name: "offer_choice",
        message: "Offers:",
        choices: [...mappedOffers, "Exit"],
      },
    ]);
    if (offer_choice != "Exit") {
      const FINAL_offer = offer_choice.slice(3);
      console.log(FINAL_offer);
      const { FINAL_quantity } = await inquirer.prompt({
        type: "input",
        name: "FINAL_quantity",
        message: "Select quantity of an offer.",
        validate: (value) => {
          const validNumber = Number(value);
          if (isNaN(validNumber) || !Number.isInteger(validNumber)) {
            return "Please only use whole integers";
          } else {
            if (validNumber > 50 || validNumber <= 0) {
              return "Please enter a valid quantity between 1-50";
            } else {
              return true;
            }
          }
        },
      });

      const { FINAL_details } = await inquirer.prompt({
        type: "input",
        name: "FINAL_details",
        message: "Provide additional details about offer:",
        default: "N/A",
      });
      const newSalesOrder = new SalesOrderModel({
        offer: FINAL_offer.split(", "),
        quantity: FINAL_quantity,
        status: "pending",
        additional_detail: FINAL_details,
      });

      console.log("NEW ORDER READY:", newSalesOrder);

      const { insert_decision } = await inquirer.prompt([
        {
          type: "confirm",
          name: "insert_decision",
          message: "Insert into collection? (y/n)",
          default: false,
        },
      ]);
      if (insert_decision) {
        salesOrder_collection.insertOne(newSalesOrder);
      } else {
        console.log("Operation cancelled.\n -------------------------");
        return;
      }
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addNewSupplier = async () => {
  try {
    const { s_name, sc_name, sc_email } = await inquirer.prompt([
      {
        type: "input",
        name: "s_name",
        message: "New supplier name:",
      },
      {
        type: "input",
        name: "sc_name",
        message: "New supplier contact:",
      },
      {
        type: "input",
        name: "sc_email",
        message: "New supplier email:",
      },
    ]);
    const newSupplier = new SupplierModel({
      name: s_name,
      contact: {
        name: sc_name,
        email: sc_email,
      },
    });
    const { insert_decision } = await inquirer.prompt([
      {
        input: "confirm",
        name: "insert_decision",
        message: "Insert new supplier into collection? (y/n)",
        default: "n",
      },
    ]);
    if (insert_decision === "y") {
      await supplier_collection.insertOne(newSupplier);
      return newSupplier;
    } else {
      console.log("Operation cancelled. \n---------------------");
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const sumOfAllProfits = async () => {
  try {
    let productListForPrompt = await ProductModel.aggregate([
      {
        $match: { price: { $gt: 0 } },
      },
      { $project: { _id: 0, name: 1 } },
    ]);
    while (true) {
      const { first_selection } = await inquirer.prompt([
        {
          type: "list",
          name: "first_selection",
          message: "Show sum of profits from:",
          choices: ["All sales", "Sales containing specific product", "Exit"],
        },
      ]);
      switch (first_selection) {
        case "All sales": {
          let allSales = await SalesOrderModel.aggregate([
            {
              $match: {
                total_cost: { $gt: 0 },
              },
            },
            {
              $group: {
                _id: null,
                totalProfit: {
                  $sum: {
                    $multiply: [
                      { $subtract: ["$total_price", "$total_cost"] },
                      0.7,
                    ],
                  },
                },
                sales: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalProfit: 1,
                sales: 1,
              },
            },
          ]);
          console.log(
            `------------------------------\nno. Sales: ${allSales[0].sales}\nTotal profit: ${allSales[0].totalProfit}\n------------------------------`
          );

          break;
        }
        case "Sales containing specific product": {
          const { search_variant } = await inquirer.prompt([
            {
              type: "list",
              name: "search_variant",
              choices: ["Find from list", "Search for product", "Return"],
            },
          ]);
          switch (search_variant) {
            case "Find from list": {
              const { product_choice } = await inquirer.prompt([
                {
                  type: "list",
                  name: "product_choice",
                  message: "Please choose",
                  choices: [...productListForPrompt.map((x) => x.name).sort()],
                },
              ]);
              await findProfit(product_choice);
              break;
            }
            case "Search for product": {
              const { product_choice } = await inquirer.prompt([
                {
                  type: "input",
                  name: "product_choice",
                  message: "Enter product:",
                },
              ]);
              if (
                [...productListForPrompt.map((x) => x.name)].includes(
                  product_choice
                )
              ) {
                await findProfit(product_choice);
              } else {
                console.log(
                  "------------------------------\nProduct not found\n------------------------------"
                );
                break;
              }
            }
            case "Return": {
              break;
            }
          }
          break;
        }
        case "Exit": {
          return;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const findProfit = async (prompt_choice) => {
  let productSales = await SalesOrderModel.aggregate([
    {
      $match: { offer: { $in: [prompt_choice] } },
    },
    {
      $group: {
        _id: null,
        totalProfit: {
          $sum: {
            $multiply: [{ $subtract: ["$total_price", "$total_cost"] }, 0.7],
          },
        },
        sales: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, totalProfit: 1, sales: 1 },
    },
  ]);
  if (productSales[0]) {
    let roundedProfit = Math.round(productSales[0].totalProfit * 100);
    roundedProfit = roundedProfit / 100;
    console.log(
      `\n------------------------------\nProduct: ${prompt_choice}\nno. Sales: ${productSales[0].sales}\nTotal profit: ${roundedProfit}\n------------------------------`
    );
  }
};
export const productsInStock = async () => {
  try {
    const offersList = await OfferModel.aggregate([
      {
        $match: { price: { $gt: 0 } },
      },
    ]);
    let offers_by_stock = {
      notInStock: [],
      partialStock: [],
      fullStock: [],
    };
    let o = offersList;
    for (let o_index = 0; o_index < o.length; o_index++) {
      let stockLength = 0;
      for (let i = 0; i < o[o_index].products.length; i++) {
        const matchingProduct = await ProductModel.aggregate([
          {
            $match: { name: { $in: [o[o_index].products[i]] } },
          },
        ]);
        matchingProduct[0].stock > 0 && stockLength++;
      }
      if (stockLength === o[o_index].products.length) {
        offers_by_stock.fullStock.push(o[o_index]);
      } else if (stockLength > 0) {
        offers_by_stock.partialStock.push(o[o_index].products.length);
      } else {
        offers_by_stock.notInStock.push(o[o_index].products.length);
      }
    }
    while (true) {
      const { menu_choice } = await inquirer.prompt([
        {
          type: "list",
          name: "menu_choice",
          message: "Show:",
          choices: [
            "Offers with all products in stock",
            "Offers with some products in stock",
            "Offers with no products in stock",
            "Exit",
          ],
        },
      ]);
      switch (menu_choice) {
        case "Offers with all products in stock": {
          stockMessage(offers_by_stock.fullStock);
          break;
        }
        case "Offers with some products in stock": {
          stockMessage(offers_by_stock.partialStock);
          break;
        }
        case "Offers with no products in stock": {
          stockMessage(offers_by_stock.notInStock);
          break;
        }
        case "Exit": {
          return;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const stockMessage = (stockStatus) => {
  stockStatus.forEach((offer, index) => {
    console.log(
      `Offer 1${index}\nProducts: ${offer.products.join(" ")}\nPrice: $${
        offer.price
      }\nActive: ${
        offer.active ? "Yes" : "No"
      }\n---------------------------------------------`
    );
  });
};
//AGGREGATE FRÅN OFFERS => ALL
//LOOPA IGENOM CHECKA VIA AGGREGATE FRÅN PRODUCTS OM PRODUCTEN HAR STOCK > 0
//(AGGREGGATE FRÅN PRODUCTS => stock)
// LISTA COUNT OF OFFERS
//1 ALL PRODUCTS IN STOCK
//2 SOME PRODUCTS IN STOCK
//3 NO PRODUCTS IN STOCK
