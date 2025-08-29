# Rate Limiting Middleware System

A comprehensive rate limiting system for the Strive application with Redis support, fallback to in-memory storage, and advanced monitoring capabilities.

## Features

- **Distributed Rate Limiting**: Uses Redis for distributed rate limiting across multiple server instances
- **In-Memory Fallback**: Automatically falls back to in-memory storage when Redis is unavailable
- **Pattern-Based Configuration**: Different rate limits for different endpoint patterns
- **User-Based Rate Limiting**: Support for both IP-based and user-based rate limiting
- **Advanced Monitoring**: Comprehensive logging, violation tracking, and suspicious activity detection
- **Automatic IP Blocking**: Temporarily blocks IPs with excessive violations
- **Flexible Configuration**: Environment-specific adjustments and special limits for different user agents

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Middleware    │───▶│  Rate Limiter    │───▶│   Redis Store   │
│   (Next.js)     │    │                  │    │   (Primary)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                │                        ▼
                                │               ┌─────────────────┐
                                │               │  Memory Store   │
                                │               │   (Fallback)    │
                                │               └─────────────────┘
                                ▼
                       ┌──────────────────┐
                       │     Monitor      │
                       │   & Analytics    │
                       └──────────────────┘
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Redis Configuration (optional - will use in-memory if not provided)
REDIS_URL=redis://localhost:6379
# OR
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
```

### Rate Limit Patterns

The system includes pre-configured patterns for:

- **Authentication endpoints**: 5 requests per minute
- **Password reset**: 3 requests per minute  
- **File uploads**: 10 requests per hour
- **Search endpoints**: 50 requests per hour
- **General API**: 100 requests per hour
- **Admin endpoints**: 30 requests per minute
- **Payment endpoints**: 15 requests per minute

## Usage Examples

### Basic Usage

The rate limiting is automatically applied through the main middleware. No additional setup required for basic functionality.

### Custom Rate Limiting in API Routes

```typescript
import { createRateLimit } from '@/lib/middleware/rate-limit';

const rateLimiter = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many requests'
});

export const GET = rateLimiter(async (request) => {
  // Your API logic here
  return NextResponse.json({ data: 'response' });
});
```

### User-Based Rate Limiting

```typescript
import { createUserRateLimit } from '@/lib/middleware/rate-limit';

const userRateLimiter = createUserRateLimit('api-calls', {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: 'User rate limit exceeded'
});

export const POST = userRateLimiter(async (request) => {
  // Your API logic here
  return NextResponse.json({ data: 'response' });
});
```

### Monitoring Access

Access rate limit statistics through the admin API:

```bash
# Get overview
GET /api/admin/rate-limits

# Get statistics
GET /api/admin/rate-limits?action=stats

# Get recent violations (last 24 hours)
GET /api/admin/rate-limits?action=violations&hours=24

# Get comprehensive report
GET /api/admin/rate-limits?action=report

# Reset statistics
POST /api/admin/rate-limits
{
  "action": "reset"
}
```

## Rate Limit Headers

The system automatically adds standard rate limit headers to responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-01T12:00:00.000Z
Retry-After: 60
```

## Error Responses

When rate limits are exceeded, the system returns:

```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

For blocked IPs:

```json
{
  "success": false,
  "error": "IP temporarily blocked due to excessive violations",
  "code": "IP_BLOCKED",
  "retryAfter": 900
}
```

## Monitoring & Analytics

### Violation Detection

The system automatically detects:

- **Multiple violations from same IP**: 5+ violations in 5 minutes
- **Distributed attacks**: Same user agent from multiple IPs
- **Rapid-fire violations**: 3+ violations in 30 seconds from same IP

### Statistics Tracking

- Total requests and violations
- Violations by endpoint, IP, and user
- Top violators analysis
- Time-based pattern analysis

### Automatic IP Blocking

IPs with more than 10 violations in 15 minutes are temporarily blocked for 15 minutes.

## Customization

### Adding New Rate Limit Patterns

Edit `src/lib/middleware/rate-limit-config.ts`:

```typescript
export const RATE_LIMIT_CONFIGS: RateLimitConfig[] = [
  // ... existing configs
  {
    pattern: /^\/api\/my-endpoint/,
    options: {
      windowMs: 60 * 1000,
      max: 20,
      message: 'Custom rate limit message'
    },
    description: 'My custom endpoint',
    authRequired: false
  }
];
```

### User Type-Based Limits

Modify the `getUserRateLimit` function to adjust limits based on user subscription tiers.

### Special User Agent Handling

Edit the `getSpecialRateLimit` function to handle specific user agents differently.

## Performance Considerations

- Redis operations are optimized with pipelines for atomic operations
- Memory store automatically cleans up expired entries
- Configurable connection pooling for Redis
- Graceful fallback when Redis is unavailable

## Security Features

- Automatic detection of suspicious patterns
- IP blocking for repeat violators  
- Protection against distributed attacks
- Bot detection with special rate limits
- Comprehensive logging for security analysis

## Troubleshooting

### Redis Connection Issues

If Redis connection fails, the system automatically falls back to in-memory storage. Check logs for Redis connection errors.

### High Memory Usage

The in-memory fallback store automatically cleans up expired entries every 5 minutes. For high-traffic applications, ensure Redis is properly configured.

### Rate Limit Not Working

1. Check that the middleware is properly configured in `middleware.ts`
2. Verify the request path matches the configured patterns
3. Check Redis connectivity if using Redis
4. Review logs for any rate limiting errors

## Development vs Production

- **Development**: Rate limits are 10x more lenient
- **Test**: Very high limits for testing
- **Production**: Uses configured limits as-is

The system automatically adjusts based on `NODE_ENV`.