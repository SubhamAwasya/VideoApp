import { useState, useEffect, useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { icons, pages, routes } from "./PagesData.js";
import { UserContext } from "../context/user-context.jsx";
import NavBar from "./components/NavBar.jsx";

const ServerBaseRout = "https://videoapp-dtxd.onrender.com";
const LocalBaseRout = "http://localhost:9999";
const rout = `${ServerBaseRout}/api/users/tokenlogin`;

function App() {
  //user context
  const { user, logIn, logOut } = useContext(UserContext);
  const [isSideBarOpen, setisSideBarOpen] = useState("");
  const [leftMarginForContentPage, setleftMarginForContentPage] =
    useState("ml-52");

  function toggleSideBar() {
    if (window.innerWidth > 1200) {
      setisSideBarOpen("");
      setleftMarginForContentPage("ml-52");
    } else {
      setisSideBarOpen("hidden");
      setleftMarginForContentPage("");
    }
  }
  // nav link render based on user is loged in or not
  function renderNavLinks({ pageName, i }) {
    if (user != null && (pageName === "Login" || pageName === "Signup")) {
      return "";
    }
    return (
      <div key={i}>
        <NavLink
          to={routes[i]}
          className={({ isActive }) =>
            isActive
              ? "bg-red-700  flex items-cente rounded-lg p-1 pl-4 cursor-pointer"
              : "flex items-center hover:bg-neutral-800 rounded-lg p-1 pl-4 cursor-pointer"
          }
          onClick={() => {
            toggleSideBar();
            pageName;
          }}
        >
          <span className="material-symbols-outlined mr-2">{icons[i]}</span>
          {pageName}
        </NavLink>
        {i == 2 || i == 4 ? <hr key={i + 100} className="my-2"></hr> : ""}
      </div>
    );
  }

  // log in with access token
  useEffect(() => {
    toggleSideBar();
  }, []);
  //Side bar hide and show by window resize
  window.addEventListener("resize", function () {
    toggleSideBar();
  });

  return (
    <>
      {/*Navbar///////////////////////////////////////////*/}
      <NavBar
        isSideBarOpen={isSideBarOpen}
        setisSideBarOpen={setisSideBarOpen}
        setleftMarginForContentPage={setleftMarginForContentPage}
      />
      {/*Navbar-------------------------------------------*/}
      <div className="flex">
        {/*Sidebar///////////////////////////////////////////*/}
        <div
          className={`bg-neutral-950 w-52 z-50 h-screen mt-14 p-4 fixed ${isSideBarOpen}`}
        >
          {pages.map((pageName, i) => renderNavLinks({ pageName, i }))}

          {user ? (
            <Link
              to="/login"
              className="flex items-center hover:bg-neutral-800 rounded-lg p-1 pl-4 cursor-pointer"
              onClick={() => {
                toggleSideBar();
                logOut();
              }}
            >
              <span className="material-symbols-outlined mr-2">logout</span>
              {"LogOut"}
            </Link>
          ) : (
            ""
          )}
        </div>

        {/*Sidebar-------------------------------------------*/}
        {/*Content Page ///////////////////////////////////////////*/}

        <div
          className={`${leftMarginForContentPage} w-full mx-auto justify-center mt-14 flex items-center`}
        >
          {<Outlet />}
        </div>

        {/*Content Page -------------------------------------------*/}
      </div>
    </>
  );
}

export default App;
