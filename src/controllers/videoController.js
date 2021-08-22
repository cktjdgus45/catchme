import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).populate("owner");
        return res.render('home', { pageTitle: "Home", videos });
    } catch (error) {
        console.log(error);
    }
}

export const single = async (req, res) => {
    try {
        return res.render('single', { pageTitle: "싱글페이지 작성" });
    } catch (error) {
        console.log(error);
    }
}
export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            }
        });
        console.log(videos, keyword);
        return res.render('search', { pageTitle: `Home`, videos });
    }
    return res.render('search', { pageTitle: "Home", videos });
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "Upload Video" });
}

export const postUpload = async (req, res) => {
    const { _id } = req.session.user;
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
            meta: {
                views: 0,
                rating: 0
            }
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('upload', { pageTitle: "비디오 업로드", errorMessage: error._message });
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate({ path: 'owner' }).populate({ path: 'comments', populate: { path: 'owner' } });
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('watch', { pageTitle: video.title, video });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    return res.render('editVideo', { pageTitle: `${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { file: { path: fileUrl } } = req;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
        fileUrl
    });
    return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
}

export const createComment = async (req, res) => {
    const {
        body: {
            text
        },
        params: {
            id
        },
        session: {
            user: { _id }
        }
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: _id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    const commentOwner = await Comment.findById(comment._id).populate({ path: 'owner' });
    return res.status(201).json({
        newCommentId: comment._id,
        commentOwner: commentOwner.owner
    });
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const comment = await Comment.findById(id);
    const video = await Video.findById(comment.video);
    if (!video) {
        return res.sendStatus(404);
    }
    video.comments = video.comments.filter((commentId) => {
        return String(commentId) !== id
    });

    video.save();
    if (!comment) {
        return res.sendStatus(404);
    }
    if (String(comment.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(201);
}

export const registerView = async (req, res) => {
    const { params: { id } } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}