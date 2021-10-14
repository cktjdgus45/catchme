import 'dotenv/config';
import './db';
import 'regenerator-runtime';
import './models/Video';
import './models/User';
import './models/Comment';
import app from './server';

const PORT = process.env.PORT;

const handleListening = () => {
    console.log(`Listening on PORT:${PORT}`);
}

app.listen(PORT, handleListening);
