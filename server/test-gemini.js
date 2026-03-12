import axios from 'axios';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
// Test different URL combinations
const urls = [
    'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    'https://generativelanguage.googleapis.com/v1beta/openai/v1/chat/completions',
    'https://generativelanguage.googleapis.com/v1beta/chat/completions'
];

const models = ["gemini-1.5-flash-8b", "gemini-1.5-flash", "gemini-1.5-flash-latest"];

async function test() {
    console.log("Using API Key:", apiKey ? "Present" : "MISSING");
    
    // Some docs say use /v1beta/ (client adds chat/completions)
    const url = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
    const model = "openai/gemini-1.5-flash"; // Try prefixing

    console.log(`\nTesting URL: ${url} with Model: ${model}`);
    try {
        const response = await axios.post(url, {
            model: model,
            messages: [{ role: "user", content: "hi" }]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("SUCCESS!");
        console.log("Result:", response.data.choices[0].message.content);
    } catch (error) {
        console.log("FAILED with status:", error.response?.status);
        console.log("Error body:", JSON.stringify(error.response?.data, null, 2));
    }
}

test();
