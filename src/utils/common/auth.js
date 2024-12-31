const jwt=require("jsonwebtoken");
const{serverConfig}=require("../../config");
const bcrypt=require("bcrypt");

 function  createToken(input) {
    try {
        return jwt.sign(input,serverConfig.JWT_SECRET,{expiresIn:serverConfig.JWT_EXPIRY})
    } catch (error) {
        console.log(error);
        throw error;
    }
}

 function checkPassword(plainPassword,encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword,encryptedPassword);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

function verifyToken(token){
    try {
        return jwt.verify(token,serverConfig.JWT_SECRET)
    } catch (error) {
        throw error;
    }
}



module.exports={
    createToken,
    checkPassword,
    verifyToken
}