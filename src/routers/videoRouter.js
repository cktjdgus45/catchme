import express from 'express';
import { deleteVideo, editVideo, see, upload } from '../controllers/videoController';

const videoRouter = express.Router();



videoRouter.get('/upload', upload);
videoRouter.get('/:id', see);
videoRouter.get('/:id/edit', editVideo);
videoRouter.get('/:id/delete', deleteVideo);

export default videoRouter;