import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { localsMiddleware } from './localsMiddleware';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';
import flash from 'express-flash';

const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}))

app.use('/assets', express.static("assets"));
app.use('/img', express.static("img"));
app.use('/uploads', express.static("uploads"));

app.use(flash());
app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/api', apiRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;