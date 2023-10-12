import jwt from "jsonwebtoken"

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_KEY, {expiresIn: "15d"})
}


export const getTokenFromHeader = (req) => {
    // get token from header
    const token = req?.headers?.authorization?.split(" ")[1];
    if(token === undefined){
        return false // "No auth token found"
    }
    return token
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if(err) {
            // false
            return false;
        } else {
            return decoded
        }
    })
}