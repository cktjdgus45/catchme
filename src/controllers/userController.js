import User from '../models/User';
import Video from '../models/Video';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';


export const profile = async (req, res) => {
    const { id } = req.params; // 라우터에서 '/:id' 부분이 req.params. /:potato이면 req.params 에서 potato 값을 가져온다.

    const user = await User.findById(id).populate("videos");
    //mongoose를 이용한 DB를 다루는 method . findById(), findByIdAndUpdate() 등등.

    if (!user) {
        return res.status(400).render('404', { pageTitle: "계정 오류" });
        //DB에 id를 통해 찾고자하는 data가 없다면 404.pug를 렌더링 하겠다. (보여준다.)
    }
    return res.render('profile', { pageTitle: `${user.name}의 프로필`, user });
    //DB 에 id를 통해 찾고자하는 data가 있다면 profile.pug를 렌더링 하겠다.
}

export const logout = (req, res) => {
    req.session.destroy();
    //express-session을 install 해서 사용가능한 기능 . 세션에 저장되있는 로그인한 user정보를 destroy(파괴)한다.
    return res.redirect('/');
    //redirect 다시돌아간다 홈으로.
}

export const getChangePassword = (req, res) => {
    return res.render("change-password", { pageTitle: "Change Password" });
    //render은 get 리퀘스트
}
export const postChangePassword = async (req, res) => {
    //db에서 data를 가져와 세션에 유저를 저장하거나 업데이트 ,삭제, 생성 , 하는 작업은 post 리퀘스트.
    const {
        session: {
            user: { _id, password }
        },
        body: { oldPassword, newPassword, newPasswordConfirmation }
    } = req;
    //_id, password,oldPassword, newPassword, newPasswordConfirmation 의 값을 가져온다는 코드. ex) ==req.body.oldPassword

    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render('change-password', { pageTitle: "비밀번호 변경", errorMessage: "새 비밀번호가 일치하지 않습니다." })
    }
    const isSamePassword = await bcrypt.compare(oldPassword, password);
    if (!isSamePassword) {
        return res.status(400).render('change-password', { pageTitle: "비밀번호 변경", errorMessage: "현재 비밀번호가 일치하지 않습니다." });
        //status 400 신호와 redering 하겠다.
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();//db저장
    req.session.user.password = user.password;
    return res.redirect('/users/logout');
}

export const getEdit = (req, res) => {
    return res.render('edit-profile', { pageTitle: "Edit profile" });
}

export const postEdit = async (req, res) => {
    const userData = req.session.user;
    const {
        session: {
            user: { _id, avatarUrl }
        },
        body: { name, email, location },
        // server.js 의 app.use(express.urlencoded({ extended: true })); 땜에 가능.
        file
    } = req;
    console.log(file);
    const isEmailExist = await User.exists({ email });
    if (userData.email !== email && isEmailExist) {
        return res.status(400).render('edit-profile', { pageTitle: "프로필 변경", errorMessage: "이미 사용하고 있는 아이디 입니다." });
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        location
    }, { new: true });
    req.session.user = updatedUser;
    return res.redirect('/');
}

export const getLogin = (req, res) => {
    return res.render('login', { pageTitle: "계정 로그인" });
}
export const postLogin = async (req, res) => {
    const pageTitle = "계정 로그인";
    const { email, password } = req.body;
    const user = await User.findOne({ email, socialOnly: false });
    if (!user) {
        return res.status(400).render('login', { pageTitle, errorMessage: "존재하지 않는 아이디 입니다." });
    }
    const isSamePassword = await bcrypt.compare(password[1], user.password); //compare(1,2) 1,2를 비교해서 같으면 true 반환. bcrypt는 db에저장할 비밀번호를 해쉬화 하기위한 모듈.
    if (!isSamePassword) {
        return res.status(400).render('login', { pageTitle, errorMessage: "틀린 비밀번호 입니다." });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    //session에 db에서 가져온 user data와 loggedIn true값 설정.

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
    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
        return res.status(400).render('join', { pageTitle, errorMessage: "이미 사용하고 있는 아이디 입니다." });
    }
    try {
        await User.create({ email, password, password2, name, location });
        //mongoDB의 create method.  터미널에 mongo 입력 -> use catchme -> show collections -> db.collection.find({}) 또는 db.collection.remove({})
    } catch (error) {
        res.status(400).render('join', { pageTitle, errorMessage: error._message });
    }
    return res.redirect('/login');
}

export const startNaverLogin = (req, res) => {
    //네이버 api문서 참고. 카카오 구글 깃헙 다 똑같은 패턴.
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
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
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
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
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
        user.avatarUrl = userData.avatar_url;
        user.name = userData.name;
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.redirect('/login');
    }
}