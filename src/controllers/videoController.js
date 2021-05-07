
const videos = [
    {
        title: "video1",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1
    },
    {
        title: "video2",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 2
    },
    {
        title: "video3",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 3
    },
];

export const home = (req, res) => {
    return res.render('home', { pageTitle: "home", potato: "potato", videos });
}
export const search = (req, res) => {
    return res.render('search', { pageTitle: "search" });
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: "Upload Video" });
}

export const postUpload = (req, res) => {
    const { title } = req.body;
    const newVideo = {
        title,
        rating: 0,
        comments: 0,
        createdAt: "now",
        views: 0,
        id: videos.length + 1
    };
    videos.push(newVideo);
    return res.redirect('/');
}

export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render('watch', { pageTitle: `Watching ${video.title}`, video });
}

export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render('editVideo', { pageTitle: `Editing ${video.title}`, video });
}

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
}


export const deleteVideo = (req, res) => {
    return res.render('deleteVideo', { pageTitle: "delete" });
}