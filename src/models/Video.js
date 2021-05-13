import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 25 },
    description: { type: String, required: true, trim: true, maxLength: 75 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true, maxLength: 25 }],
    meta: {
        views: Number,
        rating: Number
    }
});

const videoData = mongoose.model('Video', videoSchema);
export default videoData;