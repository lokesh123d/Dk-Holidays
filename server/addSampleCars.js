// Add Sample Cars to Firestore
// Run this file once to populate database

const admin = require('firebase-admin');

// Initialize Firebase (make sure you have serviceAccountKey.json)
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample Cars Data
const sampleCars = [
    {
        name: "Toyota Innova Crysta",
        category: "SUV",
        price: 3500,
        seatingCapacity: 7,
        fuelType: "Diesel",
        transmission: "Manual",
        features: ["AC", "Music System", "GPS"],
        description: "Comfortable SUV perfect for family trips",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
    },
    {
        name: "Maruti Swift Dzire",
        category: "Sedan",
        price: 2000,
        seatingCapacity: 4,
        fuelType: "Petrol",
        transmission: "Automatic",
        features: ["AC", "Music System"],
        description: "Compact and fuel-efficient sedan",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
    },
    {
        name: "Mahindra Scorpio",
        category: "SUV",
        price: 3000,
        seatingCapacity: 7,
        fuelType: "Diesel",
        transmission: "Manual",
        features: ["AC", "4WD", "Music System"],
        description: "Rugged SUV for mountain drives",
        available: true,
        imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
    }
];

// Add cars to Firestore
async function addSampleCars() {
    try {
        console.log('Adding sample cars to Firestore...');

        const carsCollection = db.collection('cars');

        for (const car of sampleCars) {
            const docRef = await carsCollection.add({
                ...car,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Added car: ${car.name} (ID: ${docRef.id})`);
        }

        console.log('\n🎉 All sample cars added successfully!');
        console.log('You can now test the API: https://dk-holidays.onrender.com/api/cars');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding cars:', error);
        process.exit(1);
    }
}

addSampleCars();
