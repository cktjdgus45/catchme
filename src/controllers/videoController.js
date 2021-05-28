import Video from '../models/Video';
import User from '../models/User';

export const home = async (req, res) => {
    try {
        const videos = await Video.find({});
        return res.render('home', { pageTitle: "home", videos });
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
        return res.render('search', { pageTitle: `searching ${keyword}`, videos });
    }
    return res.render('search', { pageTitle: "search", videos });
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
        return res.render('upload', { pageTitle: "Upload Video", errorMessage: error._message });
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
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
    return res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render('404', { pageTitle: 'Video Not Found' });
    }
    if (String(video.owner) !== _id) {
        return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
}


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

export const createComment = (req, res) => {
    console.log(req.body.text);
    console.log(req.params);
    return res.redirect('/');
}