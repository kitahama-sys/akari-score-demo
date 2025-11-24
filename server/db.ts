import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  categories, 
  evaluationItems, 
  evaluations, 
  evaluationScores,
  InsertEvaluation,
  InsertEvaluationScore,
  roadmaps,
  roadmapSteps,
  roadmapGoals,
  InsertRoadmap,
  InsertRoadmapStep,
  InsertRoadmapGoal,
  activityLogs,
  InsertActivityLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Get all categories
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(categories).orderBy(categories.displayOrder);
}

// Get evaluation items by category
export async function getEvaluationItemsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(evaluationItems)
    .where(eq(evaluationItems.categoryId, categoryId))
    .orderBy(evaluationItems.displayOrder);
}

// Get all evaluation items
export async function getAllEvaluationItems() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(evaluationItems).orderBy(evaluationItems.displayOrder);
}

// Create evaluation
export async function createEvaluation(data: InsertEvaluation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(evaluations).values(data);
  return result[0].insertId;
}

// Save evaluation scores
export async function saveEvaluationScores(scores: InsertEvaluationScore[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(evaluationScores).values(scores);
}

// Get user's evaluations
export async function getUserEvaluations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(evaluations)
    .where(eq(evaluations.userId, userId))
    .orderBy(desc(evaluations.createdAt));
}

// Get user's evaluation by period
export async function getUserEvaluationByPeriod(userId: number, evaluationPeriod: string, evaluationType: 'self' | 'manager') {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(evaluations)
    .where(
      and(
        eq(evaluations.userId, userId),
        eq(evaluations.evaluationPeriod, evaluationPeriod),
        eq(evaluations.evaluationType, evaluationType)
      )
    )
    .limit(1);
    
  return result.length > 0 ? result[0] : null;
}

// Get evaluation with scores
export async function getEvaluationWithScores(evaluationId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const evaluation = await db.select().from(evaluations)
    .where(eq(evaluations.id, evaluationId))
    .limit(1);
    
  if (evaluation.length === 0) return null;
  
  const scores = await db.select().from(evaluationScores)
    .where(eq(evaluationScores.evaluationId, evaluationId));
    
  return {
    ...evaluation[0],
    scores
  };
}

// Get all users (for admin)
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).orderBy(users.name);
}

// Get latest evaluation for a user with combined self and manager scores
export async function getLatestEvaluationForUser(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get latest self-evaluation
  const selfEvaluations = await db.select().from(evaluations)
    .where(eq(evaluations.userId, userId))
    .orderBy(desc(evaluations.createdAt))
    .limit(1);
    
  if (selfEvaluations.length === 0) return null;
  
  const selfEvaluation = selfEvaluations[0];
  
  // Get self-evaluation scores
  const selfScores = await db.select().from(evaluationScores)
    .where(eq(evaluationScores.evaluationId, selfEvaluation.id));
  
  // Get manager evaluation for the same period (if exists)
  const managerEvaluations = await db.select().from(evaluations)
    .where(
      and(
        eq(evaluations.userId, userId),
        eq(evaluations.evaluationType, 'manager'),
        eq(evaluations.evaluationPeriod, selfEvaluation.evaluationPeriod)
      )
    )
    .limit(1);
  
  let managerScores: any[] = [];
  if (managerEvaluations.length > 0) {
    managerScores = await db.select().from(evaluationScores)
      .where(eq(evaluationScores.evaluationId, managerEvaluations[0].id));
  }
  
  // Combine scores
  const combinedScores = selfScores.map(selfScore => {
    const managerScore = managerScores.find(ms => ms.itemId === selfScore.itemId);
    return {
      itemId: selfScore.itemId,
      selfScore: selfScore.score,
      selfComment: selfScore.comment,
      managerScore: managerScore?.score || null,
      managerComment: managerScore?.comment || null,
    };
  });
  
  return {
    ...selfEvaluation,
    scores: combinedScores,
  };
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update last signed in: database not available");
    return;
  }

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: {
  username: string;
  name: string;
  role: 'user' | 'admin' | 'manager';
  passwordHash: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create user: database not available");
  }

  const result = await db.insert(users).values({
    username: user.username,
    name: user.name,
    role: user.role,
    passwordHash: user.passwordHash,
    openId: null,
  });

  return Number(result[0].insertId);
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update password: database not available");
    return;
  }

  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

/**
 * Get evaluation status for a specific period
 */
export async function getEvaluationStatus(userId: number, evaluationPeriod: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get evaluation status: database not available");
    return { selfStatus: 'draft', managerStatus: 'draft' };
  }

  const selfEval = await db
    .select()
    .from(evaluations)
    .where(
      and(
        eq(evaluations.userId, userId),
        eq(evaluations.evaluationType, 'self'),
        eq(evaluations.evaluationPeriod, evaluationPeriod)
      )
    )
    .limit(1);

  const managerEval = await db
    .select()
    .from(evaluations)
    .where(
      and(
        eq(evaluations.userId, userId),
        eq(evaluations.evaluationType, 'manager'),
        eq(evaluations.evaluationPeriod, evaluationPeriod)
      )
    )
    .limit(1);

  return {
    selfStatus: selfEval.length > 0 ? selfEval[0].status : 'draft',
    managerStatus: managerEval.length > 0 ? managerEval[0].status : 'draft',
  };
}

export async function updateUser(id: number, data: {
  username: string;
  name: string;
  role: 'user' | 'admin' | 'manager';
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot update user: database not available");
  }

  await db.update(users).set({
    username: data.username,
    name: data.name,
    role: data.role,
  }).where(eq(users.id, id));
}

// ========== Roadmap Functions ==========

/**
 * Get roadmap by user and period
 */
export async function getRoadmapByUserAndPeriod(userId: number, evaluationPeriod: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(roadmaps)
    .where(
      and(
        eq(roadmaps.userId, userId),
        eq(roadmaps.evaluationPeriod, evaluationPeriod)
      )
    )
    .limit(1);
    
  if (result.length === 0) return null;
  
  const roadmap = result[0];
  
  // Get steps
  const steps = await db.select().from(roadmapSteps)
    .where(eq(roadmapSteps.roadmapId, roadmap.id))
    .orderBy(roadmapSteps.stepNumber);
  
  // Get goals
  const goals = await db.select().from(roadmapGoals)
    .where(eq(roadmapGoals.roadmapId, roadmap.id))
    .orderBy(roadmapGoals.displayOrder);
  
  return {
    ...roadmap,
    steps,
    goals,
  };
}

/**
 * Create or update roadmap
 */
export async function upsertRoadmap(data: {
  userId: number;
  evaluationPeriod: string;
  longTermVision: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    deadline?: string;
  }>;
  goals: Array<{
    stepId?: number;
    goalText: string;
    isCompleted?: number;
    displayOrder: number;
  }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if roadmap exists
  const existing = await db.select().from(roadmaps)
    .where(
      and(
        eq(roadmaps.userId, data.userId),
        eq(roadmaps.evaluationPeriod, data.evaluationPeriod)
      )
    )
    .limit(1);
  
  let roadmapId: number;
  
  if (existing.length > 0) {
    // Update existing roadmap
    roadmapId = existing[0].id;
    await db.update(roadmaps)
      .set({ longTermVision: data.longTermVision })
      .where(eq(roadmaps.id, roadmapId));
    
    // Delete existing steps and goals
    await db.delete(roadmapSteps).where(eq(roadmapSteps.roadmapId, roadmapId));
    await db.delete(roadmapGoals).where(eq(roadmapGoals.roadmapId, roadmapId));
  } else {
    // Create new roadmap
    const result = await db.insert(roadmaps).values({
      userId: data.userId,
      evaluationPeriod: data.evaluationPeriod,
      longTermVision: data.longTermVision,
    });
    roadmapId = Number(result[0].insertId);
  }
  
  // Insert steps
  if (data.steps.length > 0) {
    await db.insert(roadmapSteps).values(
      data.steps.map(step => ({
        roadmapId,
        stepNumber: step.stepNumber,
        title: step.title,
        deadline: step.deadline || null,
      }))
    );
  }
  
  // Get step IDs for goals
  const insertedSteps = await db.select().from(roadmapSteps)
    .where(eq(roadmapSteps.roadmapId, roadmapId))
    .orderBy(roadmapSteps.stepNumber);
  
  // Insert goals
  if (data.goals.length > 0) {
    await db.insert(roadmapGoals).values(
      data.goals.map(goal => {
        let stepId = null;
        if (goal.stepId !== undefined && goal.stepId !== null) {
          const step = insertedSteps.find(s => s.stepNumber === goal.stepId);
          stepId = step ? step.id : null;
        }
        return {
          roadmapId,
          stepId,
          goalText: goal.goalText,
          isCompleted: goal.isCompleted || 0,
          displayOrder: goal.displayOrder,
        };
      })
    );
  }
  
  return roadmapId;
}

/**
 * Delete roadmap
 */
export async function deleteRoadmap(roadmapId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(roadmapGoals).where(eq(roadmapGoals.roadmapId, roadmapId));
  await db.delete(roadmapSteps).where(eq(roadmapSteps.roadmapId, roadmapId));
  await db.delete(roadmaps).where(eq(roadmaps.id, roadmapId));
}

/**
 * Toggle goal completion
 */
export async function toggleGoalCompletion(goalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const goal = await db.select().from(roadmapGoals)
    .where(eq(roadmapGoals.id, goalId))
    .limit(1);
  
  if (goal.length === 0) throw new Error("Goal not found");
  
  const newStatus = goal[0].isCompleted === 1 ? 0 : 1;
  await db.update(roadmapGoals)
    .set({ isCompleted: newStatus })
    .where(eq(roadmapGoals.id, goalId));
  
  return newStatus;
}

/**
 * Create activity log
 */
export async function createActivityLog(log: InsertActivityLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(activityLogs).values(log);
}

/**
 * Get recent activity logs for a user
 */
export async function getRecentActivityLogs(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(activityLogs)
    .where(eq(activityLogs.userId, userId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);
}

/**
 * Get all recent activity logs (for admin/manager)
 */
export async function getAllRecentActivityLogs(limit: number = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);
}
