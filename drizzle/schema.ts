import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  username: varchar("username", { length: 100 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: text("name"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "manager"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Evaluation categories (基本スキル, マインド, テクニカルスキル)
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  displayOrder: int("displayOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Evaluation items (45 items total)
 */
export const evaluationItems = mysqlTable("evaluationItems", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  level5Description: text("level5Description").notNull(),
  level4Description: text("level4Description").notNull(),
  level3Description: text("level3Description").notNull(),
  level2Description: text("level2Description").notNull(),
  level1Description: text("level1Description").notNull(),
  displayOrder: int("displayOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EvaluationItem = typeof evaluationItems.$inferSelect;
export type InsertEvaluationItem = typeof evaluationItems.$inferInsert;

/**
 * Evaluations (self-evaluation and manager evaluation)
 */
export const evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  evaluatorId: int("evaluatorId"),
  evaluationType: mysqlEnum("evaluationType", ["self", "manager"]).notNull(),
  evaluationPeriod: varchar("evaluationPeriod", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["draft", "submitted", "completed"]).default("draft").notNull(),
  isLocked: int("isLocked").default(0).notNull(), // 0: unlocked, 1: locked
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Evaluation scores (individual item scores)
 */
export const evaluationScores = mysqlTable("evaluationScores", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  itemId: int("itemId").notNull(),
  score: int("score").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationScore = typeof evaluationScores.$inferSelect;
export type InsertEvaluationScore = typeof evaluationScores.$inferInsert;

/**
 * Roadmaps (個人ロードマップ)
 */
export const roadmaps = mysqlTable("roadmaps", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  evaluationPeriod: varchar("evaluationPeriod", { length: 50 }).notNull(),
  longTermVision: text("longTermVision").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Roadmap = typeof roadmaps.$inferSelect;
export type InsertRoadmap = typeof roadmaps.$inferInsert;

/**
 * Roadmap steps (STEP1, STEP2, STEP3...)
 */
export const roadmapSteps = mysqlTable("roadmapSteps", {
  id: int("id").autoincrement().primaryKey(),
  roadmapId: int("roadmapId").notNull(),
  stepNumber: int("stepNumber").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  deadline: varchar("deadline", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RoadmapStep = typeof roadmapSteps.$inferSelect;
export type InsertRoadmapStep = typeof roadmapSteps.$inferInsert;

/**
 * Roadmap goals (定量目標)
 */
export const roadmapGoals = mysqlTable("roadmapGoals", {
  id: int("id").autoincrement().primaryKey(),
  roadmapId: int("roadmapId").notNull(),
  stepId: int("stepId"), // NULL = long term vision goal
  goalText: text("goalText").notNull(),
  isCompleted: int("isCompleted").default(0).notNull(),
  displayOrder: int("displayOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RoadmapGoal = typeof roadmapGoals.$inferSelect;
export type InsertRoadmapGoal = typeof roadmapGoals.$inferInsert;

/**
 * Activity logs for dashboard
 */
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  activityType: mysqlEnum("activityType", [
    "self_evaluation_submitted",
    "manager_evaluation_completed",
    "roadmap_updated",
    "evaluation_period_started",
    "evaluation_period_ended"
  ]).notNull(),
  description: text("description").notNull(),
  evaluationPeriod: varchar("evaluationPeriod", { length: 20 }),
  targetUserId: int("targetUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
