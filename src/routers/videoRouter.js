import express from 'express';
import { deleteVideo, getEdit, postEdit, upload, watch } from '../controllers/videoController';

const videoRouter = express.Router();



videoRouter.get('/upload', upload);
videoRouter.get('/:id(\\d+)', watch);

videoRouter.get('/:id(\\d+)/edit', getEdit);
videoRouter.post('/:id(\\d+)/post-edit', postEdit);

videoRouter.get('/:id(\\d+)/delete', deleteVideo);

export default videoRouter;