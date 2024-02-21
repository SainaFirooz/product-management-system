export const addNewCategory = async ()  => {
    try{
        const { category_choice } = await inquirer.prompt([
          {
            type: 'input',
            name: 'category_choice',
            message: 'Enter new category',
          },
          {
            type: 'list',
            message: [CategoryModel]
          }
        ]);
        console.log('You´ve entered', category_choice );
    
      }catch(error){
        console.log(error);
      }
}


// menu option 3
async function productsByCategory() {}

// menu option 4
async function productsBySupplier() {}

// menu option 12
async function viewSuppliers() {}