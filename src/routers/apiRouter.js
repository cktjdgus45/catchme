import express from 'express';
import { createComment, deleteComment, registerView, registerLike, registerDislike } from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/like", registerLike);
apiRouter.post("/videos/:id([0-9a-f]{24})/dislike", registerDislike);

export default apiRouter;