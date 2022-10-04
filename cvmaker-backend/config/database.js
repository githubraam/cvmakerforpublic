const mongoose = require("mongoose");
const URI = process.env.DATABSE_LINK;

exports.connect = () => {
    // Connecting to the database
    mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'cvmaker'
        /* No more needed */
        /* useCreateIndex: true, */
        /* useFindAndModify: false, */
      })
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      });
  };