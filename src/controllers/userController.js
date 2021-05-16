import User from '../models/User';
import bcrypt from 'bcrypt';

export const getLogin = (req, res) => {
    return res.render('login');
}
export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).render('login', { pageTitle, errorMessage: "존재하지 않는 아이디 입니다." });
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
        return res.status(400).render('login', { pageTitle, errorMessage: "틀린 비밀번호 입니다." });
    }
    console.log('로그인 성공');
    return res.redirect('/');
}

export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: 'Join ' });
}
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { email, username, password, password2, name, location } = req.body;
    if (password !== password2) {
        return res.status(400).render('join', { pageTitle, errorMessage: "입력하신 비밀번호가 일치하지 않습니다." });
    }
    const isNameOrEmailExist = await User.exists({ $or: [{ username }, { email }] });
    if (isNameOrEmailExist) {
        return res.status(400).render('join', { pageTitle, errorMessage: "이미 사용하고 있는 아이디 또는 이메일 입니다." });
    }
    try {
        await User.create({ email, username, password, password2, name, location });
    } catch (error) {
        res.status(400).render('join', { pageTitle, errorMessage: error._message });
    }
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