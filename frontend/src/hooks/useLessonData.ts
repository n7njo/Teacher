import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  LessonMetadata,
  CategoryGroup,
  LessonFilterOptions,
  CompletionStatus,
  UseLessonDataReturn,
} from "../types/navigation";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Memory cache for lesson data
const cache = new Map<string, CacheEntry<any>>();

// Cache utility functions
const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Transform API lesson data to navigation metadata
const transformLessonData = (apiLesson: any): LessonMetadata => {
  // Handle both modular and legacy lesson formats
  const isModular = apiLesson.type === "modular";

  return {
    id: apiLesson.id,
    name: apiLesson.name,
    description: apiLesson.description || "",
    category: apiLesson.category || "General",
    categorySlug: apiLesson.categorySlug || "general",
    topic: apiLesson.topic,
    topicSlug: apiLesson.topicSlug,
    estimatedDuration: isModular
      ? apiLesson.estimatedDurationMinutes
      : apiLesson.estimated_duration_minutes || 0,
    completionStatus: calculateCompletionStatus(apiLesson),
    lastSection: apiLesson.lastSection || "introduction",
    lastAccessedAt: apiLesson.lastAccessedAt
      ? new Date(apiLesson.lastAccessedAt)
      : undefined,
    progressPercentage: calculateProgressPercentage(apiLesson),
    difficulty: apiLesson.difficulty || "beginner",
    tags: apiLesson.tags || [],
    type: isModular ? "modular" : "legacy",
  };
};

// Calculate completion status based on lesson data
const calculateCompletionStatus = (lesson: any): CompletionStatus => {
  if (lesson.completionStatus) {
    return lesson.completionStatus;
  }

  // Calculate based on section completion for modular lessons
  if (lesson.type === "modular" && lesson.sections) {
    const sections = Object.values(lesson.sections) as any[];
    const totalBlocks = sections.reduce(
      (total, section) => total + section.length,
      0,
    );
    const completedBlocks = sections.reduce(
      (total, section) =>
        total + section.filter((block: any) => block.completed).length,
      0,
    );

    if (completedBlocks === 0) return "not-started";
    if (completedBlocks === totalBlocks) return "completed";
    return "in-progress";
  }

  return "not-started";
};

// Calculate progress percentage
const calculateProgressPercentage = (lesson: any): number => {
  if (lesson.progressPercentage !== undefined) {
    return lesson.progressPercentage;
  }

  if (lesson.type === "modular" && lesson.sections) {
    const sections = Object.values(lesson.sections) as any[];
    const totalBlocks = sections.reduce(
      (total, section) => total + section.length,
      0,
    );
    const completedBlocks = sections.reduce(
      (total, section) =>
        total + section.filter((block: any) => block.completed).length,
      0,
    );

    return totalBlocks > 0
      ? Math.round((completedBlocks / totalBlocks) * 100)
      : 0;
  }

  return 0;
};

// Group lessons by category
const groupLessonsByCategory = (lessons: LessonMetadata[]): CategoryGroup[] => {
  const categoryMap = new Map<string, CategoryGroup>();

  lessons.forEach((lesson) => {
    const categoryId =
      lesson.categorySlug || lesson.category.toLowerCase().replace(/\s+/g, "-");

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: lesson.category,
        slug: lesson.categorySlug || categoryId,
        icon: getCategoryIcon(lesson.category),
        lessons: [],
        completedLessons: 0,
        totalLessons: 0,
      });
    }

    const category = categoryMap.get(categoryId)!;
    category.lessons.push(lesson);
    category.totalLessons++;

    if (lesson.completionStatus === "completed") {
      category.completedLessons++;
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

// Get category icon based on category name
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    "using-ai": "🤖",
    ai: "🤖",
    programming: "💻",
    "web-development": "🌐",
    "data-science": "📊",
    design: "🎨",
    business: "💼",
    marketing: "📈",
    general: "📚",
  };

  const key = categoryName.toLowerCase().replace(/\s+/g, "-");
  return iconMap[key] || "📚";
};

// Custom hook for lesson data management
export const useLessonData = (): UseLessonDataReturn => {
  const [lessons, setLessons] = useState<LessonMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lessons from API
  const fetchLessons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedLessons = getCachedData<LessonMetadata[]>("lessons");
      if (cachedLessons) {
        setLessons(cachedLessons);
        setIsLoading(false);
        return;
      }

      // Fetch from multiple endpoints to get all lesson types
      const [categoriesResponse, modularResponse] = await Promise.allSettled([
        axios.get("/api/categories"),
        axios.get("/api/lessons"),
      ]);

      const allLessons: LessonMetadata[] = [];

      // Process category-based lessons
      if (categoriesResponse.status === "fulfilled") {
        const categories = categoriesResponse.value.data;
        for (const category of categories) {
          try {
            const topicsResponse = await axios.get(
              `/api/categories/${category.slug}/topics`,
            );
            for (const topic of topicsResponse.data) {
              try {
                const lessonsResponse = await axios.get(
                  `/api/categories/${category.slug}/topics/${topic.slug}/lessons`,
                );
                const categoryLessons = lessonsResponse.data.map(
                  (lesson: any) => ({
                    ...lesson,
                    category: category.name,
                    categorySlug: category.slug,
                    topic: topic.name,
                    topicSlug: topic.slug,
                  }),
                );
                allLessons.push(...categoryLessons.map(transformLessonData));
              } catch (err) {
                console.warn(
                  `Failed to fetch lessons for ${category.slug}/${topic.slug}:`,
                  err,
                );
              }
            }
          } catch (err) {
            console.warn(
              `Failed to fetch topics for category ${category.slug}:`,
              err,
            );
          }
        }
      }

      // Process modular lessons
      if (modularResponse.status === "fulfilled") {
        const modularLessons =
          modularResponse.value.data.map(transformLessonData);
        allLessons.push(...modularLessons);
      }

      // Remove duplicates based on ID
      const uniqueLessons = allLessons.filter(
        (lesson, index, array) =>
          array.findIndex((l) => l.id === lesson.id) === index,
      );

      setLessons(uniqueLessons);
      setCachedData("lessons", uniqueLessons);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Failed to load lessons. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Computed category groups
  const categories = useMemo(() => {
    return groupLessonsByCategory(lessons);
  }, [lessons]);

  // Recent lessons (from localStorage)
  const recentLessons = useMemo(() => {
    try {
      const recentLessonIds = JSON.parse(
        localStorage.getItem("skillforge_recent_lessons") || "[]",
      ) as string[];

      return recentLessonIds
        .map((id) => lessons.find((lesson) => lesson.id === id))
        .filter((lesson): lesson is LessonMetadata => lesson !== undefined)
        .slice(0, 5);
    } catch {
      return [];
    }
  }, [lessons]);

  // Get lesson by ID
  const getLessonById = useCallback(
    (id: string): LessonMetadata | undefined => {
      return lessons.find((lesson) => lesson.id === id);
    },
    [lessons],
  );

  // Get lessons by category
  const getLessonsByCategory = useCallback(
    (categoryId: string): LessonMetadata[] => {
      return lessons.filter(
        (lesson) =>
          lesson.categorySlug === categoryId || lesson.category === categoryId,
      );
    },
    [lessons],
  );

  // Search lessons
  const searchLessons = useCallback(
    (query: string): LessonMetadata[] => {
      if (!query.trim()) return lessons;

      const searchTerm = query.toLowerCase();
      return lessons.filter(
        (lesson) =>
          lesson.name.toLowerCase().includes(searchTerm) ||
          lesson.description.toLowerCase().includes(searchTerm) ||
          lesson.category.toLowerCase().includes(searchTerm) ||
          lesson.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    },
    [lessons],
  );

  // Filter lessons
  const filterLessons = useCallback(
    (options: LessonFilterOptions): LessonMetadata[] => {
      let filteredLessons = lessons;

      // Category filter
      if (options.category) {
        filteredLessons = filteredLessons.filter(
          (lesson) =>
            lesson.categorySlug === options.category ||
            lesson.category === options.category,
        );
      }

      // Status filter
      if (options.status && options.status.length > 0) {
        filteredLessons = filteredLessons.filter((lesson) =>
          options.status!.includes(lesson.completionStatus),
        );
      }

      // Difficulty filter
      if (options.difficulty && options.difficulty.length > 0) {
        filteredLessons = filteredLessons.filter((lesson) =>
          options.difficulty!.includes(lesson.difficulty),
        );
      }

      // Search query
      if (options.searchQuery) {
        filteredLessons = searchLessons(options.searchQuery);
      }

      // Sort results
      if (options.sortBy) {
        filteredLessons.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (options.sortBy) {
            case "name":
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case "progress":
              aValue = a.progressPercentage;
              bValue = b.progressPercentage;
              break;
            case "recent":
              aValue = a.lastAccessedAt?.getTime() || 0;
              bValue = b.lastAccessedAt?.getTime() || 0;
              break;
            case "duration":
              aValue = a.estimatedDuration;
              bValue = b.estimatedDuration;
              break;
            default:
              return 0;
          }

          const order = options.sortOrder === "desc" ? -1 : 1;
          return aValue < bValue ? -order : aValue > bValue ? order : 0;
        });
      }

      return filteredLessons;
    },
    [lessons, searchLessons],
  );

  // Refresh lessons data
  const refreshLessons = useCallback(async () => {
    // Clear cache and refetch
    cache.delete("lessons");
    await fetchLessons();
  }, [fetchLessons]);

  return {
    lessons,
    categories,
    recentLessons,
    getLessonById,
    getLessonsByCategory,
    searchLessons,
    filterLessons,
    refreshLessons,
    isLoading,
    error,
  };
};
