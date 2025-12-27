const { db } = require('../config/firebase');

/**
 * Submit contact form
 */
const submitContactForm = async (req, res) => {
    try {
        const contactData = {
            ...req.body,
            status: 'new',
            createdAt: new Date().toISOString()
        };

        const contactRef = await db.collection('contacts').add(contactData);

        // You can add email notification logic here

        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            data: { id: contactRef.id }
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
};

/**
 * Get all contact submissions (Admin only)
 */
const getAllContacts = async (req, res) => {
    try {
        const contactsSnapshot = await db.collection('contacts')
            .orderBy('createdAt', 'desc')
            .get();

        const contacts = [];
        contactsSnapshot.forEach(doc => {
            contacts.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: contacts });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

/**
 * Subscribe to newsletter
 */
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const existingSubscriber = await db.collection('newsletter')
            .where('email', '==', email)
            .get();

        if (!existingSubscriber.empty) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }

        const subscriberData = {
            email,
            subscribedAt: new Date().toISOString(),
            active: true
        };

        await db.collection('newsletter').add(subscriberData);

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
};

/**
 * Get all newsletter subscribers (Admin only)
 */
const getNewsletterSubscribers = async (req, res) => {
    try {
        const subscribersSnapshot = await db.collection('newsletter')
            .where('active', '==', true)
            .orderBy('subscribedAt', 'desc')
            .get();

        const subscribers = [];
        subscribersSnapshot.forEach(doc => {
            subscribers.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, data: subscribers });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
};

module.exports = {
    submitContactForm,
    getAllContacts,
    subscribeNewsletter,
    getNewsletterSubscribers
};
