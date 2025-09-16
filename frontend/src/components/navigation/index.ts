// Navigation Components
export { default as CompactHeader } from "./CompactHeader";
export { default as LessonNavigationTabs } from "./LessonNavigationTabs";
export { default as LessonSwitcher } from "./LessonSwitcher";
export { default as NavigationBreadcrumb } from "./NavigationBreadcrumb";
export { default as ProgressIndicator } from "./ProgressIndicator";

// Navigation Hooks
export { useNavigationState } from "../../hooks/useNavigationState";
export { useLessonData } from "../../hooks/useLessonData";
export { useHeaderContext } from "../../hooks/useHeaderContext";

// Navigation Types
export * from "../../types/navigation";
