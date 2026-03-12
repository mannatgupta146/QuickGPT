import Image from "../models/Image.js";

export const getCommunityImages = async (req, res) => {
    try {
        const images = await Image.find().sort({ timestamp: -1 });
        res.json({ success: true, images });
    } catch (error) {
        console.error("!!! getCommunityImages ERROR !!!", error);
        res.json({ success: false, message: error.message });
    }
}
