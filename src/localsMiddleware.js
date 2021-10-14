import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
})

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Catch Me";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        req.flash('error', '로그인 상태에서 다시 시도해 주세요');
        return res.redirect('/login');
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash('error', '로그아웃 상태에서 다시 시도해 주세요');
        return res.redirect('/');
    }
}

const multerUploader = multerS3({
    s3: s3,
    bucket: 'catchme',
    acl: 'public-read',
})

export const avatarUpload = multer({
    dest: "uploads/avatars/", limits: {
        fileSize: 3000000
    },
    storage: multerUploader
});

export const videoUpload = multer({
    dest: "uploads/videos/", limits: {
        fileSize: 400000000
    },
    storage: multerUploader
})
//multer 은 dest에 해당하는곳으로 파일들을 저장하게 해줌.