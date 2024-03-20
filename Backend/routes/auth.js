import express from "express";
import {
  signup,
  signin,
  googleAuth,
  logOut,
  signinWithAccessToken,
} from "../controllers/auth.js";
import { upload } from "../middleware/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//CREATE A USER
router.post(
  "/signup",
  upload.fields([
    {
      name: "profileImg",
      maxCount: 1,
    },
  ]),
  signup
);

//SIGN IN
router.post("/signin", signin);
router.post("/logout", verifyToken, logOut);
router.post("/login_with_accesstoken", verifyToken, signinWithAccessToken);

//GOOGLE AUTH
router.post("/google", googleAuth);

export default router;
