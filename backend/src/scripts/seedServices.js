import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const services = [
  { name: 'AC Repair', price: 500, category: 'Appliance' },
  { name: 'AC Service', price: 300, category: 'Appliance' },
  { name: 'Plumbing', price: 300, category: 'Repair' },
  { name: 'Kitchen Cleaning', price: 800, category: 'Cleaning' },
  { name: 'Full House Cleaning', price: 2500, category: 'Cleaning' },
  { name: 'Electrician', price: 200, category: 'Repair' },
  { name: 'Washing Machine Repair', price: 450, category: 'Appliance' },
  { name: 'Painting', price: 5000, category: 'Home' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Service.deleteMany({});
    await Service.insertMany(services);

    console.log('Services seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding services:', err);
    process.exit(1);
  }
};

seedDB();
