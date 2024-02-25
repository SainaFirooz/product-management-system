import inquirer from "inquirer";
import { CategoryModel, ProductModel, SupplierModel } from "./models.js";

let category_collection = CategoryModel.collection;

export const addNewCategory = async () => {
  const currentCategories = await CategoryModel.aggregate([
    {
      $group: { _id: "$name" },
    },
  ]);
  try {
    const newCategory = {
      name: "",
      description: "",
    };
    while (true) {
      const { category_name, category_description } = await inquirer.prompt([
        {
          type: "input",
          name: "category_name",
          message: "Enter new category",
        },
        {
          type: "input",
          name: "category_description",
          message: "Enter a description",
        },
      ]);
      let c_check = await CategoryModel.aggregate([
        {
          $match: { name: category_name },
        },
      ]);
      if (c_check.length <= 0) {
        newCategory.name = category_name;
        newCategory.description = category_description;
        category_collection.insertOne(newCategory);
        console.log(`\nNew Category Details:\n
        Name: ${newCategory.name}
        Description: ${newCategory.description}
        \n---------------------------------------------`);
        console.log(
          "You've inserted a new category successfully!\n---------------------------------------------"
        );
        break;
      } else {
        console.log(
          "-----------INVALID ENTRY-----------\nCategory already exists in the database\n---------------------------------------------"
        );
      }
    }
    return newCategory;
  } catch (error) {
    console.log(error);
  }
};

// menu option 3

export async function productsByCategory() {
  const allCategories = await CategoryModel.find({}, "name");

  const categoryChoices = allCategories.map((category) => category.name);

  const categoryAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "Select a category",
      choices:  [...categoryChoices, "Exit"]
    },
  ]);

  if (categoryAnswer.category === "Exit") {
    return;
  } 


  const products = await ProductModel.find({
    "category.name": categoryAnswer.category,
  });

  if (!products.length) {
    console.log("No products found for this category");
    return;
  }

  console.log(`\n Here are the products for the category: ${categoryAnswer.category} \n`);
  
  products.forEach((product) => {
    console.log(`\n${product.name}\n
        Price: $${product.price}
        Cost: $${product.cost}
        Supplier: ${product.supplier.name}
        Category: ${product.category.name}
        Stock Quantity: ${product.stock}
        \n---------------------------------------------`);
  });
}
  



// menu option 4
export async function productsBySupplier() {
  const allSuppliers = await SupplierModel.find({}, "name");

  const supplierChoices = allSuppliers.map((supplier) => supplier.name);

  const supplierAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "supplier",
      message: "Select a supplier",
      choices: [...supplierChoices, "Exit"]
    },
  ]);

  if (supplierAnswer.supplier === "Exit") {
    return;
  }

  const products = await ProductModel.find({
    "supplier.name": supplierAnswer.supplier,
  }).populate('supplier').populate('category');

  if (!products.length) {
    console.log("No products found for this supplier");
  }

  console.log(`\n Here are the products for the supplier: ${supplierAnswer.supplier} \n`);

  products.forEach((product) => {
    console.log(`\n${product.name}\n
        Price: $${product.price}
        Cost: $${product.cost}
        Supplier: ${product.supplier.name}
        Category: ${product.category.name}
        Stock Quantity: ${product.stock}
        \n---------------------------------------------`);
  });
  console.log(
    "Product details have been displayed successfully!\n---------------------------------------------"
  );
}

// menu option 12
export async function viewSuppliers() {
  const suppliers = await SupplierModel.find({});

  suppliers.forEach((supplier) => {
    console.log(`\nSupplier Details:\n
        Name: ${supplier.name}
        Contact Person: ${supplier.contact.name}
        Email: ${supplier.contact.email}
        \n---------------------------------------------`);
  });

  console.log(
    "Supplier details have been displayed successfully!\n---------------------------------------------"
  );
}