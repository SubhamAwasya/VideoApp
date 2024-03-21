import { useState, useContext } from "react";
import { UserContext } from "../../context/user-context.jsx";
import { Link, json } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { baseRout } from "../ConstantData.js";

function Login() {
  const rout = `${baseRout}/api/auth/signin`;
  const { user, logIn } = useContext(UserContext);
  // const [isSideBarOpen, setisSideBarOpen] = useState("");
  // this is for UI perpose so user know that Wait for server response
  const [waitingForRes, setWaitingForRes] = useState(false);
  // use to store disply message
  const [message, setMessage] = useState("");

  // Creating navigate object
  const navigate = useNavigate();

  async function formSubmitHandler(e) {
    e.preventDefault();
    setMessage("");
    setWaitingForRes(true);
    fetch(rout, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // Handle the response from the servers
        logIn(res);
        setMessage(res.message);
        return res;
      })
      .then((res) => {
        // After loged in this redirect to home page
        if (res.refreshToken) navigate("/");
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch
        setMessage(error);
        console.error("Error:", error);
      });
    setWaitingForRes(false);
  }
  return (
    <>
      <form
        id="myForm"
        method="post"
        encType="multipart/form-data"
        className="flex flex-col justify-center text-center items-center w-96 max-sm:w-80 bg-neutral-800 p-8 m-8 rounded-xl"
        onSubmit={(e) => {
          formSubmitHandler(e);
        }}
      >
        <h1 className="text-6xl m-10">Login</h1>
        <input
          className="w-11/12 p-4 m-1 rounded-md"
          placeholder="Email"
          type="email"
          id="email"
          name="email"
          required
        ></input>
        <input
          className="w-11/12 p-4 m-1 rounded-md"
          placeholder="password"
          type="password"
          id="password"
          name="password"
          autoComplete=""
          required
        ></input>

        <button
          className="bg-transparent hover:bg-neutral-700 border-2 border-neutral-500 hover:border-neutral-300 p-2 w-32 m-4 rounded-md"
          type="submit"
          id="login"
        >
          Login
        </button>
        <span className="opacity-60">
          No account ? you can &nbsp;
          <Link to={"/signup"}>
            <span className="text-blue-500  underline opacity-100">SigUp</span>
          </Link>
        </span>
        {/*Waiting response message*/}
        {waitingForRes ? (
          <div className="mt-8">waiting For Response...!</div>
        ) : (
          ""
        )}
        {/*Message recived from server*/}
        {message ? <div className="mt-4">{message}</div> : ""}
      </form>
    </>
  );
}

export default Login;
