

const {StatusCodes}=require("http-status-codes");
const {ErrorResponse} =require("../utils/common")
const AppError=require("../utils/errors/app-error");
const { UserService } = require("../services");
const { message } = require("../utils/common/error-response");

function validateAuthRequest(req,res,next){
    if(!req.body.email ){
        ErrorResponse.message='Something went wrong while authenticating user';

        ErrorResponse.error=new AppError([ 'Email not found in the oncoming request'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    } 

    if(!req.body.password ){
        ErrorResponse.message='Something went wrong while authenticating user';

        ErrorResponse.error=new AppError([ 'password not found in the oncoming request'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST)
        .json(ErrorResponse)
    } 
    next();
    }


    async function checkAuth(req,res,next) {
        try {
            console.log(req.method);
            const isAuthenticated=await UserService.isAuthenticated(req.headers['x-access-token']);
           
            if(isAuthenticated){
                req.user=isAuthenticated;
                
                next();
            }
        } catch (error) {
                ErrorResponse.error=error;
            return res.status(error.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse)
        }
        
    }

    
    
    module.exports={
        validateAuthRequest,
        checkAuth,
        
    }