import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { verifyPassword, generateToken, hashPassword } from "./_core/auth";

export const appRouter = router({
  system: systemRouter,
  // User management (admin and manager only)
  users: router({
    // Get all users (admin only)
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new Error("管理者権限が必要です");
      }
      return await db.getAllUsers();
    }),

    // Create user (admin and manager)
    create: protectedProcedure
      .input(z.object({
        username: z.string().min(3),
        name: z.string(),
        role: z.enum(['user', 'admin', 'manager']),
        initialPassword: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin' && ctx.user.role !== 'manager') {
          throw new Error("管理者または上長権限が必要です");
        }
        
        // Managers can only create users, not admins or managers
        if (ctx.user.role === 'manager' && input.role !== 'user') {
          throw new Error("上長はメンバーのみ作成できます");
        }
        
        const passwordHash = await hashPassword(input.initialPassword);
        const userId = await db.createUser({
          username: input.username,
          name: input.name,
          role: input.role,
          passwordHash,
        });
        
        return { success: true, userId };
      }),

    // Update user (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        username: z.string().min(3),
        name: z.string(),
        role: z.enum(['user', 'admin', 'manager']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error("管理者権限が必要です");
        }
        
        await db.updateUser(input.id, {
          username: input.username,
          name: input.name,
          role: input.role,
        });
        
        return { success: true };
      }),

    // Change password
    changePassword: protectedProcedure
      .input(z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user || !user.passwordHash) {
          throw new Error("ユーザーが見つかりません");
        }
        
        const isValid = await verifyPassword(input.currentPassword, user.passwordHash);
        if (!isValid) {
          throw new Error("現在のパスワードが間違っています");
        }
        
        const newPasswordHash = await hashPassword(input.newPassword);
        await db.updateUserPassword(ctx.user.id, newPasswordHash);
        
        return { success: true };
      }),
  }),

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByUsername(input.username);
        if (!user || !user.passwordHash) {
          throw new Error("ユーザー名またはパスワードが間違っています");
        }
        
        const isValid = await verifyPassword(input.password, user.passwordHash);
        if (!isValid) {
          throw new Error("ユーザー名またはパスワードが間違っています");
        }
        
        const token = generateToken(user.id);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
        
        await db.updateLastSignedIn(user.id);
        
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
          },
        };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Evaluation categories and items
  evaluation: router({
    // Get all categories
    getCategories: protectedProcedure.query(async () => {
      return await db.getCategories();
    }),

    // Get all evaluation items
    getAllItems: protectedProcedure.query(async () => {
      return await db.getAllEvaluationItems();
    }),

    // Get items by category
    getItemsByCategory: protectedProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEvaluationItemsByCategory(input.categoryId);
      }),

    // Submit self-evaluation
    submitSelfEvaluation: protectedProcedure
      .input(z.object({
        evaluationPeriod: z.string(),
        scores: z.array(z.object({
          itemId: z.number(),
          score: z.number().min(1).max(5),
          comment: z.string().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const evaluationId = await db.createEvaluation({
          userId: ctx.user.id,
          evaluationType: 'self',
          evaluationPeriod: input.evaluationPeriod,
          status: 'submitted',
          submittedAt: new Date(),
        });

        await db.saveEvaluationScores(
          input.scores.map(score => ({
            evaluationId: evaluationId as number,
            itemId: score.itemId,
            score: score.score,
            comment: score.comment || null,
          }))
        );

        // Create activity log
        await db.createActivityLog({
          userId: ctx.user.id,
          activityType: 'self_evaluation_submitted',
          description: `${input.evaluationPeriod}の自己評価を提出しました`,
          evaluationPeriod: input.evaluationPeriod,
        });
        
        return { success: true, evaluationId };
      }),

    // Submit manager evaluation
    submitManagerEvaluation: protectedProcedure
      .input(z.object({
        userId: z.number(),
        evaluationPeriod: z.string(),
        scores: z.array(z.object({
          itemId: z.number(),
          score: z.number().min(1).max(5),
          comment: z.string().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const evaluationId = await db.createEvaluation({
          userId: input.userId,
          evaluatorId: ctx.user.id,
          evaluationType: 'manager',
          evaluationPeriod: input.evaluationPeriod,
          status: 'completed',
          submittedAt: new Date(),
        });

        await db.saveEvaluationScores(
          input.scores.map(score => ({
            evaluationId: evaluationId as number,
            itemId: score.itemId,
            score: score.score,
            comment: score.comment || null,
          }))
        );

        // Create activity log for manager
        await db.createActivityLog({
          userId: ctx.user.id,
          activityType: 'manager_evaluation_completed',
          description: `${input.evaluationPeriod}の上長評価を完了しました`,
          evaluationPeriod: input.evaluationPeriod,
          targetUserId: input.userId,
        });
        
        // Create activity log for evaluated user
        await db.createActivityLog({
          userId: input.userId,
          activityType: 'manager_evaluation_completed',
          description: `${input.evaluationPeriod}の上長評価が完了しました`,
          evaluationPeriod: input.evaluationPeriod,
          targetUserId: ctx.user.id,
        });

        return { success: true, evaluationId };
      }),

    // Get user's evaluations
    getMyEvaluations: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserEvaluations(ctx.user.id);
    }),

    // Get user's evaluation by period
    getMyEvaluationByPeriod: protectedProcedure
      .input(z.object({ 
        evaluationPeriod: z.string(),
        evaluationType: z.enum(['self', 'manager'])
      }))
      .query(async ({ ctx, input }) => {
        return await db.getUserEvaluationByPeriod(ctx.user.id, input.evaluationPeriod, input.evaluationType);
      }),

    // Get evaluation details with scores
    getEvaluationDetails: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEvaluationWithScores(input.evaluationId);
      }),

    // Get latest evaluation for a user (with permission check)
    getLatestEvaluation: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Permission check:
        // - Users can only view their own evaluations
        // - Managers and admins can view all evaluations
        if (ctx.user.role === 'user' && ctx.user.id !== input.userId) {
          throw new Error("他のユーザーの評価結果を閲覧する権限がありません");
        }
        return await db.getLatestEvaluationForUser(input.userId);
      }),

    // Get all evaluations for a user (with permission check)
    getUserEvaluations: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Permission check:
        // - Users can only view their own evaluations
        // - Managers and admins can view all evaluations
        if (ctx.user.role === 'user' && ctx.user.id !== input.userId) {
          throw new Error("他のユーザーの評価結果を閲覧する権限がありません");
        }
        return await db.getUserEvaluations(input.userId);
      }),

    // Get evaluation status for a period
    getEvaluationStatus: protectedProcedure
      .input(z.object({ 
        userId: z.number(),
        evaluationPeriod: z.string()
      }))
      .query(async ({ ctx, input }) => {
        // Permission check:
        // - Users can only view their own status
        // - Managers and admins can view all statuses
        if (ctx.user.role === 'user' && ctx.user.id !== input.userId) {
          throw new Error("他のユーザーの評価ステータスを閲覧する権限がありません");
        }
        return await db.getEvaluationStatus(input.userId, input.evaluationPeriod);
      }),
  }),

  // Admin functions
  admin: router({
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin' && ctx.user.role !== 'manager') {
        throw new Error('Unauthorized');
      }
      return await db.getAllUsers();
    }),
  }),

  // Roadmap management
  roadmap: router({
    // Get roadmap by period
    getByPeriod: protectedProcedure
      .input(z.object({
        evaluationPeriod: z.string(),
        userId: z.number().optional(), // For managers to view member's roadmap
      }))
      .query(async ({ ctx, input }) => {
        const targetUserId = input.userId || ctx.user.id;
        
        // Check permission: user can only view their own, manager/admin can view others
        if (targetUserId !== ctx.user.id && ctx.user.role !== 'admin' && ctx.user.role !== 'manager') {
          throw new Error('権限がありません');
        }
        
        return await db.getRoadmapByUserAndPeriod(targetUserId, input.evaluationPeriod);
      }),

    // Save roadmap
    save: protectedProcedure
      .input(z.object({
        evaluationPeriod: z.string(),
        longTermVision: z.string(),
        steps: z.array(z.object({
          stepNumber: z.number(),
          title: z.string(),
          deadline: z.string().optional(),
        })),
        goals: z.array(z.object({
          stepId: z.number().optional().nullable(),
          goalText: z.string(),
          isCompleted: z.number().optional(),
          displayOrder: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const roadmapId = await db.upsertRoadmap({
          userId: ctx.user.id,
          evaluationPeriod: input.evaluationPeriod,
          longTermVision: input.longTermVision,
          steps: input.steps,
          goals: input.goals.map(g => ({
            ...g,
            stepId: g.stepId ?? undefined,
          })),
        });
        
        // Create activity log
        await db.createActivityLog({
          userId: ctx.user.id,
          activityType: 'roadmap_updated',
          description: `${input.evaluationPeriod}のキャリアマップを更新しました`,
          evaluationPeriod: input.evaluationPeriod,
        });
        
        return { success: true, roadmapId };
      }),

    // Toggle goal completion
    toggleGoal: protectedProcedure
      .input(z.object({
        goalId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const newStatus = await db.toggleGoalCompletion(input.goalId);
        return { success: true, isCompleted: newStatus };
      }),
  }),

  // Activity logs
  activityLogs: router({
    // Get recent activity logs
    getRecent: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'admin' || ctx.user.role === 'manager') {
        // Admin and manager can see all activity logs
        return await db.getAllRecentActivityLogs(20);
      } else {
        // Regular users can only see their own activity logs
        return await db.getRecentActivityLogs(ctx.user.id, 10);
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
