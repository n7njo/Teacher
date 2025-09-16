import { useReducer, useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  NavigationState,
  NavigationAction,
  NavigationActionType,
  UseNavigationStateReturn,
  LessonMetadata,
  LessonProgress,
  SectionType,
  HeaderMode,
  DEFAULT_NAVIGATION_STATE,
} from "../types/navigation";

// Navigation state reducer
const navigationReducer = (
  state: NavigationState,
  action: NavigationAction,
): NavigationState => {
  switch (action.type) {
    case "SET_CURRENT_LESSON":
      return {
        ...state,
        currentLesson: action.payload,
        headerMode: action.payload ? "lesson" : "home",
        currentSection: action.payload?.lastSection || "introduction",
      };

    case "SET_CURRENT_SECTION":
      return {
        ...state,
        currentSection: action.payload,
      };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        lessonProgress: action.payload
          ? { ...state.lessonProgress, ...action.payload }
          : null,
      };

    case "SET_MODE":
      return {
        ...state,
        headerMode: action.payload,
      };

    case "UPDATE_PREFERENCES":
      return {
        ...state,
        ...action.payload,
      };

    case "RESET_STATE":
      return {
        ...DEFAULT_NAVIGATION_STATE,
        availableLessons: state.availableLessons,
        categoryGroups: state.categoryGroups,
      };

    case "SET_LOADING":
      return {
        ...state,
        // Loading state would be handled at component level
      };

    case "SET_ERROR":
      return {
        ...state,
        // Error state would be handled at component level
      };

    default:
      return state;
  }
};

// Local storage keys
const STORAGE_KEYS = {
  NAVIGATION_STATE: "skillforge_navigation_state",
  LESSON_PROGRESS: "skillforge_lesson_progress",
  USER_PREFERENCES: "skillforge_user_preferences",
} as const;

// Custom hook for navigation state management
export const useNavigationState = (): UseNavigationStateReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state from localStorage or defaults
  const getInitialState = useCallback((): NavigationState => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEYS.NAVIGATION_STATE);
      const savedPreferences = localStorage.getItem(
        STORAGE_KEYS.USER_PREFERENCES,
      );

      const baseState = savedState
        ? { ...DEFAULT_NAVIGATION_STATE, ...JSON.parse(savedState) }
        : DEFAULT_NAVIGATION_STATE;

      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};

      return {
        ...baseState,
        ...preferences,
        // Reset transient state
        sidebarOpen: false,
        searchQuery: "",
        selectedCategory: null,
      };
    } catch (error) {
      console.error("Error loading navigation state from localStorage:", error);
      return DEFAULT_NAVIGATION_STATE;
    }
  }, []);

  const [state, dispatch] = useReducer(navigationReducer, getInitialState());

  // Persist state to localStorage
  const persistState = useCallback((newState: NavigationState) => {
    try {
      // Persist core navigation state
      const stateToSave = {
        currentLesson: newState.currentLesson,
        currentSection: newState.currentSection,
        headerMode: newState.headerMode,
        recentLessons: newState.recentLessons,
      };
      localStorage.setItem(
        STORAGE_KEYS.NAVIGATION_STATE,
        JSON.stringify(stateToSave),
      );

      // Persist user preferences separately
      const preferences = {
        isCompactMode: newState.isCompactMode,
        showProgressIndicators: newState.showProgressIndicators,
        autoSaveProgress: newState.autoSaveProgress,
        preferredTabView: newState.preferredTabView,
      };
      localStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences),
      );

      // Persist lesson progress
      if (newState.lessonProgress) {
        const progressKey = `${STORAGE_KEYS.LESSON_PROGRESS}_${newState.lessonProgress.lessonId}`;
        localStorage.setItem(
          progressKey,
          JSON.stringify(newState.lessonProgress),
        );
      }
    } catch (error) {
      console.error(
        "Error persisting navigation state to localStorage:",
        error,
      );
    }
  }, []);

  // Update navigation state with persistence
  const updateNavigationState = useCallback(
    (updates: Partial<NavigationState>) => {
      dispatch({
        type: "UPDATE_PREFERENCES",
        payload: updates,
      });
    },
    [],
  );

  // Set current lesson with smart navigation
  const setCurrentLesson = useCallback(
    (lesson: LessonMetadata | null) => {
      dispatch({
        type: "SET_CURRENT_LESSON",
        payload: lesson,
      });

      // Navigate to lesson page if lesson is provided
      if (lesson) {
        const targetPath = `/lesson/${lesson.id}`;
        if (location.pathname !== targetPath) {
          navigate(targetPath);
        }

        // Update recent lessons
        const updatedRecentLessons = [
          lesson,
          ...state.recentLessons.filter((l) => l.id !== lesson.id),
        ].slice(0, 5); // Keep only 5 most recent

        updateNavigationState({ recentLessons: updatedRecentLessons });
      }
    },
    [location.pathname, navigate, state.recentLessons, updateNavigationState],
  );

  // Set current section with validation
  const setCurrentSection = useCallback(
    (section: SectionType) => {
      if (state.currentLesson) {
        dispatch({
          type: "SET_CURRENT_SECTION",
          payload: section,
        });

        // Update lesson's last section
        const updatedLesson = {
          ...state.currentLesson,
          lastSection: section,
          lastAccessedAt: new Date(),
        };

        dispatch({
          type: "SET_CURRENT_LESSON",
          payload: updatedLesson,
        });
      }
    },
    [state.currentLesson],
  );

  // Update lesson progress with auto-save
  const updateProgress = useCallback(
    (progressUpdates: Partial<LessonProgress>) => {
      if (state.lessonProgress) {
        const updatedProgress = {
          ...state.lessonProgress,
          ...progressUpdates,
          lastUpdated: new Date(),
        };

        dispatch({
          type: "UPDATE_PROGRESS",
          payload: updatedProgress,
        });

        // Auto-save progress if enabled
        if (state.autoSaveProgress) {
          // Here you would typically call an API to save progress
          // For now, we'll just persist to localStorage
          const progressKey = `${STORAGE_KEYS.LESSON_PROGRESS}_${updatedProgress.lessonId}`;
          localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
        }
      }
    },
    [state.lessonProgress, state.autoSaveProgress],
  );

  // Reset navigation state
  const resetNavigation = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
    navigate("/");
  }, [navigate]);

  // Sync with URL changes
  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      // Home page
      dispatch({ type: "SET_MODE", payload: "home" });
    } else if (pathSegments[0] === "lesson" && pathSegments[1]) {
      // Lesson page
      dispatch({ type: "SET_MODE", payload: "lesson" });

      // Load lesson progress from localStorage
      const progressKey = `${STORAGE_KEYS.LESSON_PROGRESS}_${pathSegments[1]}`;
      const savedProgress = localStorage.getItem(progressKey);
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          dispatch({ type: "UPDATE_PROGRESS", payload: progress });
        } catch (error) {
          console.error("Error loading lesson progress:", error);
        }
      }
    } else if (pathSegments[0] === "category") {
      // Category page
      dispatch({ type: "SET_MODE", payload: "category" });
    }
  }, [location.pathname]);

  // Persist state changes
  useEffect(() => {
    persistState(state);
  }, [state, persistState]);

  // Computed values
  const isLoading = false; // Would be managed by data fetching hooks
  const error = null; // Would be managed by error handling

  return {
    navigationState: state,
    updateNavigationState,
    setCurrentLesson,
    setCurrentSection,
    updateProgress,
    resetNavigation,
    isLoading,
    error,
  };
};
