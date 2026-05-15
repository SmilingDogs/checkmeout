import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { Link, Route, Routes } from "react-router-dom";
import logo from "../assets/logo.png";
import { client } from "../client";
import { Sidebar, UserProfile } from "../components";
import Pins from "../container/Pins";
import { userQuery } from "../utils/data";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  // Safely retrieve user from localStorage
  const storedUser = localStorage.getItem("user");
  const userInfo = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (userInfo?._id) {
      const query = userQuery(userInfo._id);
      client.fetch(query).then((data) => setUser(data[0]));
    }
  }, [userInfo?._id]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex flex-col bg-gray-50 h-screen">
      {/* Header - visible on all screens */}
      <div className="flex flex-row w-full px-4 py-3 bg-white border-b border-gray-200 justify-between items-center shadow-md">
        <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
        <Link to="/">
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full object-cover" />
        </Link>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-initial bg-white border-r border-gray-200">
          <Sidebar user={user && user} />
        </div>

        {/* Mobile Sidebar Toggle */}
        {toggleSidebar && (
          <div className="fixed w-2/3 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in top-0 left-0">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}

        {/* Content Area */}
        <div className="pb-2 flex-1 overflow-y-scroll" ref={scrollRef}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/*" element={<Pins user={user && user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
