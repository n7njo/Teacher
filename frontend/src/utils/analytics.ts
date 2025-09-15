// Analytics utility for tracking user behavior and learning effectiveness

interface LearningEvent {
  type:
    | "lesson_start"
    | "lesson_complete"
    | "lesson_pause"
    | "content_interaction"
    | "feedback_submit";
  lessonId: string;
  userId?: string;
  timestamp: number;
  sessionId: string;
  metadata?: Record<string, any>;
}

interface LearningSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  lessonId: string;
  events: LearningEvent[];
  totalTimeSpent: number;
  completionRate: number;
}

class LearningAnalytics {
  private sessionId: string;
  private currentSession: LearningSession | null = null;
  private events: LearningEvent[] = [];
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = localStorage.getItem("userId") || undefined;

    // Track page visibility changes
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this),
    );

    // Track before page unload
    window.addEventListener("beforeunload", this.handlePageUnload.bind(this));
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleVisibilityChange(): void {
    if (this.currentSession) {
      if (document.hidden) {
        this.trackEvent("lesson_pause", this.currentSession.lessonId);
      } else {
        this.trackEvent("lesson_start", this.currentSession.lessonId, {
          resumed: true,
        });
      }
    }
  }

  private handlePageUnload(): void {
    if (this.currentSession) {
      this.endLearningSession();
    }
  }

  startLearningSession(lessonId: string): void {
    if (this.currentSession) {
      this.endLearningSession();
    }

    this.currentSession = {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: Date.now(),
      lessonId,
      events: [],
      totalTimeSpent: 0,
      completionRate: 0,
    };

    this.trackEvent("lesson_start", lessonId);
  }

  endLearningSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.totalTimeSpent =
      this.currentSession.endTime - this.currentSession.startTime;

    this.trackEvent("lesson_complete", this.currentSession.lessonId, {
      totalTimeSpent: this.currentSession.totalTimeSpent,
      completionRate: this.currentSession.completionRate,
    });

    // Send session data to server
    this.sendAnalytics(this.currentSession);

    this.currentSession = null;
  }

  trackEvent(
    type: LearningEvent["type"],
    lessonId: string,
    metadata?: Record<string, any>,
  ): void {
    const event: LearningEvent = {
      type,
      lessonId,
      userId: this.userId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata,
    };

    this.events.push(event);

    if (this.currentSession) {
      this.currentSession.events.push(event);
    }

    // Send real-time events for immediate feedback
    this.sendEvent(event);
  }

  trackContentInteraction(
    lessonId: string,
    contentType: string,
    action: string,
  ): void {
    this.trackEvent("content_interaction", lessonId, {
      contentType,
      action,
      scrollPosition: window.scrollY,
      viewportHeight: window.innerHeight,
      timestamp: Date.now(),
    });
  }

  trackCompletionRate(lessonId: string, percentage: number): void {
    if (this.currentSession) {
      this.currentSession.completionRate = percentage;
    }

    this.trackEvent("lesson_complete", lessonId, {
      completionRate: percentage,
    });
  }

  private async sendEvent(event: LearningEvent): Promise<void> {
    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to send analytics event:", error);
      // Store in localStorage for retry
      this.storeOfflineEvent(event);
    }
  }

  private async sendAnalytics(session: LearningSession): Promise<void> {
    try {
      await fetch("/api/analytics/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.error("Failed to send analytics session:", error);
      // Store in localStorage for retry
      this.storeOfflineSession(session);
    }
  }

  private storeOfflineEvent(event: LearningEvent): void {
    const offlineEvents = JSON.parse(
      localStorage.getItem("offlineAnalyticsEvents") || "[]",
    );
    offlineEvents.push(event);
    localStorage.setItem(
      "offlineAnalyticsEvents",
      JSON.stringify(offlineEvents),
    );
  }

  private storeOfflineSession(session: LearningSession): void {
    const offlineSessions = JSON.parse(
      localStorage.getItem("offlineAnalyticsSessions") || "[]",
    );
    offlineSessions.push(session);
    localStorage.setItem(
      "offlineAnalyticsSessions",
      JSON.stringify(offlineSessions),
    );
  }

  async retryOfflineData(): Promise<void> {
    // Retry offline events
    const offlineEvents = JSON.parse(
      localStorage.getItem("offlineAnalyticsEvents") || "[]",
    );
    for (const event of offlineEvents) {
      try {
        await this.sendEvent(event);
      } catch (error) {
        console.error("Failed to retry offline event:", error);
        return; // Stop retrying if still failing
      }
    }
    localStorage.removeItem("offlineAnalyticsEvents");

    // Retry offline sessions
    const offlineSessions = JSON.parse(
      localStorage.getItem("offlineAnalyticsSessions") || "[]",
    );
    for (const session of offlineSessions) {
      try {
        await this.sendAnalytics(session);
      } catch (error) {
        console.error("Failed to retry offline session:", error);
        return; // Stop retrying if still failing
      }
    }
    localStorage.removeItem("offlineAnalyticsSessions");
  }

  // A/B Testing Support
  getVariant(testName: string): string {
    const storedVariant = localStorage.getItem(`abtest_${testName}`);
    if (storedVariant) {
      return storedVariant;
    }

    // Simple A/B assignment based on user ID hash
    const userIdentifier = this.userId || this.sessionId;
    const hash = this.simpleHash(userIdentifier + testName);
    const variant = hash % 2 === 0 ? "A" : "B";

    localStorage.setItem(`abtest_${testName}`, variant);

    // Track variant assignment
    this.trackEvent("content_interaction", "ab_test", {
      testName,
      variant,
      assignment: true,
    });

    return variant;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Learning effectiveness metrics
  calculateEngagementScore(): number {
    if (!this.currentSession || this.currentSession.events.length === 0) {
      return 0;
    }

    const interactionEvents = this.currentSession.events.filter(
      (e) => e.type === "content_interaction",
    );
    const sessionDuration = Date.now() - this.currentSession.startTime;

    // Calculate engagement based on interactions per minute
    const interactionsPerMinute =
      interactionEvents.length / (sessionDuration / 60000);

    // Normalize to 0-100 scale (assumes 1-5 interactions per minute is good engagement)
    return Math.min(100, (interactionsPerMinute / 3) * 100);
  }

  getSessionMetrics(): any {
    if (!this.currentSession) return null;

    const now = Date.now();
    const sessionDuration = now - this.currentSession.startTime;
    const engagementScore = this.calculateEngagementScore();

    return {
      sessionId: this.currentSession.sessionId,
      lessonId: this.currentSession.lessonId,
      duration: sessionDuration,
      eventCount: this.currentSession.events.length,
      engagementScore,
      completionRate: this.currentSession.completionRate,
    };
  }
}

// Global analytics instance
export const analytics = new LearningAnalytics();

// Helper hooks for React components
export const useAnalytics = () => {
  return {
    startSession: analytics.startLearningSession.bind(analytics),
    endSession: analytics.endLearningSession.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackInteraction: analytics.trackContentInteraction.bind(analytics),
    trackCompletion: analytics.trackCompletionRate.bind(analytics),
    getVariant: analytics.getVariant.bind(analytics),
    getMetrics: analytics.getSessionMetrics.bind(analytics),
  };
};
