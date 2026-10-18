import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { CBTSidebar } from "./pages/SideBar/CBTSidebar";
import { DashboardHome } from "./pages/Dashboard/DashboardHome";
import { SubjectsPage } from "./pages/Subjects/SubjectsPage";
import { ResultsPage } from "./pages/Results/ResultsPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { ExamPage } from "./pages/Exam/ExamPage";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";
import { Home } from "./Home.jsx";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Student pages: only for logged-in users */}
          <Route element={<ProtectedRoute />}>

            {/* Dashboard layout (sidebar + navbar) */}
            <Route path="/dashboard" element={<CBTSidebar />}>
              <Route index element={<DashboardHome />} />
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Exam screen: full page, no sidebar */}
            <Route path="/exam/:subjectId" element={<ExamPage />} />

          </Route>


          {/* Anything else */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
