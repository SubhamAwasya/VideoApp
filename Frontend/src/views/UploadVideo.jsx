import React from "react";

const UploadVideo = () => {
  return (
    <>
      <form
        id="myForm"
        method="post"
        className="relative flex-col justify-center text-center items-center w-96 max-sm:w-80 bg-neutral-800 p-8 m-8 rounded-xl"
        encType="multipart/form-data"
        onSubmit={(e) => {}}
      >
        <div className="form-group">
          <img
            className="w-40 mx-auto"
            src={"DefaultUpload.png"}
            alt="Image preview"
          ></img>

          <input
            className="w-11/12 p-2 m-1 rounded-md"
            onChange={(e) => {}}
            type="file"
            id="video_upload"
            name="video"
            accept="video/*"
            required
          ></input>
          <span
            style={{
              margin: 0,
              marginTop: "-3rem",
              marginBottom: "1rem",
            }}
          >
            Select a Video
          </span>
        </div>
        <input
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Video Title"
          type="text"
          id="title"
          name="title"
          required
        ></input>
        <input
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Tag"
          type="text"
          id="title"
          name="title"
          required
        ></input>

        <button
          className="bg-transparent hover:bg-neutral-700 border-2 border-neutral-500 hover:border-neutral-300 p-2 w-32 m-4 rounded-md"
          type="submit"
          id="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
};

export default UploadVideo;
