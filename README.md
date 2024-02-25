

                                                  npm init -y

                                              npm install mongoose

                                               npm install inquirer
                                                     
In this assignment you are going to develop a product management system.
The data in the database is data about products. The user shall be able to create an offer to the
market by putting together one or more products into a group. For example a laptop and a phone
can be put together into an offer. The customer can then buy both these items at the same time as
part of the offer.

Another example is a plane ticket plus a rental car at the destination. The customer shall be able to
buy these two items as one offer.
An offer can be made up of one or multiple products. The number of products in an offer is not
limited in any way.
Some of the requirements for the app are labeled “For the grade VG”. All these requirements must
be implemented and must be working fir the grade VG. If one of them is not working you will not get
the grade VG.

All the requirements that are not labeled “For the grade VG” must be implemented for the grade G.
If one of them is missing you will get the grade IG.


          Requirements
     
  Products
 
Products are what make up an offer.
Products should be connected to a supplier. This means that the user shall be able to make a search
by a supplier’s name and find all the products from this supplier.
Offers

An offer: a deal that is offered to the market that customers can buy. An offer is made up of one or
more products. The price of an offer is either the total sum of the prices of the products in the offer.
An offer should have a field called active. The field should have the value true if the products it is
made up of are in stock. If any of the products that an offer is made up of goes out of stock the value
of the active field should automatically change to false.
Sales orders

When a sales order is placed its status is “pending”. When the status of the order changes to
“shipped” the number of products and offers in stock should be decreased by the amount that is
shipped in the order.

If sales order contains more than 10 pieces of an offer the price of the total cost for the order shall be
reduced by 10%.

When the products in an order are shipped the profit made on the offers should be calculated. The
profit tax is 30%. This means that the profit is the difference between the price that goods were sold
for minus the cost they were bought for. 70% of this difference is the profit.
The data that should be stored when an order ships is the total revenue per order, the revenue per
offer, the total profit per order and the profit per offer. This data shall be stored in every for every
sale.

The menu of the application should look like this:

1. Add new category
2. Add new product
3. View products by category
4. View products by supplier
5. View all offers within a price range
6. View all offers that contain a product from a specific category
7. View the number of offers based on the number of its products in stock
8. Create order for products
9. Create order for offers
10. Ship orders
11. Add a new supplier
12. View suppliers
13. View all sales
14. View sum of all profits

Follow these instructions when you are implementing the menu.

1. Suppliers:
   
Each product should be associated with a supplier. There should be at least three suppliers in the
database. All three shall have products associated with them. A supplier shall have a name and a
description. The name is a required field.

For the grade G

When adding a new product, the user should be prompted to select a supplier from a list of existing
suppliers.

For the grade VG

When adding a new product, the user should be prompted to select a supplier from a list of existing
suppliers or add a new supplier if necessary.

2. Categories:

Products should belong to specific categories for organization and filtering purposes. The database
should have at least three categories. All categories shall have products assigned to them. A category
shall have a name and a description. The name is a required field.

For the grade G

When adding a new product, the user should be prompted to select a category from a list of existing
categories.

For the grade VG

When adding a new product, the user should be prompted to select a category from a list of existing
categories or add a new category if necessary.

3. View products by supplier:
   
- Implement a feature to view all products associated with a specific supplier. This feature should
display the products along with their details such as name, price, cost, and stock quantity.

4. View products by category:

- Implement a feature to view all products belonging to a specific category. This feature should
display the products along with their details such as name, price, cost, supplier and stock quantity.

5. View all offers within a price range:
   
- Implement a feature to view all offers with prices falling within a specified price range. This
feature should display the offers along with their details such as included products and price.

6. View all offers that contain a product from a specific category:
   
For the grade VG

- Implement a feature to view all offers that contain at least one product from a specific category.
This feature should display the offers along with their details such as included products and price.

7. View the number of offers based on the number of its products in stock:
  
- Implement a feature to view the number of offers based on the availability of their products in
stock. Display a summary showing the number of offers with all products in stock, some products in
stock, and no products in stock.

8. Create order for products:
  
- Allow users to create sales orders for individual products. When creating an order, the user
should specify the product, quantity, and any additional details.

9. Create order for offers:
    
- Allow users to create sales orders for entire offers. When creating an order, the user should
specify the offer, quantity, and any additional details.

10. Ship orders:
    
- Implement functionality to mark sales orders as shipped. When an order is shipped, update the
status to "shipped" and decrease the stock quantities of the products and offers included in the
order accordingly.

11. View suppliers:
    
- Implement a feature to view all suppliers along with their contact information. This feature
should display a list of suppliers with details such as name, contact person, and email address.

12. View all sales:
  
- Implement a feature to view a list of all sales orders. This feature should display details such as
order number, date, status, and total cost.


13. View sum of all profits:
    
For the grade G

Implement a feature to calculate and display the total profit generated from all sales orders. This
feature should calculate the profit based on the difference between the total revenue and the cost of
goods sold, and then sum up the profits from all orders. Don’t forget to exclude the profit tax.

For the grade VG

Show the profits from all the offers that contain a specific product. The user shall choose the
product.
