export const addNewProduct = async () => {
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
              name: 1,
              category: 1,
              price: 1,
              cost: 1,
              stock: 1,
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
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
