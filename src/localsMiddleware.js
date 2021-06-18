import multer from 'multer';  //npm install multer -> import -> 사용.

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);  //loggedIn으로 pug에서 사용가능하게됨.
    res.locals.siteName = "Catch Me";
    res.locals.loggedInUser = req.session.user || {};  //loggedInUser 에 session에 저장된 로그인유저정보 넣기.
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/login');
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect('/');
    }
}

export const avatarUpload = multer({
    dest: "uploads/avatars/", limits: {
        fileSize: 3000000
    }
});
export const videoUpload = multer({
    dest: "uploads/videos/", limits: {
        fileSize: 20000000
    }
});
//multer 은 dest에 해당하는곳으로 파일들을 저장하게 해줌.