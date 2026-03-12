import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    userName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    prompt: { type: String, required: true },
    timestamp: { type: Number, default: Date.now }
})

const Image = mongoose.models.image || mongoose.model('image', imageSchema)

export default Image
