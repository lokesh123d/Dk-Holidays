const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serverEnvPath = path.join(__dirname, '../server/.env');
const targetEnvPath = path.join(__dirname, '.env');

try {
    // 1. Read Service Account
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // 2. Read Server .env for Razorpay
    const serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
    const razorpayIdMatch = serverEnv.match(/RAZORPAY_KEY_ID=(.*)/);
    const razorpaySecretMatch = serverEnv.match(/RAZORPAY_KEY_SECRET=(.*)/);

    // 3. Construct .env content
    let envContent = `# Auto-generated .env for Cloud Functions\n`;
    envContent += `FIREBASE_PROJECT_ID=${serviceAccount.project_id}\n`;
    envContent += `FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}\n`;
    // Escape newlines for .env file if needed, but usually quoted string handles it.
    // However, Node.js dotenv might need specific handling. 
    // Standard practice: "key"
    const privateKey = serviceAccount.private_key.replace(/\n/g, '\\n');
    envContent += `FIREBASE_PRIVATE_KEY="${privateKey}"\n`;

    if (razorpayIdMatch) {
        envContent += `RAZORPAY_KEY_ID=${razorpayIdMatch[1]}\n`;
    }
    if (razorpaySecretMatch) {
        envContent += `RAZORPAY_KEY_SECRET=${razorpaySecretMatch[1]}\n`;
    }

    // Add Client URL
    envContent += `CLIENT_URL=https://dk-holidays.web.app\n`;

    fs.writeFileSync(targetEnvPath, envContent);
    console.log('✅ functions/.env created successfully');

} catch (error) {
    console.error('Error setting up env:', error);
    process.exit(1);
}
