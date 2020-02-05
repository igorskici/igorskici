const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MongoURI');



const connectDb = async () => {
    try {
       await mongoose.connect(db, {
           useNewUrlParser: true,
           useCreateIndex:true,
           useFindAndModify:false,
           useUnifiedTopology:true
       });
       console.log('Mongo DB is connected....')
    }
    catch(err){
        console.log(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDb;