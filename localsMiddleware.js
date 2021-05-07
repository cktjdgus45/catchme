export const localsMiddleware = (req, res, next) => {
    res.locals.fakeUser = {
        username: "cha",
        loggedIn: true
    }
    next();
}