import express from 'express';
import { protectorMiddleware, videoUpload } from '../localsMiddleware';
import { deleteVideo, getEdit, getUpload, postEdit, postUpload, watch } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.route('/:id([0-9a-f]{24})').get(watch);
videoRouter.route('/:id([0-9a-f]{24})/delete').all(protectorMiddleware).get(deleteVideo);
videoRouter.route('/:id([0-9a-f]{24})/edit').all(protectorMiddleware).get(getEdit).post(videoUpload.single("video"), postEdit);
videoRouter.route('/upload').get(getUpload).all(protectorMiddleware).post(videoUpload.single("video"), postUpload);

// /:id([0-9a-f]{24}) 정규표현식중 하나로  0~9 문자 a~f 숫자나 문자 다가능. ex)sae3s5rs424dga45
// express.static('uploads')를 통해 uploads 폴더에서 파일가져오고 videoUpload.single("video")로 req.file에 video 넣고 postUpload 컨트롤러 호출.
export default videoRouter;