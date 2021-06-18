import mongoose from "mongoose"; //npm i mongoose.

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }); //db연결 설정. process.dot.env 는 env파일참고.

const db = mongoose.connection;

db.on("error", (error) => console.log("DB ERROR!!", error));
db.once("open", () => console.log("Connected to DB successfully"));
//mongoose 문서 기본시작 예시참고함.