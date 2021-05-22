import express from 'express';
import { edit, finishGithubLogin, finishKakaoLogin, finishNaverLogin, finishGoogleLogin, logout, profile, startGoogleLogin, startGithubLogin, startKakaoLogin, startNaverLogin } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get(':id(\\d+)', profile);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get('/kakao/start', startKakaoLogin);
userRouter.get('/kakao/finish', finishKakaoLogin);
userRouter.get('/naver/start', startNaverLogin);
userRouter.get('/naver/finish', finishNaverLogin);
userRouter.get('/google/start', startGoogleLogin);
userRouter.get('/google/finish', finishGoogleLogin);

export default userRouter;