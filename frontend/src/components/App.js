import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";
import Loading from "./Loading";
import Login from "./Login";
import { useSelector, useDispatch } from "react-redux";
import { loginStart, loginFailed } from "../redux/authSlice";
import { sendLogin } from "../redux/socketActions";

import { auth } from "../utils/firebase";

const App = () => {
  const dispatch = useDispatch();
  // * Screen width
  const [screenWidth, setScreenWidth] = useState(null);
  const getScreenWidth = () => {
    return window.innerWidth;
  };
  useEffect(() => {
    setScreenWidth(getScreenWidth());
  }, []);

  // *initial setup for user
  const { user, isLoading } = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    dispatch(loginStart());

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(sendLogin(user));
      } else {
        dispatch(loginFailed(null));
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      {screenWidth && screenWidth < 768 && (
        <div>Please use a larger screen device</div>
      )}

      {screenWidth && screenWidth > 768 && (
        <>
          {isLoading && <Loading />}
          {!isLoading && !user && <Login />}
          {!isLoading && user && (
            <div className="bg-background w-screen h-screen p-4 min-w-app flex justify-center items-center">
              <div className="bg-header w-full h-full rounded-2xl divide-x flex max-w-body">
                <Sidebar />
                <Main />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default App;
