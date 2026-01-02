const { db } = require('./config/firebase');

const tourPackages = [
    {
        title: "Splendour Of Himachal Tour",
        duration: "9D / 8N",
        price: "36500",
        description: "Experience the splendor of Himachal Pradesh with visits to Shimla, Kullu, Manali, Dalhousie, Amritsar, Dharamshala, and Chandigarh City. Perfect for families and adventure seekers.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_13/377396/370335.jpg",
        destinations: "Shimla, Kullu, Manali, Dalhousie, Amritsar, Dharamshala, Chandigarh City",
        features: ["Kufri Adventure", "Rohtang Pass", "Golden Temple Visit", "Solang Valley", "Accommodation", "Meals Included"]
    },
    {
        title: "Shimla Manali Dharamshala Dalhousie Khajjiar Amritsar Tour",
        duration: "11D / 10N",
        price: "35800",
        description: "A comprehensive tour covering the best of Himachal Pradesh including Shimla, Manali, Dharamshala, Dalhousie, Khajjiar, and the spiritual city of Amritsar.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_11/313024/424913.jpeg",
        destinations: "Shimla, Manali, Dharamshala, Khajjiar, Amritsar, Dalhousie",
        features: ["Amritsar Heritage Walk", "Kufri", "Golden Temple", "Solang Valley", "Dalhousie Hills", "Shimla Hills"]
    },
    {
        title: "7 Night 8 Days Himachal Tour Package",
        duration: "8D / 7N",
        price: "42000",
        description: "Explore the beauty of Dharamshala, Amritsar, Shimla, and Manali in this 8-day adventure tour with trekking, paragliding, and heritage walks.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_69/2045636/441354.jpg",
        destinations: "Dharamshala, Amritsar, Shimla, Manali",
        features: ["Solang Valley", "Manali Trekking", "St. Johns Church", "Amritsar Heritage Walk", "Kufri", "Rohtang Pass"]
    },
    {
        title: "Amritsar - Dalhousie - Dharamshala 7 Night Tour",
        duration: "8D / 7N",
        price: "35500",
        description: "Discover the spiritual and natural beauty of Punjab and Himachal Pradesh with visits to Amritsar's Golden Temple, Dalhousie hills, and Dharamshala monasteries.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_22/636145/451018.png",
        destinations: "Dalhousie, Khajjiar, Dharamshala, Amritsar",
        features: ["Bhagsunag Waterfall", "Golden Temple", "Khajjiar Lake", "McLeodganj", "Tibetan Monasteries", "Local Cuisine"]
    },
    {
        title: "Himachal Pradesh Tour Package 10 Night - 11 Days",
        duration: "11D / 10N",
        price: "33000",
        description: "An extensive 11-day journey through Himachal Pradesh covering Dalhousie, Khajjiar, Kufri, Manali, Shimla, Dharamshala, Amritsar, and McLeodganj.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_53/1582482/385554.jpg",
        destinations: "Dalhousie, Khajjiar, Kufri, Manali, Shimla, Dharamshala, Amritsar, Mcleodganj",
        features: ["Jakhu Temple", "Golden Temple", "Triund Trek", "Manu Temple", "Kufri Fun World", "Solang Valley"]
    },
    {
        title: "9 Night - 10 Days Himachal Pradesh Tour Package",
        duration: "10D / 9N",
        price: "30000",
        description: "Budget-friendly tour package covering the major attractions of Himachal Pradesh including Dalhousie, Manali, Shimla, Dharamshala, and Amritsar.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_54/1602297/391018.jpg",
        destinations: "Dalhousie, Khajjiar, Kufri, Kullu, Manali, Shimla, Dharamshala, Amritsar, Mcleodganj",
        features: ["Bijli Mahadev Temple", "Kufri", "Jakhu Temple", "Manu Temple", "Solang Valley", "Golden Temple"]
    },
    {
        title: "Shimla-Manali-Dharamshala-Dalhousie Tour",
        duration: "9D / 8N",
        price: "40400",
        description: "Mid-range tour package featuring the best hill stations of Himachal Pradesh with comfortable accommodations and guided tours.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_31/916122/432805.jpg",
        destinations: "Shimla, Manali, Dharamshala, Dalhousie",
        features: ["Christ Church", "Panchpula", "Bhagsunag", "Hadimba Temple", "Manali Hills", "Kufri"]
    },
    {
        title: "Himachal Tour With Amritsar 9 Night 10 Days",
        duration: "10D / 9N",
        price: "54800",
        description: "Premium tour package combining the spiritual experience of Amritsar with the natural beauty of Himachal Pradesh's top destinations.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_48/1421954/373855.jpg",
        destinations: "Dalhousie, Khajjiar, Kufri, Manali, Shimla, Dharamshala, Amritsar",
        features: ["Golden Temple", "Solang Valley", "Kullu Hills", "Kufri", "The Mall Road", "Hadimba Temple"]
    },
    {
        title: "Himachal Enchants Tour",
        duration: "11D / 10N",
        price: "39000",
        description: "An enchanting journey through Himachal Pradesh and Chandigarh, perfect for families looking for a mix of adventure and relaxation.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_2/40817/38497.jpg",
        destinations: "Shimla, Manali, Dharamshala, Dalhousie, Chandigarh",
        features: ["Solang Valley", "Manu Temple", "Rohtang Pass", "Jakhu Temple", "Rock Garden", "Sukhna Lake"]
    },
    {
        title: "Dharamshala - Dalhousie Package",
        duration: "6D / 5N",
        price: "25000",
        description: "A short and sweet getaway to the beautiful hill stations of Dharamshala and Dalhousie, perfect for weekend travelers.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_71/2118068/455492.jpg",
        destinations: "Dalhousie, Khajjiar, Dharamshala, Mcleodganj",
        features: ["McLeodganj Market", "Khajjiar Lake", "Dalhousie Churches", "Tibetan Culture", "Local Cuisine", "Nature Walks"]
    },
    {
        title: "Dharamsala Dalhousie Khajjiar Palampur - Himachal Pradesh",
        duration: "6D / 5N",
        price: "28000",
        description: "Explore the tea gardens of Palampur, the mini Switzerland of Khajjiar, and the spiritual vibes of Dharamshala in this 6-day tour.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_24/691050/386312.jpg",
        destinations: "Dalhousie, Dharamshala, Khajjiar, Palampur",
        features: ["Palampur Tea Gardens", "Khajjiar Hills", "Dharamshala Monasteries", "Dalhousie Hills", "Mcleodganj", "Local Markets"]
    },
    {
        title: "Himalayan Dreamscape 9 Nights - 10 Days Tour",
        duration: "10D / 9N",
        price: "34000",
        description: "Dream tour package covering all major attractions of Himachal Pradesh including Dalhousie, Manali, Shimla, Dharamshala, and Amritsar.",
        image: "https://dynamic.tourtravelworld.com/package-images/photo-big/dir_61/1824119/420702.jpg",
        destinations: "Dalhousie, Khajjiar, Kufri, Manali, Shimla, Dharamshala, Amritsar",
        features: ["Adventure Activities", "Cultural Tours", "Temple Visits", "Nature Walks", "Local Cuisine", "Shopping"]
    }
];

async function addTourPackages() {
    try {
        console.log('🚀 Starting to add tour packages to Firestore...\n');

        for (const tour of tourPackages) {
            const tourData = {
                ...tour,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                featured: false,
                available: true
            };

            const docRef = await db.collection('tours').add(tourData);
            console.log(`✅ Added: ${tour.title} (ID: ${docRef.id})`);
        }

        console.log('\n🎉 Successfully added all tour packages!');
        console.log(`📊 Total packages added: ${tourPackages.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding tour packages:', error);
        process.exit(1);
    }
}

addTourPackages();
