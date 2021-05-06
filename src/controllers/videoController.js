const fakeUser = {
    username: "cha",
    loggedIn: true
}

export const home = (req, res) => {
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
    res.render('home', { pageTitle: "home", potato: "potato", fakeUser, videos });
}
export const search = (req, res) => {
    res.send('search', { pageTitle: "search" });
}

export const upload = (req, res) => {
    res.send('upload', { pageTitle: "Upload" });
}

export const see = (req, res) => {
    console.log(req.params);
    res.send('see', { pageTitle: "wath Video" });
}

export const editVideo = (req, res) => {
    console.log(req.params);
    res.send('editVideo', { pageTitle: "edit" });
}

export const deleteVideo = (req, res) => {
    console.log(req.params);
    res.send('deleteVideo', { pageTitle: "delete" });
}