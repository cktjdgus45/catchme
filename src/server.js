import express from 'express';
import morgan from 'morgan';

const PORT = 4000;

const app = express();
const logger = morgan('dev');

const handleListening = () => {
    console.log(`Listening on PORT:${PORT}`);
}

app.listen(4000, handleListening);

const handleHome = (req, res) => {
    res.send('response from server');
}

app.use(logger);
app.get('/', handleHome);