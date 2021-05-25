import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 25 },
    description: { type: String, required: true, trim: true, maxLength: 75 },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true, maxLength: 25 }],
    meta: {
        views: Number,
        rating: Number
    }
});

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const videoModel = mongoose.model('Video', videoSchema);
export default videoModel;