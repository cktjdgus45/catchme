import express from 'express';
import { deleteVideo, editVideo, see, upload } from '../controllers/videoController';

const videoRouter = express.Router();



videoRouter.get('/upload', upload);
videoRouter.get('/:id(\\d+)', see);
videoRouter.get('/:id(\\d+)/edit', editVideo);
videoRouter.get('/:id(\\d+)/delete', deleteVideo);

export default videoRouter;