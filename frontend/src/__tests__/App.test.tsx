import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

// Mock the components to avoid complex setup
jest.mock("../components/Header", () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock("../pages/Home", () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock("../pages/CategoryPage", () => {
  return function MockCategoryPage() {
    return <div data-testid="category-page">Category Page</div>;
  };
});

jest.mock("../pages/TopicPage", () => {
  return function MockTopicPage() {
    return <div data-testid="topic-page">Topic Page</div>;
  };
});

jest.mock("../pages/LessonPage", () => {
  return function MockLessonPage() {
    return <div data-testid="lesson-page">Lesson Page</div>;
  };
});

const renderApp = (initialEntries = ["/"]) => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
};

describe("App Component", () => {
  test("renders without crashing", () => {
    renderApp();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("renders header component", () => {
    renderApp();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("renders home page by default", () => {
    renderApp();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("has main content area with correct class", () => {
    const { container } = renderApp();
    const mainContent = container.querySelector(".main-content");
    expect(mainContent).toBeInTheDocument();
  });

  test("app has correct root class name", () => {
    const { container } = renderApp();
    const appDiv = container.querySelector(".App");
    expect(appDiv).toBeInTheDocument();
  });
});
