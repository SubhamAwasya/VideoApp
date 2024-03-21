import { UserContext } from "../../context/user-context.jsx";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { baseRout } from "../ConstantData.js";

const rout = `${baseRout}/api/videos/upload`;

const UploadVideo = () => {
  const { user } = useContext(UserContext);
  const [isUploadingVideo, setisUploadingVideo] = useState(false);
  const [imageSelectText, setImageSelectText] = useState("Choose Image...");
  const [vidoSelectText, setVidoSelectText] = useState("Choose Vidoe...");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  function formSubmitHandler(e) {
    e.preventDefault();
    setisUploadingVideo(true);
    let formData = new FormData();
    formData.append("userId", user._id);
    formData.append("thumbnail", imageFile);
    formData.append("video", videoFile);
    formData.append("title", e.target.title.value);
    formData.append("desc", e.target.desc.value);

    //Sending data to server
    fetch(rout, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        formData = new FormData();
        setisUploadingVideo(false);
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch
        formData = new FormData();
        console.log(error);
        setisUploadingVideo(false);
      });
  }

  return (
    <>
      <form
        id="myForm"
        method="post"
        className="relative flex-col justify-center text-center items-center w-96 max-sm:w-80 bg-neutral-800 p-8 m-8 rounded-xl"
        encType="multipart/form-data"
        onSubmit={formSubmitHandler}
      >
        <div className="form-group">
          {/*Image selector*/}
          <div className="w-11/12 m-auto my-2 flex flex-col rounded-md bg-neutral-700">
            <input
              className="w-0 h-0"
              onChange={(e) => {
                const file = e.target.files[0];
                setImageSelectText(file.name);
                setImageFile(file);
              }}
              type="file"
              id="image_upload"
              name="image"
              accept="image/*"
              required
            ></input>
            <label
              htmlFor="image_upload"
              className="flex items-center justify-center cursor-pointer h-20"
            >
              <span className="material-symbols-outlined scale-[2] mr-6">
                add_photo_alternate
              </span>
              {imageSelectText}
            </label>
          </div>
          {/*Video selector*/}
          <div className="w-11/12 m-auto my-1 flex flex-col rounded-md bg-neutral-700">
            <input
              className="w-0 h-0"
              onChange={(e) => {
                const file = e.target.files[0];
                setVidoSelectText(file.name);
                setVideoFile(file);
              }}
              type="file"
              id="video_upload"
              name="video"
              accept="video/*"
              required
            ></input>
            <label
              htmlFor="video_upload"
              className="flex items-center justify-center cursor-pointer h-20"
            >
              <span className="material-symbols-outlined scale-[2] mr-6">
                video_camera_back
              </span>
              {vidoSelectText}
            </label>
          </div>
        </div>
        <input
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Video Title"
          type="text"
          id="title"
          name="title"
          required
        ></input>
        <textarea
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Description"
          id="desc"
          rows={5}
          name="desc"
          required
        ></textarea>

        {!isUploadingVideo ? (
          <button
            className="bg-transparent hover:bg-neutral-700 border-2 border-neutral-500 hover:border-neutral-300 p-2 w-32 m-4 rounded-md"
            type="submit"
            id="submit"
          >
            Upload
          </button>
        ) : (
          <div className="flex flex-col mt-10 items-center">
            <div className="loader text-5xl">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div>Uploading Video..</div>
          </div>
        )}
      </form>
    </>
  );
};

export default UploadVideo;
