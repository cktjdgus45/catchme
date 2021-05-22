import express from 'express';
import { finishGithubLogin, finishKakaoLogin, finishNaverLogin, finishGoogleLogin, logout, profile, startGoogleLogin, startGithubLogin, startKakaoLogin, startNaverLogin, getEdit, postEdit } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get(':id(\\d+)', profile);
userRouter.route('/edit').get(getEdit).post(postEdit);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);
userRouter.get('/naver/start', startNaverLogin);
userRouter.get('/naver/finish', finishNaverLogin);
userRouter.get('/google/start', startGoogleLogin);
userRouter.get('/google/finish', finishGoogleLogin);

export default userRouter;