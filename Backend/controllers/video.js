import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";
import {
  uploadImgOnFireBase,
  uploadVideoOnFireBase,
} from "../utils/firebase.js";

export const addVideo = async (req, res, next) => {
  try {
    // Checking is thumbnail image is present in req
    if (!Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
      res.status(500).send({ message: "Thumbnail is required" });
    }

    // Checking is thumbnail image is present in req
    if (!Array.isArray(req.files.video) && req.files.video.length > 0) {
      res.status(500).send({ message: "Vidoe is required" });
    }

    const publicThumbnailUrl = await uploadImgOnFireBase(
      req.files.thumbnail[0].path
    );

    const publicVideoUrl = await uploadVideoOnFireBase(req.files.video[0].path);

    console.log(publicThumbnailUrl);
    console.log("////////////////////////////");
    console.log(publicVideoUrl);

    // is public url recieved from firebase
    if (!publicThumbnailUrl) {
      res.status(500).send({ message: "thumbnail uploading faild!" });
    }
    // is public url recieved from firebase
    if (!publicVideoUrl) {
      res.status(500).send({ message: "Vidoe uploading faild!" });
    }

    console.log(req.body);

    const newVideo = new Video({
      userId: req.body.userId,
      title: req.body.title,
      desc: req.body.desc,
      thumbnail: publicThumbnailUrl,
      videoUrl: publicVideoUrl,
    });
    const savedVideo = await newVideo.save();
    console.log(savedVideo);
    if (!savedVideo) {
      res
        .status(500)
        .send({ message: "Somthing went wrong Video upload faild!" });
    }
    res.status(200).send({ message: "Video uploaded successfully" });
  } catch (err) {
    res.send(err);
    console.log(err);
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
