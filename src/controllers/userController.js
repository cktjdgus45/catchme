import User from "../models/User";

export const login = (req, res) => {
    return res.render('login');
}
export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: 'Join ' });
}
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { email, username, password, password2, name, location } = req.body;
    if (password !== password2) {
        return res.render('join', { pageTitle, errorMessage: "입력하신 비밀번호가 일치하지 않습니다." });
    }
    const isNameOrEmailExist = await User.exists({ $or: [{ username }, { email }] });
    if (isNameOrEmailExist) {
        return res.render('join', { pageTitle, errorMessage: "이미 사용하고 있는 닉네임 또는 이메일 입니다." });
    }
    await User.create({ email, username, password, password2, name, location });
    return res.redirect('/login');
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