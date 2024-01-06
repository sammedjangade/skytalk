const express = require("express")
const {registerUser, authUser,allUsers}= require("../controllers/useControllers");
// const {protect} = require("./middlewares/authMiddleware");
const generateToken=require("../config/generateToken");
// const {protect} = require("./middlewares/authMiddleware")
const {protect}=require("../middlerwares/authMiddleware");


const router= express.Router();

router.route("/").post(registerUser).get(protect,allUsers);
router.post("/login",authUser);


module.exports=router;