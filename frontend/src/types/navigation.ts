/**
 * Type definitions for the compact header navigation system
 */

// Core navigation state types
export type HeaderMode = "home" | "lesson" | "category" | "topic";
export type CompletionStatus = "not-started" | "in-progress" | "completed";
export type SectionType =
  | "introduction"
  | "content"
  | "practice"
  | "assessment"
  | "closure";

// Lesson metadata interface
export interface LessonMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  topic?: string;
  topicSlug?: string;
  estimatedDuration: number;
  completionStatus: CompletionStatus;
  lastSection?: SectionType;
  lastAccessedAt?: Date;
  progressPercentage: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  type: "modular" | "legacy";
}

// Enhanced content block interface for navigation
export interface NavigationContentBlock {
  id: string;
  title: string;
  type: string;
  estimatedTimeMinutes: number;
  completed: boolean;
  required: boolean;
  order: number;
}

// Section interface with navigation data
export interface NavigationSection {
  name: SectionType;
  displayName: string;
  blocks: NavigationContentBlock[];
  completed: boolean;
  totalTimeMinutes: number;
  completedTimeMinutes: number;
  icon: string;
  order: number;
}

// Lesson progress tracking
export interface LessonProgress {
  lessonId: string;
  totalSections: number;
  completedSections: number;
  totalBlocks: number;
  completedBlocks: number;
  currentSection: SectionType;
  currentBlockId?: string;
  progressPercentage: number;
  timeSpentMinutes: number;
  estimatedTimeRemaining: number;
  lastUpdated: Date;
}

// Category grouping for lesson switcher
export interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  icon: string;
  lessons: LessonMetadata[];
  completedLessons: number;
  totalLessons: number;
}

// Navigation state interface
export interface NavigationState {
  // Current context
  currentLesson: LessonMetadata | null;
  currentSection: SectionType;
  currentBlockId: string | null;
  headerMode: HeaderMode;

  // Available data
  availableLessons: LessonMetadata[];
  categoryGroups: CategoryGroup[];
  recentLessons: LessonMetadata[];

  // Progress tracking
  lessonProgress: LessonProgress | null;

  // UI state
  isCompactMode: boolean;
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string | null;

  // Preferences
  showProgressIndicators: boolean;
  autoSaveProgress: boolean;
  preferredTabView: "icons" | "text" | "both";
}

// Context breadcrumb item
export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
  isActive: boolean;
  isClickable: boolean;
}

// Lesson switcher filter options
export interface LessonFilterOptions {
  category?: string;
  status?: CompletionStatus[];
  difficulty?: ("beginner" | "intermediate" | "advanced")[];
  searchQuery?: string;
  sortBy?: "name" | "progress" | "recent" | "duration";
  sortOrder?: "asc" | "desc";
}

// Quick action definitions
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  visible: boolean;
  tooltip?: string;
  shortcut?: string;
}

// Component prop interfaces
export interface CompactHeaderProps {
  navigationState: NavigationState;
  onLessonSwitch: (lessonId: string) => void;
  onSectionChange: (section: SectionType) => void;
  onModeToggle: () => void;
  onSearchChange: (query: string) => void;
  onPreferenceChange: (key: keyof NavigationState, value: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface LessonNavigationTabsProps {
  sections: NavigationSection[];
  currentSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  progress: LessonProgress | null;
  compact?: boolean;
  showIcons?: boolean;
  showProgress?: boolean;
  maxVisibleTabs?: number;
  className?: string;
}

export interface LessonSwitcherProps {
  currentLesson: LessonMetadata | null;
  availableLessons: LessonMetadata[];
  categoryGroups: CategoryGroup[];
  recentLessons: LessonMetadata[];
  onLessonSelect: (lessonId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  searchEnabled?: boolean;
  filterOptions?: LessonFilterOptions;
  onFilterChange?: (options: LessonFilterOptions) => void;
  maxRecentLessons?: number;
  className?: string;
}

export interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  showIcons?: boolean;
  separator?: string;
  className?: string;
}

export interface ProgressIndicatorProps {
  progress: LessonProgress;
  variant?: "bar" | "circle" | "compact" | "detailed";
  showPercentage?: boolean;
  showTimeRemaining?: boolean;
  showSectionBreakdown?: boolean;
  size?: "small" | "medium" | "large";
  animated?: boolean;
  className?: string;
}

// Hook return types
export interface UseNavigationStateReturn {
  navigationState: NavigationState;
  updateNavigationState: (updates: Partial<NavigationState>) => void;
  setCurrentLesson: (lesson: LessonMetadata | null) => void;
  setCurrentSection: (section: SectionType) => void;
  updateProgress: (progress: Partial<LessonProgress>) => void;
  resetNavigation: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface UseLessonDataReturn {
  lessons: LessonMetadata[];
  categories: CategoryGroup[];
  recentLessons: LessonMetadata[];
  getLessonById: (id: string) => LessonMetadata | undefined;
  getLessonsByCategory: (categoryId: string) => LessonMetadata[];
  searchLessons: (query: string) => LessonMetadata[];
  filterLessons: (options: LessonFilterOptions) => LessonMetadata[];
  refreshLessons: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface UseHeaderContextReturn {
  headerMode: HeaderMode;
  breadcrumbItems: BreadcrumbItem[];
  quickActions: QuickAction[];
  showLessonTabs: boolean;
  showProgressIndicator: boolean;
  isCompactLayout: boolean;
  updateContext: (mode: HeaderMode, data?: any) => void;
}

// Event handlers
export interface NavigationEventHandlers {
  onLessonSwitch: (lessonId: string, section?: SectionType) => void;
  onSectionChange: (section: SectionType) => void;
  onProgressUpdate: (progress: Partial<LessonProgress>) => void;
  onModeChange: (mode: HeaderMode) => void;
  onSearch: (query: string) => void;
  onFilter: (options: LessonFilterOptions) => void;
  onQuickAction: (actionId: string) => void;
  onBreadcrumbClick: (path: string) => void;
}

// Configuration interfaces
export interface NavigationConfig {
  maxRecentLessons: number;
  maxVisibleTabs: number;
  autoSaveInterval: number;
  defaultTabView: "icons" | "text" | "both";
  enableSearch: boolean;
  enableFiltering: boolean;
  enableQuickActions: boolean;
  compactModeBreakpoint: number;
  animationsEnabled: boolean;
}

// API response types
export interface LessonListResponse {
  lessons: LessonMetadata[];
  categories: CategoryGroup[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ProgressUpdateRequest {
  lessonId: string;
  sectionId: SectionType;
  blockId?: string;
  timeSpent: number;
  completed: boolean;
  timestamp: Date;
}

export interface ProgressUpdateResponse {
  success: boolean;
  progress: LessonProgress;
  achievements?: string[];
  nextRecommendations?: LessonMetadata[];
}

// Error types
export class NavigationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any,
  ) {
    super(message);
    this.name = "NavigationError";
  }
}

// Utility types
export type NavigationActionType =
  | "SET_CURRENT_LESSON"
  | "SET_CURRENT_SECTION"
  | "UPDATE_PROGRESS"
  | "SET_MODE"
  | "UPDATE_PREFERENCES"
  | "RESET_STATE"
  | "SET_LOADING"
  | "SET_ERROR";

export interface NavigationAction {
  type: NavigationActionType;
  payload?: any;
}

// Default values and constants
export const DEFAULT_NAVIGATION_STATE: NavigationState = {
  currentLesson: null,
  currentSection: "introduction",
  currentBlockId: null,
  headerMode: "home",
  availableLessons: [],
  categoryGroups: [],
  recentLessons: [],
  lessonProgress: null,
  isCompactMode: false,
  sidebarOpen: false,
  searchQuery: "",
  selectedCategory: null,
  showProgressIndicators: true,
  autoSaveProgress: true,
  preferredTabView: "both",
};

export const SECTION_ICONS: Record<SectionType, string> = {
  introduction: "🚀",
  content: "📚",
  practice: "🔧",
  assessment: "📝",
  closure: "✨",
};

export const SECTION_DISPLAY_NAMES: Record<SectionType, string> = {
  introduction: "Introduction",
  content: "Content",
  practice: "Practice",
  assessment: "Assessment",
  closure: "Closure",
};
