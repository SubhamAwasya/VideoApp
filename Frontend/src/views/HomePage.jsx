import React from "react";
import Video from "../components/Video";
import { useEffect, useState } from "react";
import "./css/videos_page.css";
import { baseRout } from "../ConstantData.js";


const HomePage = ({ prop }) => {
  const [videosData, setVideosData] = useState([]);
  const [dataFetchingLog, setDataFetchingLog] = useState("");
  const [loadingAnimatino, setLoadingAnimatino] = useState(false);

  async function fetchData() {
    try {
      setDataFetchingLog("Fetching videos...");
      setLoadingAnimatino(true);

      const response = await fetch(`${baseRout}/api/videos/random`);
      const data = await response.json();

      setVideosData(data); // Update the state with the fetched data
      setDataFetchingLog("");
      setLoadingAnimatino(false);
    } catch (error) {
      setLoadingAnimatino(false);
      setDataFetchingLog("Error fetching videos!");
      console.error("Error fetching videos:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {!dataFetchingLog ? (
        <div className="video-page-container m-0">
          {videosData.map((video, i) => {
            return <Video key={i} props={video} />;
          })}
        </div>
      ) : !loadingAnimatino ? (
        <div className="mt-5 text-red-700 text-2xl">{dataFetchingLog}</div>
      ) : (
        <div className="flex flex-col mt-20 items-center">
          <div className="loader text-5xl">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="mt-5 text-2xl">{dataFetchingLog}</div>
        </div>
      )}
    </>
  );
};

export default HomePage;
