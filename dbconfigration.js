const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("./Utill/Logger");

dotenv.config();

mongoose.connect("mongodb://localhost:27017/real_state", {
   serverSelectionTimeoutMS: 5000,
   autoIndex: false,
   maxPoolSize: 10,
   socketTimeoutMS: 45000,
   family: 4
})
   .then(() => {
      console.log('MongoDB connected successfully');
      // logger.info('MongoDB connected successfully');
   })
   .catch((err) => {
      console.error('MongoDB CONNECTION ERROR =>>: ', err);
      // logger.error('MongoDB CONNECTION ERROR =>>: ', err);
   });
