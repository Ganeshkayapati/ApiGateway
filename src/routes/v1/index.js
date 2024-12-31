const express=require("express");
const router=express.Router();
const {infoController}=require("../../controllers/index");
const userRoutes=require("./user-routes");
const {AuthMiddleware}=require("../../middlewares")

router.get("/info",AuthMiddleware.checkAuth,infoController.info);
router.use("/users",userRoutes)

module.exports=router;