import inquirer from "inquirer";
import { CategoryModel, ProductModel, SupplierModel } from "./models.js";

let category_collection = CategoryModel.collection;

export const addNewCategory = async () => {
  const currentCategories = await CategoryModel.aggregate([
    {
      $group: { _id: "$name" },
    },
  ]);
  console.log(currentCategories);
  try {
    const { category_name, category_description } = await inquirer.prompt([
      {
        type: "input",
        name: "category_choice",
        message: "Enter new category",
      },
      {
        type: "input",
        name: "category_description",
        message: "Enter a description",
      },
    ]);
    const newCategory = {
      name: category_name,
      description: category_description,
    };
    category_collection.insertOne(newCategory);
    console.log("You´ve inserted a new category", category_choice);
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
      choices: categoryChoices,
    },
  ]);

  const products = await ProductModel.find({
    "category.name": categoryAnswer.category,
  });

  if (!products.length) {
    console.log("No products found for this category");
    return;
  }

  products.forEach((product) => {
    console.log(`Name: ${product.name}`);
    console.log(`Price: ${product.price}`);
    console.log(`Cost: ${product.cost}`);
    console.log(`Supplier: ${product.supplier.name}`); // assuming supplier is an object with a name property
    console.log(`Stock Quantity: ${product.stock}`);
    console.log("---------------------------------");
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
      choices: supplierChoices,
    },
  ]);

  const products = await ProductModel.find({
    "supplier.name": supplierAnswer.supplier,
  });

  if (!products.lenght) {
    console.log("No products found for this supplier");
  }

  products.forEach((product) => {
    console.log(`Name: ${product.name}`);
    console.log(`Price: ${product.price}`);
    console.log(`Cost: ${product.cost}`);
    console.log(`Supplier: ${product.supplier.name}`);
    console.log(`Stock Quantity: ${product.stock}`);
    console.log("---------------------------------");
  });
}

// menu option 12
export async function viewSuppliers() {
  // const allSuppliers = await SupplierModel.aggregate([
  //     {
  //         $project: {_id: 0, name: 1, contact: 1}
  //     }
  // ]);

  // allSuppliers.forEach(supplier => {
  //     console.log(`Supplier: ${supplier.name} \nContact info: ${supplier.contact.name} - ${supplier.contact.email}`);
  // })

  // const allSuppliers = await SupplierModel.find({}, 'name')
  // const supplierListName = allSuppliers.map(supplier => {
  //     console.log(supplier.name);
  // })
  const suppliers = await SupplierModel.find({});

  suppliers.forEach((supplier) => {
    console.log(`Name: ${supplier.name}`);
    console.log(`Contact Person: ${supplier.contact.name}`);
    console.log(`Email: ${supplier.contact.email}`);
    console.log("---------------------------------");
  });
}
