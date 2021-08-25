import express from 'express';
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from '../localsMiddleware';
import { finishGithubLogin, finishKakaoLogin, finishNaverLogin, finishGoogleLogin, logout, startGoogleLogin, startGithubLogin, startKakaoLogin, startNaverLogin, getEdit, postEdit, getChangePassword, postChangePassword, see, getLeaveAccount } from '../controllers/userController';

const userRouter = express.Router();

userRouter.use('/uploads', express.static("uploads"));

userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(avatarUpload.single('avatar'), postEdit);
userRouter.route('/:id([0-9a-f]{24})/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.route('/:id([0-9a-f]{24})/leave-account').all(protectorMiddleware).get(getLeaveAccount);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/kakao/start', publicOnlyMiddleware, startKakaoLogin);
userRouter.get('/kakao/finish', publicOnlyMiddleware, finishKakaoLogin);
userRouter.get('/naver/start', publicOnlyMiddleware, startNaverLogin);
userRouter.get('/naver/finish', publicOnlyMiddleware, finishNaverLogin);
userRouter.get('/google/start', publicOnlyMiddleware, startGoogleLogin);
userRouter.get('/google/finish', publicOnlyMiddleware, finishGoogleLogin);





export default userRouter;