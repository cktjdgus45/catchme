export const home = (req, res) => {
    return res.send('home');
}
export const search = (req, res) => {
    return res.send('search');
}

export const upload = (req, res) => {
    return res.send('upload');
}

export const see = (req, res) => {
    console.log(req.params);
    return res.send('see');
}

export const editVideo = (req, res) => {
    console.log(req.params);
    return res.send('editVideo');
}

export const deleteVideo = (req, res) => {
    console.log(req.params);
    return res.send('deleteVideo');
}