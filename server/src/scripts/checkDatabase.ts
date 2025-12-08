import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env';
import Course from '../models/Course';

async function checkDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
        
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully!');
        
        const dbName = mongoose.connection.db.databaseName;
        console.log('Database name:', dbName);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        const courseCount = await Course.countDocuments();
        console.log('Course count:', courseCount);
        
        if (courseCount > 0) {
            const courses = await Course.find().select('title isPublished').limit(5);
            console.log('Sample courses:', courses);
        }
        
        await mongoose.disconnect();
        console.log('Disconnected');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDatabase();
