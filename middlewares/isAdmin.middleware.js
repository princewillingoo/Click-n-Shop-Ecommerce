import User from "../models/user.model.js";

const isAdmin = async(req, res, next) => {
    const user = await User.findById(req.userAuthId);

    if (user.isAdmin) {
        next();
    } else {
        next(new Error("Access denied, admin only"))
    }
}

export default isAdmin