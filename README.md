# exdash
A CRUD-webapplication using the MERN-stack. In addition GraphQL and Material UI were used. This webapplication enables different parties to interact and chat with eachother. Further features include register and login functionalities, favoriting postings and comments with highlights in a modern, compact and responsive design. 


# Quick setup

- Clone the repository.

- Create a MongoDB Atlas (MongoDB Cloud service) account: https://www.mongodb.com/de-de/cloud/atlas/register

- The 'Shared' version is free. Create a cluster. Once the cluster is created, deploy a database within the cluster. Create a database user with the privileges 'Read and write to any database' (fine for test purposes). After that, click 'Connect' to your cluster and select 'Connect to your application' in the connection method. Driver version everything over 4.0 for Node.js is fine. Copy the shown connection string into your clipboard or an own file.
 
- Eventually you have to setup the network access in the MongoDB Atlas user-interface before connectong to the cluster. 0.0.0.0/0 works (access from everywhere) work for test purposes as well. Configure your own individual IP or a dynamic DNS (f.e. NO-IP) if you desire.

- Create in the root folder of the project a new file named ``.env``. This file will contain the connection string and the encryption string key of the user and login registery. Copy the following content into the new created file and replace it accordingly (in the connection strong you need to place your MongoDB database user credentials which are by default not copied). Keep in mind the MongoDB connection string is for connecting to your cloud database, while the 'security key' (encryption key) is for signing the JWT web token for authenticating. Both are two independent things but need to be set to work properly. 

    ```shell

    MONGODB=YourCopiedConnectionStringHere
    SEC_KEY=YourSuperSecretEncryptionStringHere

    ```


After the configuration is complete. Node.js and npm are required on the system to install the necessary dependencies and start the project.
Node.js can be obtained (if needed) from https://nodejs.org/en/. Node.js already has npm integrated. For running it locally:

-  Check if node and npm are installed on the system:
   ```shell
   node -v && npm -v
   ```
- Clone the repository and navigate to the project folder (note the correct path):
   ```shell
   git clone https://github.com/tkex/exdash.git
   cd exdash (into the root folder)
   ```
- Install the backend dependencies and then start the backend server:
  ```shell
   npm install
   node index
   ```
- Start another (**!**) console, then navigate to the project folder and specifically to the subdirectory `client`.
   Install the client dependendies and start the client:
   ```shell
   cd exdash/client
   npm install
   npm start
   ```
   **Info**: The backend server optimally should have been started **first** so that the frontend server can connect to it.
   
- **Two** console windows should now be open, each having the backend and frontend started.
   Both can now be accessed with the browser. For the application, the client should be accessed:
   ```shell
   Backend runs at http://localhost:5000 and the client at http://localhost:3000.
   ```


# Further information

- Built to apply the learned knowledge or different techs in a purposeful project.
- The schema can be looked up in ``http://localhost:5000/graphql`` with the queries and mutations.
- Design could be improved in some places for example in the overview when opening a question (TODO).
- For authorized access, JSON Web Tokens (JWT) have been used. Passwords will be hashed in the database with the hashfunction Bcrypt (10 rounds). 
- Client: Material UI, React, GraphQL Client (Apollo Client)
- Backend: Node.js (Express), GraphQL Server (Apollo Server), Mongoose for object modeling in combination with the cloudbased MongoDB database.


