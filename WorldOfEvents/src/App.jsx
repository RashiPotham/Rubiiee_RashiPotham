import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Discover from "./pages/Discover.jsx";
import SignIn from "./pages/SignIn.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import HostRegistration from "./pages/HostRegistration.jsx";
import Bookings from "./pages/Bookings.jsx";
import Profile from "./pages/Profile.jsx";
import { useAuth } from "./context/AuthContext.jsx";
function Protected({children}){const {user,loading}=useAuth();if(loading)return <div className="loading">Loading your account…</div>;return user?children:<Navigate to="/signin" replace/>;}
export default function App(){return <Routes><Route path="/signin" element={<SignIn/>}/><Route path="*" element={<Layout><Routes><Route path="/" element={<Discover/>}/><Route path="/calendar" element={<CalendarPage/>}/><Route path="/events/:id" element={<EventDetails/>}/><Route path="/host" element={<HostRegistration/>}/><Route path="/profile" element={<Profile/>}/><Route path="/bookings" element={<Protected><Bookings/></Protected>}/></Routes></Layout>}/></Routes>}