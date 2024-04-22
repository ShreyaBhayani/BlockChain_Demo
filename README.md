# Hyperledger Fabric Demo

This repository contains a sample demonstration of using Hyperledger Fabric for implementing smart contracts and its related API for managing products. The smart contract facilitates actions such as creating a product, updating product details, transferring product ownership, retrieving product details, and viewing product history.

## Smart Contract

The smart contract defines the rules and logic governing the lifecycle of products within the Hyperledger Fabric network. It enforces business logic such as ownership transfer and product updates.

### Functions

1. **createProduct**: Allows the creation of a new product on the blockchain.
2. **UpdateProductDetails**: Enables updating the details of an existing product.
3. **TransferOwner**: Facilitates the transfer of ownership of a product from one entity to another.
4. **GetProductDetails**: Retrieves the details of a specific product.
5. **GetHistoryofProduct**: Provides the history of changes made to a product.

## API

The API layer serves as an interface for interacting with the smart contract deployed on the Hyperledger Fabric network. It exposes endpoints for performing various operations related to product management.

### Endpoints

1. **User Signup**
   - Endpoint: `/users/signup`
   - Method: `POST`
   - Parameters: 
     - username,password
   - Response: 
     - Success: Status 200 OK with successful message.
     - Error: Status 4xx with error message.
  
2. **User Login**
   - Endpoint: `/users/login`
   - Method: `POST`
   - Parameters: 
     - username,password
   - Response: 
     - Success: Status 200 OK if username is valid
     - Error: Status 4xx with error message.
       
3. **Create Product**
   - Endpoint: `addproduct`
   - Method: `POST`
   - Parameters: 
     - Product details (product_id,product_name,retailer,manufacturer)
   - Response: 
     - Success: Status 200 OK with successful message.
     - Error: Status 4xx with error message.

4. **Update Product**
   - Endpoint: `update`
   - Method: `PUT`
   - Parameters: 
     - Product details (product_id,product_name,retailer,manufacturer)
   - Response: 
     - Success: Status 200 OK with successful message
     - Error: Status 4xx with error message.

5. **Transfer Product Ownership**
   - Endpoint: `transferowner`
   - Method: `PUT`
   - Parameters: 
     - Product ID
     - New owner details
   - Response: 
     - Success: Status 200 OK with successful message
     - Error: Status 4xx with error message.

6. **Get Product Details**
   - Endpoint: `getdetails:/id`
   - Method: `GET`
   - Parameters: 
   - Response: 
     - Success: Status 200 OK with product details.
     - Error: Status 4xx with error message.

7. **Get Product History**
   - Endpoint: `gethistory:/id`
   - Method: `GET`
   - Response: 
     - Success: Status 200 OK with product history.
     - Error: Status 4xx with error message.

## Usage

To use this demo, follow these steps:

1. Clone the repository.
2. Set up your Hyperledger Fabric network.
3. Deploy the smart contract on the network.
4. Start the API server.
5. Interact with the API endpoints using tools like cURL or Postman.
