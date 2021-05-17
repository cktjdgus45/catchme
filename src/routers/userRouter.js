import express from 'express';
import { edit, finishGithubLogin, logout, profile, remove, startGithubLogin } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get('/remove', remove);
userRouter.get(':id(\\d+)', profile);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);

export default userRouter;