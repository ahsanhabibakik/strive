import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/errors';
import { requireRole } from '@/lib/middleware/auth';
import { 
  getRateLimitStats, 
  getRecentViolations, 
  generateRateLimitReport,
  resetRateLimitStats 
} from '@/lib/middleware/rate-limit-monitor';

/**
 * GET /api/admin/rate-limits
 * Get rate limit statistics and monitoring data
 */
export const GET = requireRole('admin')(asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const hours = parseInt(searchParams.get('hours') || '24');

  switch (action) {
    case 'stats':
      const stats = getRateLimitStats();
      return NextResponse.json({
        success: true,
        data: stats
      });

    case 'violations':
      const violations = getRecentViolations(hours);
      return NextResponse.json({
        success: true,
        data: {
          violations,
          timeRange: `${hours} hours`,
          count: violations.length
        }
      });

    case 'report':
      const report = generateRateLimitReport();
      return NextResponse.json({
        success: true,
        data: report
      });

    default:
      // Default: return comprehensive overview
      const overview = {
        stats: getRateLimitStats(),
        recentViolations: getRecentViolations(1).slice(0, 20), // Last hour, max 20
        report: generateRateLimitReport()
      };
      
      return NextResponse.json({
        success: true,
        data: overview
      });
  }
}));

/**
 * POST /api/admin/rate-limits
 * Perform rate limit management actions
 */
export const POST = requireRole('admin')(asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'reset':
      resetRateLimitStats();
      return NextResponse.json({
        success: true,
        message: 'Rate limit statistics reset successfully'
      });

    default:
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
  }
}));