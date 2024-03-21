import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/user-context.jsx";

const NavBar = ({
  isSideBarOpen,
  setisSideBarOpen,
  setleftMarginForContentPage,
}) => {
  const { user } = useContext(UserContext);

  useEffect(() => {}, [user]);

  return (
    <>
      <nav className="flex w-full justify-between items-center h-14 fixed top-0 z-50 bg-neutral-950">
        <div className="flex items-center">
          <button
            className="w-12 h-8 m-2 text-2xl flex rounded-lg items-center border-2 border-transparent hover:border-red-700"
            onClick={() => {
              if (isSideBarOpen && window.innerWidth > 1000) {
                setisSideBarOpen("");
                setleftMarginForContentPage("ml-52");
              } else if (isSideBarOpen) {
                setisSideBarOpen("");
              } else {
                setisSideBarOpen("hidden ");
                setleftMarginForContentPage("");
              }
            }}
          >
            <span className="material-symbols-outlined mx-auto text-red-500">
              menu
            </span>
          </button>
          <Link
            to={"/"}
            className="text-2xl font-bold max-md:hidden cursor-pointer"
          >
            VideoApp
          </Link>
        </div>
        {/*Search input */}
        <div>
          <input
            className="w-96 p-1 pl-4 rounded-full max-lg:w-60 max-sm:w-36 bg-neutral-900"
            placeholder="Search Videos"
          ></input>
        </div>
        {/*User details*/}

        <div className="items-center px-2 max-lg:w-auto">
          <Link to={user ? "/profile" : "/login"} className="flex items-center">
            <span className="hover:underline">
              {user ? user?.name : "Login"}
            </span>
            <img
              className="w-8 h-8 m-1 rounded-full"
              src={user ? `${user?.profileImg}` : "DefaultProfile.png"}
            ></img>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
