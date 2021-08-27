import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 50 },
    description: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true, maxLength: 50 }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
    meta: {
        views: { type: Number, default: 0, required: true },
        likes: { type: Number, default: 0, required: true },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const videoModel = mongoose.model('Video', videoSchema);
export default videoModel;