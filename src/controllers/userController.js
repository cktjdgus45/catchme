import User from '../models/User';
import Video from '../models/Video';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment';

export const logout = (req, res) => {
    req.flash('success', '성공적으로 로그아웃 되었습니다.');
    setTimeout(() => req.session.destroy(), 1000);
    req.session.loggedIn = false;
    return res.redirect('/home');
}


export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "You are logged in with Social Account!");
        return res.redirect('/home');
    }
    return res.render("change-password", { pageTitle: "비밀번호 변경" });
}

export const getLeaveAccount = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const whatUserUpload = user.videos;
    const whatUserUploadArr = Object.values(whatUserUpload);
    console.log(whatUserUploadArr);
    let i;
    for (i = 0; i < whatUserUploadArr.length; i++) {
        await Video.findByIdAndRemove(whatUserUploadArr[i]);
    }
    await User.findByIdAndRemove(id);
    req.session.loggedIn = false;
    req.session.user = {};
    req.flash('success', '성공적으로 회원탈퇴 되었습니다.');
    return res.redirect('/home');
}

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, password }
        },
        body: { oldPassword, newPassword, newPasswordConfirmation }
    } = req;

    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render('change-password', { pageTitle: "비밀번호 변경", errorMessage: "새 비밀번호가 일치하지 않습니다." })
    }
    const isSamePassword = await bcrypt.compare(oldPassword, password);
    if (!isSamePassword) {
        return res.status(400).render('change-password', { pageTitle: "비밀번호 변경", errorMessage: "현재 비밀번호가 일치하지 않습니다." });
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    req.flash('success', '성공적으로 비밀번호가 변경되었습니다.');
    await user.save();
    req.session.user.password = user.password;
    return res.redirect('/home');
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render('edit-profile', { pageTitle: "프로파일 업데이트", user });
}
export const getUserVideos = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    user.videos.forEach(video => {
        video.createdAt = diff(video.createdAt);
    })
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render('myVideo', { pageTitle: "내 동영상", user });
}
export const getProfile = async (req, res) => {
    return res.render('myProfile', { pageTitle: "내 동영상" });
}
const diff = (createdAt) => {
    const nowArr = moment().format('YYYY-M-D-H-m-s').split('-'); //현재날짜배열
    const currentTime = moment(nowArr); //댓글쓴시간 ==현재
    const commentTime = moment(createdAt); //댓글이 쓰여진 시간
    let cmTime = currentTime.diff(commentTime, 'seconds');
    if (cmTime < 60) {
        return cmTime = currentTime.diff(commentTime, 'seconds') + '초전';
    }
    else if (cmTime > 60 && cmTime <= 3600) {
        return cmTime = currentTime.diff(commentTime, 'minutes') + '분전';
    } else if (cmTime > 3600 && cmTime <= 86400) {
        return cmTime = currentTime.diff(commentTime, 'hours') + '시간전';
    } else if (cmTime > 86400 && cmTime <= 2772000) {
        return cmTime = currentTime.diff(commentTime, 'days') + '일전';
    } else if (cmTime > 2772000 && cmTime <= 31536000) {
        return cmTime = currentTime.diff(commentTime, 'months') + '달전';
    } else if (cmTime > 31536000) {
        return cmTime = currentTime.diff(commentTime, 'years') + '년전';
    }
}

export const postEdit = async (req, res) => {
    const userData = req.session.user;
    const {
        session: {
            user: { _id, avatarUrl }
        },
        body: { name, email, location },
        file
    } = req;
    const isEmailExist = await User.exists({ email });
    if (userData.email !== email && isEmailExist) {
        return res.status(400).render('edit-profile', { pageTitle: "프로파일 업데이트", errorMessage: "이미 사용하고 있는 아이디 입니다." });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        location
    }, { new: true });
    req.session.user = updatedUser;
    req.flash('info', '성공적으로 업데이트 되었습니다.');
    return res.redirect('/home');
}

export const getLogin = (req, res) => {
    return res.render('login', { pageTitle: "계정 로그인" });
}
export const postLogin = async (req, res) => {
    const pageTitle = "계정 로그인";
    const { email, password } = req.body;
    const user = await User.findOne({ email, socialOnly: false });
    if (!user) {
        req.flash('error', '존재하지 않는 아이디 입니다.');
        return res.status(400).render('login', { pageTitle, errorMessage: "존재하지 않는 아이디 입니다." });
    }
    const isSamePassword = await bcrypt.compare(password[1], user.password);
    if (!isSamePassword) {
        req.flash('error', '틀린 비밀번호 입니다.');
        return res.status(400).render('login', { pageTitle, errorMessage: "틀린 비밀번호 입니다." });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash('info', '성공적으로 로그인 되었습니다.');
    return res.redirect('/home');
}

export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: '계정 생성' });
}

export const postJoin = async (req, res) => {
    const pageTitle = "계정 생성";
    const { email, password, password2, name, location } = req.body;
    if (password !== password2) {
        req.flash('error', '입력하신 비밀번호가 일치하지 않습니다.');
        return res.status(400).render('join', { pageTitle, errorMessage: "입력하신 비밀번호가 일치하지 않습니다." });
    }
    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
        req.flash('error', '이미 사용하고 있는 아이디 입니다.');
        return res.status(400).render('join', { pageTitle, errorMessage: "이미 사용하고 있는 아이디 입니다." });
    }
    try {
        await User.create({ email, password, password2, name, location });
    } catch (error) {
        res.status(400).render('join', { pageTitle, errorMessage: error._message });
    }
    req.flash('info', '성공적으로 회원가입 되었습니다.');
    return res.redirect('/login');
}

export const startNaverLogin = (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
    const config = {
        client_id: process.env.NAVER_CLIENT,
        redirect_uri: "http://localhost:4000/users/naver/finish",
        response_type: "code",
        state: "RANDOM_STATE"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishNaverLogin = async (req, res) => {
    const baseUrl = "https://nid.naver.com/oauth2.0/token";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT,
        client_secret: process.env.NAVER_SECRET,
        code: req.query.code,
        state: req.query.state
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
        const apiUrl = "https://openapi.naver.com/v1/nid/me";
        const apiData = await (await fetch(`${apiUrl}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/json;charset=UTF-8"
            }
        })).json();
        const userData = apiData.response;
        const emailData = userData.email;
        let user = await User.findOne({ email: emailData, socialOnly: true });
        if (!user) {
            user = await User.create({
                email: emailData,
                avatarUrl: userData.profile_image,
                password: "",
                socialOnly: true,
                name: userData.name,
                location: ""
            });
        }
        user.avatarUrl = userData.profile_image;
        user.name = userData.name;
        user.save();
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash('info', '성공적으로 로그인 되었습니다.');
        return res.redirect('/home');
    } else {
        return res.redirect('/login');
    }
}

export const startGoogleLogin = (req, res) => {
    const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const config = {
        client_id: process.env.GOOGLE_CLIENT,
        redirect_uri: "http://localhost:4000/users/google/finish",
        response_type: "code",
        scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(" ")
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGoogleLogin = async (req, res) => {
    const baseUrl = "https://oauth2.googleapis.com/token";
    const config = {
        grant_type: "authorization_code",
        client_id: process.env.GOOGLE_CLIENT,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uri: "http://localhost:4000/users/google/finish",
        code: req.query.code
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
        const apiUrl = "https://www.googleapis.com/oauth2/v1/userinfo";
        const userData = await (await fetch(`${apiUrl}`, {
            method: "GET",
            headers: {
                ContentType: "application/json;charset=UTF-8",
                Authorization: `Bearer ${access_token}`
            }
        })).json();
        const emailData = userData.email;
        if (userData.verified_email === false) {
            return res.redirect('/login');
        }
        let user = await User.findOne({ email: emailData, socialOnly: true });
        if (!user) {
            user = await User.create({
                email: emailData,
                avatarUrl: userData.picture,
                password: "",
                socialOnly: true,
                name: userData.name,
                location: userData.locale
            });
        }
        user.avatarUrl = userData.picture;
        user.name = userData.name;
        user.save();
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash('info', '성공적으로 로그인 되었습니다.');
        return res.redirect('/home');
    } else {
        return res.redirect('/login');
    }
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
        const apiData = await (await fetch(apiUrl, {
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
        user.avatarUrl = userData.profile_image_url;
        user.name = userData.nickname;
        user.save();
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash('info', '성공적으로 로그인 되었습니다.');
        return res.redirect('/home');
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
        user.avatarUrl = userData.avatar_url;
        user.name = userData.name;
        user.save();
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash('info', '성공적으로 로그인 되었습니다.');
        return res.redirect('/home');
    } else {
        return res.redirect('/login');
    }
}

export const getNews = async (req, res) => {
    const baseUrl = "https://openapi.naver.com/v1/search/news.json";
    const urlConfig = {
        query: "취업",
        display: 16,
    }
    const params = new URLSearchParams(urlConfig).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const config = {
        method: 'get',
        url: finalUrl,
        headers: {
            'X-Naver-Client-Id': process.env.NEWS_CLIENT,
            'X-Naver-Client-Secret': process.env.NEWS_SECRET
        }
    };

    const news = (await axios(config)).data.items;
    return res.render('news', { pageTitle: "취업관련 뉴스", news });
}
