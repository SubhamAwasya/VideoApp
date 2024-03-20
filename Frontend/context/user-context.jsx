import React, { createContext, useEffect, useState } from "react";

const ServerBaseRout = "https://videoapp-dtxd.onrender.com";
const LocalBaseRout = "http://localhost:9999";

const rout = `${ServerBaseRout}/api/auth/login_with_accesstoken`;

// Create a context for the user
export const UserContext = createContext(null);

// Create a provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "",
    email: "",
    videos: "",
    subscribers: "",
    name: "",
    profileImg: "",
    subscribedUsers: "",
  }); // State to hold the user details

  function loginWithAccessToken() {
    fetch(rout, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        // Handle the response from the servers
        if (res.name) {
          logIn(res);
        } else {
          logOut();
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    loginWithAccessToken();
  }, []);

  // Function to simulate user login
  const logIn = (userDetails) => {
    setUser(userDetails);
  };

  // Function to simulate user logout
  const logOut = async () => {
    try {
      await fetch(`${ServerBaseRout}/api/auth/logout`, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          const temp = res.json();
          return temp;
        })
        .then((res) => {
          setUser(null);
        });
    } catch (error) {
      console.log("Error form user-context logout :", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
