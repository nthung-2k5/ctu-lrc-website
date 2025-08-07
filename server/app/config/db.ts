import mongoose from 'mongoose';

// MongoDB connection string - replace with your actual connection string
const mongoURI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/CT449';

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`Đã kết nối MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Lỗi kết nối MongoDB: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};

export default connectDB;
