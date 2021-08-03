import express from 'express';
import { getJoin, getLogin, postJoin, postLogin } from '../controllers/userController';
import { home, search, single } from '../controllers/videoController';
import { publicOnlyMiddleware } from '../localsMiddleware';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.get('/search', search);
rootRouter.get('/single', single)
rootRouter.route('/login').all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
export default rootRouter;

