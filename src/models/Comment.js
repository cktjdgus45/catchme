import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    createdAt: { type: Array, required: true },
    text: { type: String, required: true },
})

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;