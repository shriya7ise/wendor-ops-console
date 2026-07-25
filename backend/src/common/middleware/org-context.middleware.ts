import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Express's Request type so req.orgId is typed everywhere it's read
// (every controller in this app already does `req.orgId` via `@Req() req: any`,
// so this also lets us tighten those to `Request` later without a rewrite).
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      orgId?: string;
      userId?: string;
    }
  }
}

/**
 * Resolves org context for every incoming request.
 *
 * TODO(auth): this is a single-tenant stopgap. Every controller in the app
 * reads `req.orgId` but nothing was ever setting it — Prisma silently drops
 * `undefined` filter values, so reads happened to work by accident (there's
 * only one Organisation row in the seed data), while `create()` calls threw
 * because Prisma requires the field explicitly. Replace the hardcoded value
 * below with real resolution once auth exists, e.g.:
 *   req.orgId = req.headers['x-org-id'] as string;
 * or derive it from a decoded JWT / session once login is implemented.
 */
@Injectable()
export class OrgContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.orgId = process.env.DEFAULT_ORG_ID ?? 'seed-org';
    req.userId = req.userId ?? 'unknown';
    next();
  }
}