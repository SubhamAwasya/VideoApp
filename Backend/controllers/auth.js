import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import { uploadImgOnFireBase } from "../utils/firebase.js";
import { setLogLevel } from "firebase/app";

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("////", error);
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //checking that user is already registerd on database
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.status(409).send({ message: "You Already registerd" });
      throw new ApiError(409, "User with email already exists");
    }

    //genrating hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //checking that file is comming form frontend
    if (
      !req.files &&
      !Array.isArray(req.files.profileImg) &&
      !req.files.profileImg.length > 0
    ) {
      res.status(500).send({ message: "Profile image is required!" });
    }
    const profilePath = req.files.profileImg[0].path;
    const publicProfileUrl = await uploadImgOnFireBase(profilePath);
    // is public url recieved from firebase
    if (!publicProfileUrl) {
      res.status(500).send({ message: "Profile uploading faild!" });
    }

    // creating user
    const newUser = new User({
      name,
      email,
      password: hash,
      profileImg: publicProfileUrl,
      refreshToken: null,
    });
    const createdUser = await newUser.save();
    if (!createdUser) {
      res
        .status(500)
        .send({ message: "Somthing went wrong User not created!" });
    }
    res.status(200).send({ message: "User has been created!" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    // const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    const { password, ...others } = user._doc;

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  } catch (err) {
    next(err);
  }
};

export const logOut = async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const options = { httpOnly: true };
  res
    .status(200)
    .clearCookie("access_token", options)
    .send({ message: "Loged out succesfully" });
};

export const signinWithAccessToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

    const { password, refreshToken, ...others } = user._doc;

    console.log(others);
    res.status(200).send(others);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
