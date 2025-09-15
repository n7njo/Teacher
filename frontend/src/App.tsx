import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavigationSidebar from "./components/NavigationSidebar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import TopicPage from "./pages/TopicPage";
import LessonPage from "./pages/LessonPage";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonData, setLessonData] = useState<any>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const updateLessonData = (data: any) => {
    setLessonData(data);
  };

  return (
    <div className="App">
      <Header onNavigationToggle={toggleSidebar} showNavigationToggle={true} />

      <NavigationSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        lessonData={lessonData}
      />

      <main
        className="main-content"
        style={{
          transition: "margin-left 0.3s ease",
          position: "relative",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route
            path="/category/:categorySlug/topic/:topicSlug"
            element={<TopicPage />}
          />
          <Route
            path="/lesson/:lessonId"
            element={
              <LessonPage
                onLessonDataLoad={updateLessonData}
                onToggleSidebar={toggleSidebar}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
