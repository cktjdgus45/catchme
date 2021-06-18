import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({ //스키마
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    socialOnly: { type: Boolean, default: false },
    password: String,
    name: { type: String, required: true },
    location: String,
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
});

userSchema.pre('save', async function () { //컨트롤러에서 save() 실행되기전에 미리 실행되는 함수.
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5); //비밀번호를 해쉬화 하는과정. 
    }
})

const userModel = mongoose.model('User', userSchema); //스키마의 모델의 이름은 'User' 로 설정. 

export default userModel; //export 