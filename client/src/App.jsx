import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  SignIn,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import "./App.css";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUsPage from "./Pages/ContactUsPage";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import MyLearningPage from "./Pages/MyLearningPage";
import ResumePage from "./Pages/ResumePage";
import RoadmapPage from "./Pages/RoadmapPage";
import ResourcesPage from "./Pages/ResourcesPage";
import CommunityForum from "./Pages/CommunityPage";
import JobPage from "./Pages/JobPage";
import DailyQuiz from "./Pages/DailyQuiz";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        if (!isLoaded || !isSignedIn) return;
        const userId = user.id;
        const existingGoal = Cookies.get("goal");
        const hasGoal = Cookies.get("hasGoal");

        if (existingGoal && hasGoal === "true") {
          console.log("Goal already in cookie, skipping API call.");
          return;
        }
        const res = await axios.get(
          `http://localhost:5000/api/home/get-roadmap?userId=${userId}`
        );

        if (res.data?.role) {
          Cookies.set("goal", res.data.role, { expires: 3650 });
          Cookies.set("hasGoal", "true", { expires: 3650 });
        }
      } catch (err) {
        console.error("Failed to fetch roadmap:");
      }
    };
    fetchRoadmap();
  }, [isLoaded, isSignedIn, user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate-roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <CommunityForum/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-learning/daiy-quiz"
            element={
              <ProtectedRoute>
                <DailyQuiz/>
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route
            path="/sign-in/*"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />
              </div>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  afterSignUpUrl="/dashboard"
                  redirectUrl="/dashboard"
                />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2998}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
