import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';


export const getLogin = (req, res) => {
    return res.render('login');
}
export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const { email, password } = req.body;
    const user = await User.findOne({ email, socialOnly: false })
    if (!user) {
        return res.status(400).render('login', { pageTitle, errorMessage: "존재하지 않는 아이디 입니다." });
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
        return res.status(400).render('login', { pageTitle, errorMessage: "틀린 비밀번호 입니다." });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
}

export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: 'Join ' });
}

export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { email, password, password2, name, location } = req.body;
    if (password !== password2) {
        return res.status(400).render('join', { pageTitle, errorMessage: "입력하신 비밀번호가 일치하지 않습니다." });
    }
    const isNameOrEmailExist = await User.exists({ email });
    if (isNameOrEmailExist) {
        return res.status(400).render('join', { pageTitle, errorMessage: "이미 사용하고 있는 아이디 입니다." });
    }
    try {
        await User.create({ email, password, password2, name, location });
    } catch (error) {
        res.status(400).render('join', { pageTitle, errorMessage: error._message });
    }
    return res.redirect('/login');
}


export const profile = (req, res) => {
    return res.render('profile');
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}
export const edit = (req, res) => {
    return res.render('edit');
}
export const startKakaoLogin = (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
        client_id: process.env.KKO_CLIENT,
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        response_type: "code",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishKakaoLogin = async (req, res) => {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.KKO_CLIENT,
        redirect_uri: "http://localhost:4000/users/kakao/finish",
        code: req.query.code,
        client_secret: process.env.KKO_SECRET
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json;charset=UTF-8",
        }
    })).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://kapi.kakao.com/v2/user/me";
        const apiData = await (await fetch(`${apiUrl}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/x-www-form-urlencoded;charset=utf-8",
            }
        })).json();
        const data = apiData.kakao_account;
        const userData = data.profile;
        const emailData = data.email;
        if (data.is_email_valid === false || data.is_email_verified === false) {
            return res.redirect('/login');
        }
        let user = await User.findOne({ email: emailData, socialOnly: true });
        if (!user) {
            user = await User.create({
                email: emailData,
                avatarUrl: userData.profile_image_url,
                password: "",
                socialOnly: true,
                name: userData.nickname,
                location: ""
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        }
    })).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailObj = emailData.find(email => email.verified === true && email.primary === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email, socialOnly: true });
        if (!user) {
            user = await User.create({
                email: emailObj.email,
                avatarUrl: userData.avatar_url,
                password: "",
                socialOnly: true,
                name: userData.name,
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
}