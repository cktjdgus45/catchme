export const login = (req, res) => {
    return res.render('login');
}
export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: 'Join ' });
}
export const postJoin = (req, res) => {
    //create account
    const { email, username, password, name, location } = req.body;
    console.log(email, username, password, name, location);
    return res.redirect('/');
}


export const profile = (req, res) => {
    return res.render('profile');
}

export const logout = (req, res) => {
    return res.render('logout');
}
export const edit = (req, res) => {
    return res.render('edit');
}
export const remove = (req, res) => {
    return res.render('remove');
}