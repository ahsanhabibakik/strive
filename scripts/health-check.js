#!/usr/bin/env node

/**
 * Health Check Script
 * Comprehensive system health monitoring
 */

const { MongoClient } = require('mongodb');
const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const checks = {
  database: {
    name: '🗄️  Database Connection',
    check: async () => {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not configured');
      }
      
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      
      // Test database operations
      const db = client.db();
      const collections = await db.listCollections().toArray();
      await client.close();
      
      return {
        status: 'healthy',
        details: `Connected to ${collections.length} collections`,
      };
    }
  },
  
  environment: {
    name: '🔧 Environment Variables',
    check: async () => {
      const required = ['MONGODB_URI', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
      const optional = ['GOOGLE_CLIENT_ID', 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', 'NEXT_PUBLIC_SANITY_PROJECT_ID'];
      
      const missing = required.filter(key => !process.env[key]);
      const configured = optional.filter(key => process.env[key]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required variables: ${missing.join(', ')}`);
      }
      
      return {
        status: 'healthy',
        details: `Required: ${required.length}/${required.length}, Optional: ${configured.length}/${optional.length}`,
      };
    }
  },
  
  nextjsApp: {
    name: '⚡ Next.js Application',
    check: async () => {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      
      return new Promise((resolve, reject) => {
        const client = baseUrl.startsWith('https') ? https : http;
        
        const req = client.get(`${baseUrl}/api/health`, { timeout: 5000 }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              resolve({
                status: 'healthy',
                details: `API responding (${response.version || 'unknown'})`,
              });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });
    }
  },
  
  analytics: {
    name: '📊 Analytics Configuration',
    check: async () => {
      const analytics = {
        googleAnalytics: !!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
        googleTagManager: !!process.env.NEXT_PUBLIC_GTM_ID,
        mixpanel: !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
      };
      
      const configured = Object.values(analytics).filter(Boolean).length;
      const total = Object.keys(analytics).length;
      
      return {
        status: configured > 0 ? 'healthy' : 'warning',
        details: `${configured}/${total} analytics services configured`,
      };
    }
  },
  
  cms: {
    name: '🎨 Content Management',
    check: async () => {
      const sanityConfigured = !!(
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
        process.env.NEXT_PUBLIC_SANITY_DATASET
      );
      
      return {
        status: sanityConfigured ? 'healthy' : 'warning',
        details: sanityConfigured ? 'Sanity CMS configured' : 'CMS not configured (optional)',
      };
    }
  },
  
  security: {
    name: '🔒 Security Configuration',
    check: async () => {
      const securityChecks = {
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        httpsInProduction: process.env.NODE_ENV !== 'production' || process.env.NEXTAUTH_URL?.startsWith('https'),
        environmentIsolation: !process.env.NODE_ENV || ['development', 'production', 'test'].includes(process.env.NODE_ENV),
      };
      
      const passed = Object.values(securityChecks).filter(Boolean).length;
      const total = Object.keys(securityChecks).length;
      
      if (passed !== total) {
        throw new Error(`Security checks failed: ${passed}/${total} passed`);
      }
      
      return {
        status: 'healthy',
        details: `${passed}/${total} security checks passed`,
      };
    }
  },
  
  performance: {
    name: '⚡ Performance Metrics',
    check: async () => {
      const startTime = process.hrtime();
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const milliseconds = Math.round(seconds * 1000 + nanoseconds / 1000000);
      
      // Check Node.js performance
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      
      return {
        status: memUsageMB < 100 ? 'healthy' : 'warning',
        details: `Response: ${milliseconds}ms, Memory: ${memUsageMB}MB`,
      };
    }
  }
};

async function runHealthCheck(verbose = false) {
  console.log('🏥 Running comprehensive health check...\n');
  
  const results = {};
  let overallStatus = 'healthy';
  
  for (const [key, check] of Object.entries(checks)) {
    const startTime = Date.now();
    
    try {
      const result = await check.check();
      const duration = Date.now() - startTime;
      
      results[key] = {
        ...result,
        duration: `${duration}ms`,
      };
      
      const statusIcon = result.status === 'healthy' ? '✅' : 
                        result.status === 'warning' ? '⚠️' : '❌';
      
      console.log(`${statusIcon} ${check.name}`);
      if (verbose || result.status !== 'healthy') {
        console.log(`   ${result.details} (${duration}ms)`);
      }
      
      if (result.status === 'error') {
        overallStatus = 'error';
      } else if (result.status === 'warning' && overallStatus === 'healthy') {
        overallStatus = 'warning';
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      results[key] = {
        status: 'error',
        error: error.message,
        duration: `${duration}ms`,
      };
      
      console.log(`❌ ${check.name}`);
      console.log(`   Error: ${error.message} (${duration}ms)`);
      
      overallStatus = 'error';
    }
  }
  
  console.log(`\n🏥 Overall Status: ${overallStatus.toUpperCase()}`);
  
  if (verbose) {
    console.log('\n📊 Detailed Results:');
    console.log(JSON.stringify(results, null, 2));
  }
  
  // Exit with appropriate code
  if (overallStatus === 'error') {
    process.exit(1);
  } else if (overallStatus === 'warning') {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

// CLI usage
if (require.main === module) {
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  const watch = process.argv.includes('--watch') || process.argv.includes('-w');
  
  if (watch) {
    console.log('🔄 Running health check in watch mode (every 30 seconds)...\n');
    
    const runCheck = () => {
      runHealthCheck(verbose).catch(() => {}); // Don't exit in watch mode
    };
    
    runCheck();
    setInterval(runCheck, 30000);
  } else {
    runHealthCheck(verbose);
  }
}

module.exports = { runHealthCheck, checks };