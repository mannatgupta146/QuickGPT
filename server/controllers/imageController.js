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

export const deleteCommunityImage = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.user._id;

        const image = await Image.findById(id);

        if (!image) {
            return res.json({ success: false, message: "Image not found" });
        }

        // Authorization check: only the creator can delete
        if (image.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized: You can only delete your own images" });
        }

        await Image.findByIdAndDelete(id);
        res.json({ success: true, message: "Image removed from community" });

    } catch (error) {
        console.error("!!! deleteCommunityImage ERROR !!!", error);
        res.json({ success: false, message: error.message });
    }
}
