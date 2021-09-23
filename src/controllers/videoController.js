import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';
import moment from 'moment';

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).populate("owner");
        return res.render('home', { pageTitle: "Catch Me", videos });
    } catch (error) {
        console.log(error);
    }
}

export const single = async (req, res) => {
    try {
        return res.render('single', { pageTitle: "Catch Me" });
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
        }).populate({ path: 'owner' });
        return res.render('search', { pageTitle: `${keyword} - CatchMe`, videos });
    }
    return res.render('search', { pageTitle: `${keyword} - CatchMe`, videos });
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "영상 업로드" });
}

export const postUpload = async (req, res) => {
    const { _id } = req.session.user;
    const { title, description, hashtags } = req.body;
    const { video, thumb } = req.files;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0].path,
            thumbUrl: `${thumb[0].destination + thumb[0].filename}`,
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
        req.flash('success', '비디오가 업로드 되었습니다.');
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        return res.render('upload', { pageTitle: "영상 업로드", errorMessage: error._message });
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate({ path: 'owner' }).populate({ path: 'comments', populate: { path: 'owner' } });
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    //comment time
    video.comments.forEach(comment => {
        comment.createdAt = diff(comment.createdAt);
    });
    let liking = false;
    if (req.session.user) {
        const { _id } = req.session.user;
        //liking or disliking?
        if (video.meta.likes.includes(_id)) {
            //좋아요를 누른 상태
            liking = true;
        } else {
            //좋아요를 누르지 않은 상태
            liking = false;
        }
    }
    return res.render('watch', { pageTitle: video.title, video, liking });
}

const diff = (createdAt) => {
    const nowArr = moment().format('YYYY-M-D-H-m-s').split('-'); //현재날짜배열
    const currentTime = moment(nowArr); //댓글쓴시간 ==현재
    const commentTime = moment(createdAt); //댓글이 쓰여진 시간
    let cmTime = currentTime.diff(commentTime, 'seconds');
    if (cmTime < 60) {
        return cmTime = currentTime.diff(commentTime, 'seconds') + '초전';
    }
    else if (cmTime > 60 && cmTime <= 3600) {
        return cmTime = currentTime.diff(commentTime, 'minutes') + '분전';
    } else if (cmTime > 3600 && cmTime <= 86400) {
        return cmTime = currentTime.diff(commentTime, 'hours') + '시간전';
    } else if (cmTime > 86400 && cmTime <= 2772000) {
        return cmTime = currentTime.diff(commentTime, 'days') + '일전';
    } else if (cmTime > 2772000 && cmTime <= 31536000) {
        return cmTime = currentTime.diff(commentTime, 'months') + '달전';
    } else if (cmTime > 31536000) {
        return cmTime = currentTime.diff(commentTime, 'years') + '년전';
    }
}
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        req.flash('error', 'Not authorized');
        return res.status(403).redirect('/home');
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
        req.flash('error', '영상수정에 대한 권한이 없습니다');
        return res.status(403).redirect("/home");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
        fileUrl
    });
    req.flash('success', '성공적으로 영상이 업데이트 되었습니다.');
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
        req.flash('error', 'Not authorized');
        return res.status(403).redirect('/home');
    }
    await Video.findByIdAndDelete(id);
    req.flash('info', '성공적으로 영상이 삭제 되었습니다.');
    return res.redirect('/home');
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

    const now = moment().format('YYYY-M-D-H-m-s'); //"2021-08-28-13-08-46"
    const nowArr = now.split('-');

    const comment = await Comment.create({
        text,
        owner: _id,
        video: id,
        createdAt: nowArr
    });
    video.comments.push(comment._id);
    video.save();
    const commentOwner = await Comment.findById(comment._id).populate({ path: 'owner' });
    return res.status(201).json({
        newCommentId: comment._id,
        commentOwner: commentOwner.owner,
        createdAt: commentOwner.createdAt
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
        req.flash('error', 'Not authorized');
        return res.status(403).redirect('/home');
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
//todo
//comments 등록부분 보면서 push save 하기.
export const registerLike = async (req, res) => {
    if (!req.session) {
        return;
    }
    const { params: { id } } = req;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if (!video) {
        return res.sendStatus(404);
    }

    if (!video.meta.likes.includes(user._id)) {//포함하고있지 않다면 추가,각유저씩1개만넣도록
        video.meta.likes.push(user._id);
        await video.save();
    }
    if (!user.likes.includes(video._id)) {
        user.likes.push(video._id);
        await user.save();
    }
    return res.status(201).json({
        videoMeta: video.meta,
        userLikes: user.likes
    });
}
export const registerDislike = async (req, res) => {
    if (!req.session) {
        return;
    }
    const { params: { id } } = req;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    const user = await User.findById(_id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.likes.pop(user._id);
    await video.save();
    user.likes.pop(video._id);
    await user.save();
    return res.status(201).json({
        videoMeta: video.meta,
    });
}

export const getVideoRecord = (req, res) => {
    if (!req.session) {
        return;
    }
    return res.render("record", { pageTitle: "비디오녹화" });
}