import express from 'express';
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from '../localsMiddleware';
import { finishGithubLogin, finishKakaoLogin, finishNaverLogin, finishGoogleLogin, logout, profile, startGoogleLogin, startGithubLogin, startKakaoLogin, startNaverLogin, getEdit, postEdit, getChangePassword, postChangePassword } from '../controllers/userController';

const userRouter = express.Router();

userRouter.use('/uploads', express.static("uploads"));
//이 주소로 가면 uploads 폴더의  파일을 가져오겠다. avatarUpload.single('avatar') , uploads 폴더중에서 avatar폴더안에있는것을 가져와 req.file에 파일url을 넣는다. express.static의 기능(문서참고)/

userRouter.get('/logout', protectorMiddleware, logout);
// => /users/logout 으로 가면 protectorMiddleware 거친후 ,  logout 컨트롤러를 실행하겠다.

userRouter.get('/:id', profile);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(avatarUpload.single('avatar'), postEdit);
// => /users/edit 로 가면 protectorMiddleware 거친후 , getEdit ,avatarUpload 컨트롤러를 실행하겠다. 
userRouter.route('/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get('/kakao/start', publicOnlyMiddleware, startKakaoLogin);
userRouter.get('/kakao/finish', publicOnlyMiddleware, finishKakaoLogin);
userRouter.get('/naver/start', publicOnlyMiddleware, startNaverLogin);
userRouter.get('/naver/finish', publicOnlyMiddleware, finishNaverLogin);
userRouter.get('/google/start', publicOnlyMiddleware, startGoogleLogin);
userRouter.get('/google/finish', publicOnlyMiddleware, finishGoogleLogin);
//ex) /users/login , /users/logout, /users/join, /users/profile
//publicOnlyMiddleware 는 로그인안한 상태에서 접근가능한 URL 설정. 보안목적.
//protectorMiddleware 는 로그인한 상태에서 접근가능한 URL 설정. 보안목적.


export default userRouter;