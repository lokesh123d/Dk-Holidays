const { db } = require('./config/firebase');

// Update existing tour packages with detailed information
async function updateTourPackagesWithDetails() {
    try {
        console.log('🚀 Updating tour packages with detailed information...\n');

        const tourDetails = {
            "Amritsar - Dalhousie - Dharamshala 7 Night Tour": {
                itinerary: [
                    "Amritsar: Arrive at Amritsar, visit the Partition Museum, enjoy free time shopping, and visit Atari Wagah Border for the lowering the flag ceremony",
                    "Amritsar – Dalhousie: Travel to Dalhousie, a famous hill station known for its pleasant climate and snow-capped mountains",
                    "Dalhousie – Khajjiar – Chamera Lake – Dalhousie: Visit Khajjiar (Mini Switzerland), Sardar Ajit Singh Smarak, and enjoy a scenic boat ride at Chamera Lake",
                    "Dalhousie – Dharamshala: Travel to Dharamshala, the winter capital of Himachal Pradesh and home of the Dalai Lama",
                    "Dharamshala: Visit Bhagsunag Temple, Dalai Lama Monastery, Dharamshala Skyway (ropeway), Aghanjar Mahadev Temple, Dharamshala Stadium, and shop at Macleodganj Bazaar",
                    "Dharamshala – Amritsar: Travel back to Amritsar, visiting the ancient Jwalaji Temple en route",
                    "Amritsar: Visit the sacred Golden Temple, Jallianwala Bagh, and experience authentic Punjabi culture at Sadda Pind",
                    "Amritsar: Checkout and board the flight for your hometown"
                ],
                inclusions: [
                    "Daily Breakfast included",
                    "Twin sharing accommodation for the duration of the tour",
                    "Coach transfers from first-day meeting point to last-day dropping point",
                    "All entrance fees for sightseeing places mentioned in the itinerary"
                ],
                exclusions: [
                    "Rail or Airfare to and from the meeting/dropping place",
                    "5% GST and any increase in fuel surcharge or government taxes",
                    "Lunch and Dinner",
                    "Porterage (coolie charges), laundry, wines, mineral water, telephone charges, and shopping",
                    "Medical expenses, extra stay pre/post-tour",
                    "Any extra expenses due to unforeseen circumstances like natural calamities or strikes"
                ],
                terms: "Cancellation Policy: 15-30 days before tour: 30% Non-Refundable. 10-15 days before tour: 75% Non-Refundable. Within 10 days: 100% Non-Refundable. Payment Terms: 45-30 days before tour: 75% of total tour cost. Within 30 days: 100% of total tour cost."
            }
        };

        // Generic details for other packages
        const genericDetails = {
            itinerary: [
                "Arrival and check-in at hotel, evening leisure time to explore local markets",
                "Full day sightseeing covering major attractions and temples",
                "Adventure activities including trekking, paragliding or ropeway rides",
                "Visit to scenic viewpoints, lakes, and monasteries",
                "Excursion to nearby hill stations and local sightseeing",
                "Shopping and cultural experiences, visit to local handicraft centers",
                "Leisure day with optional activities or relaxation at hotel",
                "Checkout and departure with beautiful memories"
            ],
            inclusions: [
                "Accommodation on twin sharing basis",
                "Daily breakfast and dinner",
                "All transfers and sightseeing by private vehicle",
                "Professional tour guide services",
                "All applicable taxes and service charges",
                "Entrance fees to monuments and parks as per itinerary"
            ],
            exclusions: [
                "Airfare or train tickets to/from starting point",
                "Lunch and beverages",
                "Personal expenses like laundry, phone calls, tips",
                "Travel insurance",
                "Any adventure activity charges",
                "Camera fees at monuments",
                "Anything not mentioned in inclusions"
            ],
            terms: "Cancellation Policy: 30+ days: 25% cancellation charges. 15-30 days: 50% cancellation charges. 7-15 days: 75% cancellation charges. Less than 7 days: 100% cancellation charges. Payment Terms: 50% advance at booking, 50% before 7 days of tour start."
        };

        // Get all tours
        const toursSnapshot = await db.collection('tours').get();

        let updateCount = 0;
        for (const doc of toursSnapshot.docs) {
            const tourData = doc.data();
            const title = tourData.title;

            // Use specific details if available, otherwise use generic
            const details = tourDetails[title] || genericDetails;

            await db.collection('tours').doc(doc.id).update({
                itinerary: details.itinerary,
                inclusions: details.inclusions,
                exclusions: details.exclusions,
                terms: details.terms,
                updatedAt: new Date().toISOString()
            });

            console.log(`✅ Updated: ${title}`);
            updateCount++;
        }

        console.log(`\n🎉 Successfully updated ${updateCount} tour packages!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating tour packages:', error);
        process.exit(1);
    }
}

updateTourPackagesWithDetails();
