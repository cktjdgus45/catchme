import express from 'express';
import { protectorMiddleware, videoUpload } from '../localsMiddleware';
import { deleteVideo, getEdit, getUpload, getVideoRecord, postEdit, postUpload, watch } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.route('/:id([0-9a-f]{24})').get(watch);
videoRouter.route('/record').get(getVideoRecord);
videoRouter.route('/:id([0-9a-f]{24})/delete').all(protectorMiddleware).get(deleteVideo);
videoRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(videoUpload.single("video"), postEdit);
videoRouter.route('/upload').get(getUpload).all(protectorMiddleware).post(videoUpload.fields([{ name: 'video', maxCount: '1' }, { name: 'thumb', maxCount: '1' }]), postUpload);

export default videoRouter;