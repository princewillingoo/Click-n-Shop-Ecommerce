import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        const connected = await mongoose.connect(
            process.env.MONGO_URI
            // "mongodb+srv://princewillingoo:kVESlWWMvMX785tz@nodejs-ecommerce-api.6a7hskp.mongodb.net/nodejs-ecommerce-api?retryWrites=true&w=majority"
        )
        console.log(`Mongodb connected ${connected.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}


export default dbConnect