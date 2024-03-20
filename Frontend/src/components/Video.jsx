import React from "react";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

const ServerBaseRout = "https://videoapp-dtxd.onrender.com";
const LocalBaseRout = "http://localhost:9999";

const Video = ({ props }) => {
  const [userData, setUserData] = useState({});

  async function fetchUserData() {
    try {
      const userResponse = await fetch(
        `${ServerBaseRout}/api/users/find/${props.userId}`
      );
      setUserData(await userResponse.json());
    } catch (error) {
      console.error("Error fetching User data:", error);
    }
  }

  useEffect(() => {
    window.scrollTo(0, -1);
    fetchUserData();
  }, []);

  return (
    <>
      <Link to={`/play/${props._id}`} className="mb-4">
        <div className="hover:bg-zinc-800 p-1 rounded-lg">
          {/*Thumbnail img */}
          <img
            src={`${props.thumbnail}`}
            className="rounded-lg w-full h-auto object-cover aspect-video"
          ></img>
          <div className="flex mt-2">
            {/*Profile img */}
            <img
              src={userData.profileImg}
              className="w-10 h-10 aspect-square m-1 rounded-full"
            ></img>
            <div className="flex-col ml-2">
              <div className="video_title">
                {props.title.length < 45
                  ? props.title
                  : props.title.substr(0, 45) + "..."}
              </div>
              {/*Channel name */}
              <div className="text-sm text-neutral-400">{userData.name}</div>
              {/*Video info - Views and upload time */}
              <div className="text-sm text-neutral-400">
                Views {props.views} . {format(props.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Video;
