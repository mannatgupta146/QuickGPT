import axios from 'axios';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

import fs from 'fs';

async function listModels() {
    try {
        const response = await axios.get(url);
        const modelNames = response.data.models.map(m => m.name);
        fs.writeFileSync('models_list.txt', modelNames.join('\n'));
        console.log("Wrote " + modelNames.length + " models to models_list.txt");
    } catch (error) {
        console.log("FAILED to list models:", error.response?.status);
    }
}

listModels();
