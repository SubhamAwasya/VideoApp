import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp({ prop }) {
  const rout = "http://localhost:9999/api/auth/signup";
  const [avatar, setavatar] = useState("DefaultProfile.png");
  const [imgFile, setimgFile] = useState(null);

  // use to store disply message
  const [message, setMessage] = useState("");

  const [loadingAnimatino, setLoadingAnimatino] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setimgFile(file);
    setavatar(URL.createObjectURL(file));
  };

  async function formSubmitHandler(e) {
    e.preventDefault();
    setLoadingAnimatino(true);
    setMessage("");

    let formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);
    formData.append("profileImg", imgFile);

    //Sending data to server
    fetch(rout, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setMessage(res.message);
        formData = new FormData();
        setLoadingAnimatino(false);
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch
        setLoadingAnimatino(false);
        setMessage(error);
        formData = new FormData();
        console.log(error);
      });
  }
  return (
    <>
      <form
        id="myForm"
        method="post"
        encType="multipart/form-data"
        className="relative flex-col justify-center text-center items-center w-96 max-sm:w-80 bg-neutral-800 p-8 m-8 rounded-xl"
        onSubmit={(e) => {
          formSubmitHandler(e);
        }}
      >
        <img
          className="rounded-full w-24 h-24 mx-auto"
          id="preview"
          src={avatar}
          alt="Image preview"
        ></img>
        <div>Select a Profile Picture</div>
        <input
          className="mx-auto m-4 bg-orange-600 opacity-0 w-24 h-24 absolute left-36 top-4 max-sm:left-28"
          onChange={(e) => {
            //load image and set it to circle
            handleImageChange(e);
          }}
          type="file"
          id="profileImg"
          name="profileImg"
          accept="image/*"
          required
        ></input>
        <input
          className="w-11/12 p-2 m-1 mt-4 rounded-md"
          placeholder="Username"
          type="text"
          id="name"
          name="name"
          required
        ></input>
        <input
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Email"
          type="email"
          id="email"
          name="email"
          required
        ></input>
        <input
          className="w-11/12 p-2 m-1 rounded-md"
          placeholder="Password"
          type="password"
          id="password"
          name="password"
          autoComplete=""
          required
        ></input>
        <div className="flex flex-col items-center form-group_buttons">
          {/*Sign Up Button*/}
          {!loadingAnimatino ? (
            <button
              className="bg-transparent hover:bg-neutral-700 border-2 border-neutral-500 hover:border-neutral-300 p-2 w-32 m-4 rounded-md"
              type="submit"
              id="submit"
            >
              SignUp
            </button>
          ) : (
            ""
          )}
          {!loadingAnimatino ? (
            <span className="opacity-60">
              Already have account&nbsp;
              <Link to={"/login"}>
                <span className="text-blue-500 underline opacity-100">
                  Login
                </span>
              </Link>
            </span>
          ) : (
            ""
          )}
          {/*Waiting response message*/}
          {!loadingAnimatino || (
            <div className="mt-[3rem] loader text-5xl">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
          {/*Message recived from server*/}
          {message ? <div className="mt-4">{message}</div> : ""}
        </div>
      </form>
    </>
  );
}

export default SignUp;
