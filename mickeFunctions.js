import {
  SupplierModel,
  OfferModel,
  SalesOrderModel,
  ProductModel,
} from "./models.js";
import inquirer from "inquirer";
let supplier_collection = SupplierModel.collection;
let offer_collection = OfferModel.collection;
let salesOrder_collection = SalesOrderModel.collection;
let product_collection = ProductModel.collection;

// Option 2 Add new product
export const addNewProduct = async () => {
  try {
    let allSuppliers = await SupplierModel.aggregate([
      {
        $group: { _id: "$name" },
      },
    ]);
    let suppliersList = allSuppliers.map((supplier) => supplier._id);
    while (true) {
      const { supplier_choice } = await inquirer.prompt([
        {
          type: "list",
          name: "supplier_choice",
          message: "Choose Supplier",
          choices: [...suppliersList, "New supplier", "Exit"],
        },
      ]);
      if (supplier_choice === "New Supplier") {
        break;
      } else if (supplier_choice === "Exit") {
        return;
      } else {
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
        console.log(`Products from ${supplier_choice}`);
        supplier_productList.forEach((product) => {
          console.log(product.name);
        });
        if (supplier_productList.length > 0) {
          const currentSupplier = await SupplierModel.aggregate([
            {
              $match: { name: supplier_choice },
            },
            { $project: { _id: 0 } },
          ]);
          let newProduct = {
            ...supplier_productList[0],
            supplier: currentSupplier,
          };
          console.log("Before Product:", newProduct);

          let newItems = { ...supplier_productList[0] };
          for (const key in newItems) {
            if (isNaN(newItems[key])) {
              newItems[key] = "";
              const { choice } = await inquirer.prompt([
                {
                  type: "input",
                  name: "choice",
                  message: `Enter: ${key}`,
                  validate: (value) =>
                    isNaN(value) ? true : "Dont use only numbers",
                },
              ]);
              newProduct[key] = choice;
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
              newProduct[key] = choice;
            }
          }
          console.log("After Product:", newProduct);
          const { decision } = await inquirer.prompt([
            {
              name: "decision",
              type: "confirm",
              message: "Insert into collection?",
              default: false,
            },
          ]);
          if (decision) await product_collection.insertOne(newProduct);
          else {
            console.log("Insertion cancelled.\n -------------------------");
            return;
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const orderForOffers = async () => {
  try {
    let currentOffers = await OfferModel.find({});
    const mappedOffers = currentOffers.map((offer, index) => {
      return `${index + 1}: ${offer.products.join(" ")}`;
    });
    console.log(currentOffers);
    console.log(mappedOffers);
    const { offer_choice } = await inquirer.prompt([
      {
        type: "list",
        name: "offer_choice",
        message: "Offers:",
        choices: [...mappedOffers, "Exit"],
      },
    ]);
    if (offer_choice != "Exit") {
      const FINAL_offer = offer_choice.slice(3).split(" ");
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
        offer: [...FINAL_offer],
        quantity: FINAL_quantity,
        status: "pending",
        additional_detail: FINAL_details,
      });
      console.log("NEW ORDER READY:", newSalesOrder);

      const { insert_decision } = await inquirer.prompt([
        {
          type: "confirm",
          name: "insert_decision",
          message: "Insert into collection?",
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
