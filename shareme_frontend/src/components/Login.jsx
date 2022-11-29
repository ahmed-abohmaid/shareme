import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVedio from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { client } from "../Client";
import { gapi } from "gapi-script";

const Login = () => {
  const navigate = useNavigate();

  // To fix google login err.
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
        scope: "email",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start item-center h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVedio}
          type="video/mp4"
          loop
          autoPlay
          muted
          controls={false}
          className="w-full h-full object-cover"
        />

        <div className="absolute flex justify-center items-center flex-col top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="150px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor cursor-pointer flex items-center justify-center p-3 rounded-lg outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiesPolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
