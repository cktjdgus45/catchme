import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: '/img/user.png' },
    socialOnly: { type: Boolean, default: false },
    password: String,
    name: { type: String, required: true },
    location: String,
    skill: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
});

userSchema.pre('save', async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
})

const userModel = mongoose.model('User', userSchema);

export default userModel;