import googleLogo from "../assests/google.png";
import { auth, googleProvider } from "../utils/firebase";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { loginFailed } from "../redux/authSlice";

const Login = () => {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const loginHandler = () => {
    setDisabled(true);
    auth
      .signInWithPopup(googleProvider)
      .then((result) => {})
      .catch((err) => {
        console.log(err);
        dispatch(loginFailed(err));
        setDisabled(false);
      });
  };
  return (
    <div className="h-screen w-screen flex bg-background justify-center items-center text-white">
      <button
        className=" flex bg-white text-black items-stretch divide-x cursor-pointer group disabled:opacity-50"
        disabled={disabled}
        onClick={loginHandler}
      >
        <img
          src={googleLogo}
          alt=""
          className="w-8 h-8 self-center group-hover:animate-bounce mx-1"
        />
        <div className="pl-2 bg-blue flex items-center p-2 group-hover:bg-white group-hover:font-bold">
          Sign In with Google
        </div>
      </button>
    </div>
  );
};

export default Login;
