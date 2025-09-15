import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import TopicPage from "./pages/TopicPage";
import LessonPage from "./pages/LessonPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route
            path="/category/:categorySlug/topic/:topicSlug"
            element={<TopicPage />}
          />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
