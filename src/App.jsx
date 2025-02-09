import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LayoutLoader } from "./components/layout/Loader";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";
import { server } from "./constants/config";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));




const App = () => {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(()=>{
    axios
      .get(`${server}/api/v1/user/profile`,{withCredentials: true})
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists())); 
  }, [dispatch])

  
  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectedRoute user={user} />
            </SocketProvider>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route
            path="/login"
            element={
              <ProtectedRoute user={!user} redirect="/">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
