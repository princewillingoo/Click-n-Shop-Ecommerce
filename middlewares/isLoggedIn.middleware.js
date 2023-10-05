import { getTokenFromHeader, verifyToken } from "../utils/jwtHandler.util.js"


export const isLoggedIn = (req, res, next) => {
    // get token from header
    const token = getTokenFromHeader(req);
    if (!token){
        throw new Error('Authentication Required!!!')
    }

    // verify the token
    const decodedUser = verifyToken(token);
    if (!decodedUser) {
        throw new Error('Invalid or Expired Token, Please Login Again!!!')
    } else {
        // save the user into req obj
        req.userAuthId = decodedUser?.id;
        next()
    }
}