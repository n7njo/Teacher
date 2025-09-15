import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import axios from "axios";
import LessonPage from "../pages/LessonPage";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock lesson data
const mockLesson = {
  id: "1",
  name: "Test Lesson",
  description: "A test lesson description",
  content: {
    html: "<h1>Test Content</h1><p>This is test content.</p>",
  },
  estimated_duration_minutes: 30,
  lesson_type: "interactive",
};

const renderLessonPage = (lessonId = "1") => {
  return render(
    <MemoryRouter initialEntries={[`/lesson/${lessonId}`]}>
      <LessonPage />
    </MemoryRouter>,
  );
};

describe("LessonPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderLessonPage();

    expect(screen.getByText("Loading lesson...")).toBeInTheDocument();
  });

  test("renders lesson content after successful API call", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: mockLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    expect(screen.getByText("A test lesson description")).toBeInTheDocument();
    expect(screen.getByText("Type:")).toBeInTheDocument();
    expect(screen.getByText("interactive")).toBeInTheDocument();
    expect(screen.getByText("Duration:")).toBeInTheDocument();
    expect(screen.getByText("~30 minutes")).toBeInTheDocument();
  });

  test("renders error state when API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    renderLessonPage();

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load lesson. Please try again later."),
      ).toBeInTheDocument();
    });
  });

  test("renders lesson not found when lesson is null", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: null,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Lesson not found")).toBeInTheDocument();
    });
  });

  test("renders HTML content correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: mockLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    // Check if HTML content is rendered
    const contentDiv = screen.getByText("Test Content").closest("div");
    expect(contentDiv).toHaveTextContent("Test Content");
    expect(contentDiv).toHaveTextContent("This is test content.");
  });

  test("renders markdown content correctly", async () => {
    const markdownLesson = {
      ...mockLesson,
      content: {
        markdown:
          "# Markdown Title\n\nThis is **bold** text with *italic* and `code`.",
      },
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: markdownLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    // The markdown should be converted to HTML
    expect(screen.getByText("Markdown Title")).toBeInTheDocument();
  });

  test("renders string content as HTML", async () => {
    const stringLesson = {
      ...mockLesson,
      content: "<h2>String Content</h2><p>Direct HTML string</p>",
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: stringLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    expect(screen.getByText("String Content")).toBeInTheDocument();
    expect(screen.getByText("Direct HTML string")).toBeInTheDocument();
  });

  test("renders JSON fallback for unknown content format", async () => {
    const jsonLesson = {
      ...mockLesson,
      content: { unknown: "format", data: [1, 2, 3] },
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: jsonLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    // Should render as JSON
    expect(screen.getByText(/"unknown": "format"/)).toBeInTheDocument();
  });

  test("includes breadcrumb navigation", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: mockLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Lesson")).toBeInTheDocument();
    expect(screen.getByText("›")).toBeInTheDocument();
  });

  test("includes back to home button", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: mockLesson,
    });

    renderLessonPage();

    await waitFor(() => {
      expect(screen.getByText("Test Lesson")).toBeInTheDocument();
    });

    expect(screen.getByText("← Back to Home")).toBeInTheDocument();
  });

  test("calls API with correct lesson ID", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: mockLesson,
    });

    renderLessonPage("123");

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/lessons/123");
    });
  });

  test("does not call API when lesson ID is missing", async () => {
    render(
      <MemoryRouter initialEntries={["/lesson/"]}>
        <LessonPage />
      </MemoryRouter>,
    );

    // Wait a bit to ensure no API call is made
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
