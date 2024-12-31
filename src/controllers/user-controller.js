const { StatusCodes } = require("http-status-codes");
const {UserService}=require("../services")
const { SuccessResponse, ErrorResponse } = require("../utils/common");


async function signUp(req,res){
    try {
        const user=await UserService.signUp({
            email:req.body.email,
            password:req.body.password
        })
       // console.log(city)
        SuccessResponse.message='Succesfully signed up';
        SuccessResponse.data=user;
        return res.status(StatusCodes.OK).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(error.StatusCode).json(ErrorResponse);
    }

}


async function signIn(req,res){
    try {
        const user=await UserService.signIn({
            email:req.body.email,
            password:req.body.password
        })
       // console.log(city)
        SuccessResponse.message='Succesfully logged in';
        SuccessResponse.data=user;
        return res.status(StatusCodes.OK).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(error.StatusCode).json(ErrorResponse);
    }

}

async function addRoletoUser(req,res){
    try {
        const role=await UserService.addRoletoUser({
            role:req.body.role,
            id:req.body.id
        })
       // console.log(city)
        SuccessResponse.message='Succesfully added role';
        SuccessResponse.data=role;
        return res.status(StatusCodes.OK).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(error.StatusCode).json(ErrorResponse);
    }

}


module.exports={
    signUp,
    signIn,
    addRoletoUser
}