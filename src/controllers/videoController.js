import Video from '../models/Video';

export const home = async (req, res) => {
    try {
        const videos = await Video.find({});
        return res.render('home', { pageTitle: "home", videos });
    } catch (error) {
        console.log(error);
    }
}
export const search = (req, res) => {
    return res.render('search', { pageTitle: "search" });
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "Upload Video" });
}

export const postUpload = async (req, res) => {
    const { title,
        description,
        hashtags } = req.body;
    await Video.create({
        title,
        description,
        createdAt: Date.now(),
        hashtags: hashtags.split(',').map((word) => `#${word}`),
        meta: {
            views: 0,
            rating: 0
        }
    });
    return res.redirect('/');
}

export const watch = (req, res) => {
    const { id } = req.params;
    return res.render('watch', { pageTitle: `Watching ` });
}

export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render('editVideo', { pageTitle: `Editing` });
}

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
}


export const deleteVideo = (req, res) => {
    return res.render('deleteVideo', { pageTitle: "delete" });
}