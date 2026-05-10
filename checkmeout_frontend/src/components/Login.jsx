import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import shareVideo from "../assets/share.mp4";
import { client } from "../client";

const LoginContent = () => {
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleSuccess = (credentialResponse) => {
    console.log("Google Login Success");
    const decoded = decodeJWT(credentialResponse.credential);

    if (!decoded) {
      console.error("Failed to decode user data");
      return;
    }

    const { sub, name, email, picture } = decoded;
    console.log("Decoded user:", { sub, name, email, picture });

    const userDoc = {
      _id: sub,
      _type: "user",
      userName: name,
      email: email,
      image: picture,
    };

    localStorage.setItem("user", JSON.stringify(userDoc));

    client
      .createIfNotExists(userDoc)
      .then((result) => {
        console.log("User created/exists in Sanity:", result);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Error creating user document:", error);
        navigate("/", { replace: true });
      });
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <div className="p-5">
          <img src={logo} width="130px" alt="logo" />
        </div>
        <div className="shadow-2xl">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const clientId = import.meta.env.VITE_GOOGLE_API_TOKEN;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;
