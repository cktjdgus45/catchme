const fakeUser = {
    username: "cha",
    loggedIn: true
}


export const home = (req, res) => {
    res.render('home', { pageTitle: "home", potato: "potato", fakeUser });
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