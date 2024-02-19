import mongoose from "mongoose";
import inquirer from "inquirer";

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
            "Exit"
          ]
        }
      ]);

      switch (choice) {
        case "Add new category":
          await addNewCategory();
          break;
        case "Add new product":
          await addNewProduct();
          break;
        case "View products by category":
          await viewProductsByCategory();
          break;
        case "View products by supplier":
          await viewProductsBySupplier();
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


// 1




(async () => {
    await closeDBconnection();
    await menu();
  })();
  

