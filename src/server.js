import express from 'express';

const PORT = 4000;

const app = express();

const handleListening = (req, res) => {
    console.log(`Listening on PORT:${PORT}`);
}

app.listen(4000, handleListening);