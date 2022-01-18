import httpStatus from "http-status";

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(httpStatus.UNAUTHORIZED).json({ success: false });
    }
    next();
};

export default isAuth;
