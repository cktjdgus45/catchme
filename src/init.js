import 'dotenv/config';

import './db';
import './models/Video';
import './models/User';
import './models/Comment';
//DB 스키마와 DB 설정파일 불러오기

import app from './server';
//server설정 파일에서 app 가져오기

const PORT = 4000;

const handleListening = () => {
    console.log(`Listening on PORT:${PORT}`);
}

app.listen(4000, handleListening);
//서버 app 실행.
//const app = express();
