const {UserRepository,RoleRepository}=require("../repositories");
const{StatusCodes}=require('http-status-codes');
const AppError=require("../utils/errors/app-error");

const {AUTH,ENUMS}=require("../utils/common")

const userrepository=new UserRepository();
const rolerepository=new RoleRepository();

 
async function signUp(data){
    try {
        const user=await userrepository.create(data);
        //console.log(user);
        console.log(ENUMS.USER_ROLES_ENUMS.CUSTOMER)
        const role=await rolerepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);
       // console.log(role)
        user.addRole(role);
        //console.log(city);
        return user;
    } catch (error) {
        if(error.name=='SequelizeValidationError' || error.name=='SequelizeUniqueConstraintError'){
            let explanation=[];
            error.errors.forEach((err) => {
                explanation.push(err.message)
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }

        throw new AppError("Cannot create a new user ",StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data) {
    try {
        const user=await userrepository.getUserByEmail(data.email);
        console.log(user)
    if(!user){
        throw new AppError('User not found',StatusCodes.NOT_FOUND);
    }
    const passwordMatch=AUTH.checkPassword(data.password,user.password);
    if(!passwordMatch){
        throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
    }
    const jwt=AUTH.createToken({id:user.id,email:user.email});
    return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try {
        
        if(!token){
            
            throw new AppError('Missing jwt token',StatusCodes.BAD_REQUEST);
        }
        const response= AUTH.verifyToken(token);
        const user=await userrepository.get(response.id);
        if(!user){
            throw new AppError('No user found',StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name=='JsonWebTokenError'){
            throw new AppError('Invalid jwt token',StatusCodes.BAD_REQUEST);
        }
        if(error.name=='TokenExpiredError'){
            throw new AppError('jwt token expired',StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoletoUser(data) {
    try {
        const user=await userrepository.get(data.id);
        if(!user){
            throw new AppError('User not found',StatusCodes.NOT_FOUND);
        }
        const role=await rolerepository.getRoleByName(data.role);
        if(!role){
            throw new AppError('No user found for the given role',StatusCodes.NOT_FOUND); 
        }
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
    try {
        const user=await userrepository.get(id);
        if(!user){
            throw new AppError('User not found',StatusCodes.NOT_FOUND);
        }
        const adminRole=await rolerepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);

        if(!adminRole){
            throw new AppError('No user found for the given role',StatusCodes.NOT_FOUND);
        }

        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    signUp,
    signIn,
    isAuthenticated,
    addRoletoUser,
    isAdmin
}