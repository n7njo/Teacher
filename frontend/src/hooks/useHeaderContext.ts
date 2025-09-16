import { useMemo, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  HeaderMode,
  BreadcrumbItem,
  QuickAction,
  UseHeaderContextReturn,
  NavigationState,
} from "../types/navigation";

// Quick action definitions
const createQuickActions = (
  headerMode: HeaderMode,
  currentLessonId?: string,
): QuickAction[] => {
  const baseActions: QuickAction[] = [
    {
      id: "search",
      label: "Search",
      icon: "🔍",
      action: () => {
        // Would trigger search modal or focus search input
        const searchInput = document.querySelector(
          "[data-search-input]",
        ) as HTMLInputElement;
        searchInput?.focus();
      },
      visible: true,
      tooltip: "Search lessons (Ctrl+K)",
      shortcut: "Ctrl+K",
    },
    {
      id: "bookmark",
      label: "Bookmark",
      icon: "🔖",
      action: () => {
        // Would bookmark current lesson
        if (currentLessonId) {
          const bookmarks = JSON.parse(
            localStorage.getItem("skillforge_bookmarks") || "[]",
          );
          if (!bookmarks.includes(currentLessonId)) {
            bookmarks.push(currentLessonId);
            localStorage.setItem(
              "skillforge_bookmarks",
              JSON.stringify(bookmarks),
            );
          }
        }
      },
      visible: headerMode === "lesson" && !!currentLessonId,
      tooltip: "Bookmark this lesson",
    },
    {
      id: "share",
      label: "Share",
      icon: "📤",
      action: () => {
        // Would share current lesson
        if (navigator.share && currentLessonId) {
          navigator.share({
            title: "SkillForge Lesson",
            url: window.location.href,
          });
        } else {
          // Fallback to clipboard
          navigator.clipboard?.writeText(window.location.href);
        }
      },
      visible: headerMode === "lesson" && !!currentLessonId,
      tooltip: "Share this lesson",
    },
    {
      id: "notes",
      label: "Notes",
      icon: "📝",
      action: () => {
        // Would open notes modal or sidebar
        console.log("Open notes for lesson:", currentLessonId);
      },
      visible: headerMode === "lesson" && !!currentLessonId,
      tooltip: "Take notes",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      action: () => {
        // Would open settings modal
        console.log("Open settings");
      },
      visible: true,
      tooltip: "Settings",
    },
  ];

  return baseActions.filter((action) => action.visible);
};

// Generate breadcrumb items based on current location
const generateBreadcrumbs = (
  pathname: string,
  navigationState: NavigationState,
): BreadcrumbItem[] => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home
  breadcrumbs.push({
    label: "Home",
    path: "/",
    icon: "🏠",
    isActive: segments.length === 0,
    isClickable: true,
  });

  if (segments.length === 0) {
    return breadcrumbs;
  }

  // Handle different route patterns
  if (segments[0] === "lesson" && segments[1]) {
    // Lesson page: Home > Category > Lesson
    const lesson = navigationState.currentLesson;

    if (lesson) {
      // Add category if available
      if (lesson.category && lesson.categorySlug) {
        breadcrumbs.push({
          label: lesson.category,
          path: `/category/${lesson.categorySlug}`,
          icon: "📁",
          isActive: false,
          isClickable: true,
        });
      }

      // Add lesson
      breadcrumbs.push({
        label: lesson.name,
        path: `/lesson/${lesson.id}`,
        isActive: true,
        isClickable: false,
      });
    } else {
      // Fallback if lesson data not loaded
      breadcrumbs.push({
        label: "Lesson",
        path: pathname,
        isActive: true,
        isClickable: false,
      });
    }
  } else if (segments[0] === "category" && segments[1]) {
    // Category page: Home > Category
    const categorySlug = segments[1];
    const category = navigationState.categoryGroups.find(
      (cat) => cat.slug === categorySlug,
    );

    breadcrumbs.push({
      label: category?.name || "Category",
      path: `/category/${categorySlug}`,
      icon: "📁",
      isActive: segments.length === 2,
      isClickable: segments.length > 2,
    });

    // Handle topic level
    if (segments[2] === "topic" && segments[3]) {
      breadcrumbs.push({
        label: "Topic",
        path: `/category/${categorySlug}/topic/${segments[3]}`,
        icon: "📋",
        isActive: true,
        isClickable: false,
      });
    }
  }

  return breadcrumbs;
};

// Determine if lesson tabs should be shown
const shouldShowLessonTabs = (
  headerMode: HeaderMode,
  currentLesson: any,
): boolean => {
  return (
    headerMode === "lesson" &&
    currentLesson &&
    currentLesson.type === "modular" &&
    currentLesson.sections
  );
};

// Custom hook for header context management
export const useHeaderContext = (
  navigationState: NavigationState,
): UseHeaderContextReturn => {
  const location = useLocation();
  const params = useParams();

  // Determine header mode based on current route
  const headerMode = useMemo((): HeaderMode => {
    const pathname = location.pathname;

    if (pathname === "/") return "home";
    if (pathname.startsWith("/lesson/")) return "lesson";
    if (pathname.startsWith("/category/")) {
      if (pathname.includes("/topic/")) return "topic";
      return "category";
    }

    return "home";
  }, [location.pathname]);

  // Generate breadcrumb items
  const breadcrumbItems = useMemo(() => {
    return generateBreadcrumbs(location.pathname, navigationState);
  }, [location.pathname, navigationState]);

  // Generate quick actions
  const quickActions = useMemo(() => {
    return createQuickActions(headerMode, navigationState.currentLesson?.id);
  }, [headerMode, navigationState.currentLesson?.id]);

  // Determine if lesson tabs should be visible
  const showLessonTabs = useMemo(() => {
    return shouldShowLessonTabs(headerMode, navigationState.currentLesson);
  }, [headerMode, navigationState.currentLesson]);

  // Determine if progress indicator should be visible
  const showProgressIndicator = useMemo(() => {
    return (
      headerMode === "lesson" &&
      navigationState.currentLesson &&
      navigationState.lessonProgress &&
      navigationState.showProgressIndicators
    );
  }, [
    headerMode,
    navigationState.currentLesson,
    navigationState.lessonProgress,
    navigationState.showProgressIndicators,
  ]);

  // Determine if compact layout should be used
  const isCompactLayout = useMemo(() => {
    return navigationState.isCompactMode || window.innerWidth < 768;
  }, [navigationState.isCompactMode]);

  // Update context when mode or data changes
  const updateContext = useCallback((mode: HeaderMode, data?: any) => {
    // This would typically update the navigation state
    // For now, we'll just log the change
    console.log("Header context update:", { mode, data });
  }, []);

  // Listen for window resize to update compact layout
  useMemo(() => {
    const handleResize = () => {
      // This would trigger a state update
      // For now, we'll just check the window size
      const isCompact = window.innerWidth < 768;
      if (isCompact !== isCompactLayout) {
        // Would trigger updateContext or state update
        console.log("Layout mode changed:", isCompact ? "compact" : "full");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isCompactLayout]);

  return {
    headerMode,
    breadcrumbItems,
    quickActions,
    showLessonTabs,
    showProgressIndicator: showProgressIndicator ?? false,
    isCompactLayout,
    updateContext,
  };
};
