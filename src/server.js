import express from 'express';//express서버 프레임워크 npm install express -> node_modules에 저장 -> import해서 사용.
import morgan from 'morgan';//서버연결상태 확인용 . 200 ,404
import session from 'express-session';//로그인할시 세션 사용하기위해 install , 사용.
import MongoStore from 'connect-mongo';//세션정보를 DB에 저장하기위해다운
import { localsMiddleware } from './localsMiddleware'; //직접만든 미들웨어
import rootRouter from './routers/rootRouter';//홈라우트
import userRouter from './routers/userRouter';//사용자라우트
import videoRouter from './routers/videoRouter';//비디오라우트
import apiRouter from './routers/apiRouter';//프론트엔드와 서버통신을 위한 라우트

const app = express();
const logger = morgan('dev');
//NPM 사이트에 명시되있는대로 실행.

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
//서버 뷰템플릿 설정
app.use(logger);
app.use(express.urlencoded({ extended: true }));
//form의 data를 받아오기위해 필요한 서버(express) 설정.
app.use(express.json());
//브라우저가 보내는 req를 json형태로 서버가 해석하기위해 필요한 설정.

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL })
}))
//로그인시 세션에 저장 설정.

app.use('/uploads', express.static("uploads"));
app.use('/assets', express.static("assets"));
app.use('/img', express.static("img"));
//업로드나 브라우저 script(src="/assets")할떄 파일을 서버가 이해할수 있도록 하기위한 설정 . 안하면 서버는 파일의 존재를 모름.

app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/api', apiRouter);
app.use('/users', userRouter);  //ex) /users/login , /users/logout, /users/join, /users/profile
app.use('/videos', videoRouter);
//라우터들.

export default app;