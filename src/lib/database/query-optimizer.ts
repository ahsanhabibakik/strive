/**
 * Database Query Optimizer
 * Provides query optimization, performance analysis, and recommendations
 */

import mongoose from 'mongoose';
import { logger } from '../monitoring';

export interface QueryPlan {
  queryPlanner: {
    plannerVersion: number;
    namespace: string;
    indexFilterSet: boolean;
    parsedQuery: any;
    winningPlan: {
      stage: string;
      filter?: any;
      direction?: string;
      indexName?: string;
      keyPattern?: any;
      inputStage?: any;
    };
    rejectedPlans: any[];
  };
  executionStats: {
    executionSuccess: boolean;
    nReturned: number;
    executionTimeMillis: number;
    totalKeysExamined: number;
    totalDocsExamined: number;
    executionStages: any;
  };
  serverInfo: {
    host: string;
    port: number;
    version: string;
  };
}

export interface QueryOptimization {
  originalQuery: any;
  optimizedQuery: any;
  improvements: Array<{
    type: 'index' | 'query_structure' | 'projection' | 'sort' | 'limit';
    description: string;
    impact: 'high' | 'medium' | 'low';
    before?: any;
    after?: any;
  }>;
  estimatedImprovement: {
    executionTimeReduction: number; // percentage
    documentsExaminedReduction: number; // percentage
    indexUsageImprovement: boolean;
  };
}

export interface IndexRecommendation {
  collection: string;
  fields: Array<{
    field: string;
    direction: 1 | -1;
  }>;
  type: 'single' | 'compound' | 'text' | 'geo' | 'sparse' | 'partial';
  reason: string;
  impact: 'high' | 'medium' | 'low';
  priority: number;
  estimatedSize: number; // in bytes
  createStatement: string;
  queryPatterns: Array<{
    query: any;
    frequency: number;
    avgExecutionTime: number;
  }>;
}

export interface QueryAnalysis {
  isOptimal: boolean;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
  issues: Array<{
    type: 'table_scan' | 'inefficient_index' | 'large_result_set' | 'complex_query' | 'missing_index';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    suggestion: string;
  }>;
  metrics: {
    executionTime: number;
    documentsExamined: number;
    documentsReturned: number;
    keysExamined: number;
    indexHit: boolean;
    efficiency: number; // documents returned / documents examined
  };
}

export class DatabaseQueryOptimizer {
  private mongoose: typeof mongoose;
  private queryCache: Map<string, { plan: QueryPlan; timestamp: Date }> = new Map();
  private indexRecommendations: Map<string, IndexRecommendation[]> = new Map();

  constructor(mongoose: typeof mongoose) {
    this.mongoose = mongoose;
  }

  /**
   * Analyze a query and provide optimization recommendations
   */
  async analyzeQuery(
    collection: string, 
    query: any, 
    options: {
      projection?: any;
      sort?: any;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<QueryAnalysis> {
    try {
      const db = this.mongoose.connection.db;
      if (!db) {
        throw new Error('Database not connected');
      }

      const coll = db.collection(collection);
      
      // Get query execution plan
      const explain = await coll.find(query, options).explain('executionStats');
      const plan = explain as QueryPlan;

      // Cache the plan
      const cacheKey = this.generateCacheKey(collection, query, options);
      this.queryCache.set(cacheKey, { plan, timestamp: new Date() });

      // Analyze the plan
      const analysis = this.analyzeExecutionPlan(plan);
      
      logger.debug('Query analysis completed', {
        collection,
        isOptimal: analysis.isOptimal,
        performance: analysis.performance,
        executionTime: analysis.metrics.executionTime,
      });

      return analysis;

    } catch (error) {
      logger.error('Error analyzing query:', error);
      throw error;
    }
  }

  /**
   * Optimize a query and return the optimized version with improvements
   */
  async optimizeQuery(
    collection: string,
    query: any,
    options: {
      projection?: any;
      sort?: any;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<QueryOptimization> {
    const improvements: QueryOptimization['improvements'] = [];
    let optimizedQuery = { ...query };
    let optimizedOptions = { ...options };

    // Analyze original query
    const originalAnalysis = await this.analyzeQuery(collection, query, options);

    // Apply query structure optimizations
    const structureOptimizations = this.optimizeQueryStructure(optimizedQuery);
    improvements.push(...structureOptimizations.improvements);
    optimizedQuery = structureOptimizations.query;

    // Apply projection optimizations
    if (!options.projection) {
      const projectionOptimization = this.optimizeProjection(collection, optimizedQuery);
      if (projectionOptimization) {
        optimizedOptions.projection = projectionOptimization.projection;
        improvements.push(projectionOptimization.improvement);
      }
    }

    // Apply sort optimizations
    if (options.sort) {
      const sortOptimization = this.optimizeSort(collection, optimizedQuery, options.sort);
      if (sortOptimization) {
        optimizedOptions.sort = sortOptimization.sort;
        improvements.push(sortOptimization.improvement);
      }
    }

    // Apply limit optimizations
    if (!options.limit || options.limit > 1000) {
      const limitOptimization = this.optimizeLimit(originalAnalysis);
      if (limitOptimization) {
        optimizedOptions.limit = limitOptimization.limit;
        improvements.push(limitOptimization.improvement);
      }
    }

    // Analyze optimized query for comparison
    const optimizedAnalysis = await this.analyzeQuery(collection, optimizedQuery, optimizedOptions);

    // Calculate estimated improvements
    const estimatedImprovement = {
      executionTimeReduction: this.calculateImprovement(
        originalAnalysis.metrics.executionTime,
        optimizedAnalysis.metrics.executionTime
      ),
      documentsExaminedReduction: this.calculateImprovement(
        originalAnalysis.metrics.documentsExamined,
        optimizedAnalysis.metrics.documentsExamined
      ),
      indexUsageImprovement: optimizedAnalysis.metrics.indexHit && !originalAnalysis.metrics.indexHit,
    };

    return {
      originalQuery: { query, options },
      optimizedQuery: { query: optimizedQuery, options: optimizedOptions },
      improvements,
      estimatedImprovement,
    };
  }

  /**
   * Generate index recommendations for a collection
   */
  async generateIndexRecommendations(collection: string): Promise<IndexRecommendation[]> {
    try {
      const cached = this.indexRecommendations.get(collection);
      if (cached) {
        return cached;
      }

      const db = this.mongoose.connection.db;
      if (!db) {
        throw new Error('Database not connected');
      }

      const recommendations: IndexRecommendation[] = [];

      // Analyze query patterns from cache
      const queryPatterns = this.analyzeQueryPatterns(collection);
      
      for (const pattern of queryPatterns) {
        const recommendation = await this.createIndexRecommendation(collection, pattern);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }

      // Add recommendations for common optimization patterns
      const commonRecommendations = await this.getCommonIndexRecommendations(collection);
      recommendations.push(...commonRecommendations);

      // Sort by priority and impact
      const sortedRecommendations = recommendations.sort((a, b) => {
        if (a.impact !== b.impact) {
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        }
        return b.priority - a.priority;
      });

      // Cache recommendations
      this.indexRecommendations.set(collection, sortedRecommendations);

      return sortedRecommendations;

    } catch (error) {
      logger.error('Error generating index recommendations:', error);
      return [];
    }
  }

  /**
   * Create indexes based on recommendations
   */
  async createRecommendedIndexes(
    collection: string,
    recommendations: IndexRecommendation[],
    options: {
      maxIndexes?: number;
      onlyHighImpact?: boolean;
      dryRun?: boolean;
    } = {}
  ): Promise<Array<{ recommendation: IndexRecommendation; created: boolean; error?: string }>> {
    const results: Array<{ recommendation: IndexRecommendation; created: boolean; error?: string }> = [];
    const maxIndexes = options.maxIndexes || 5;
    const onlyHighImpact = options.onlyHighImpact || false;
    
    const filteredRecommendations = recommendations
      .filter(rec => !onlyHighImpact || rec.impact === 'high')
      .slice(0, maxIndexes);

    for (const recommendation of filteredRecommendations) {
      try {
        if (options.dryRun) {
          logger.info(`[DRY RUN] Would create index: ${recommendation.createStatement}`);
          results.push({ recommendation, created: true });
          continue;
        }

        const db = this.mongoose.connection.db;
        if (!db) {
          throw new Error('Database not connected');
        }

        const coll = db.collection(collection);
        
        // Create the index
        const indexSpec = recommendation.fields.reduce((spec, field) => {
          spec[field.field] = field.direction;
          return spec;
        }, {} as any);

        const indexOptions: any = {};
        
        if (recommendation.type === 'sparse') {
          indexOptions.sparse = true;
        }
        
        if (recommendation.type === 'partial') {
          // Would need to determine partial filter expression
        }

        await coll.createIndex(indexSpec, indexOptions);
        
        logger.info(`Created index for collection ${collection}:`, recommendation.createStatement);
        results.push({ recommendation, created: true });

      } catch (error) {
        logger.error(`Failed to create index for collection ${collection}:`, error);
        results.push({ 
          recommendation, 
          created: false, 
          error: (error as Error).message 
        });
      }
    }

    return results;
  }

  private analyzeExecutionPlan(plan: QueryPlan): QueryAnalysis {
    const { executionStats } = plan;
    const issues: QueryAnalysis['issues'] = [];
    
    // Calculate efficiency
    const efficiency = executionStats.nReturned > 0 
      ? executionStats.nReturned / Math.max(executionStats.totalDocsExamined, 1)
      : 0;

    // Check for table scan
    const isTableScan = plan.queryPlanner.winningPlan.stage === 'COLLSCAN';
    if (isTableScan) {
      issues.push({
        type: 'table_scan',
        severity: 'critical',
        description: 'Query is performing a full collection scan',
        suggestion: 'Create an appropriate index for the query fields',
      });
    }

    // Check for inefficient index usage
    const docsExaminedToReturned = executionStats.totalDocsExamined / Math.max(executionStats.nReturned, 1);
    if (docsExaminedToReturned > 10) {
      issues.push({
        type: 'inefficient_index',
        severity: 'warning',
        description: `Query examines too many documents (${executionStats.totalDocsExamined}) relative to results returned (${executionStats.nReturned})`,
        suggestion: 'Consider creating a more selective index or optimizing query conditions',
      });
    }

    // Check for large result sets
    if (executionStats.nReturned > 1000) {
      issues.push({
        type: 'large_result_set',
        severity: 'info',
        description: `Query returns a large number of documents (${executionStats.nReturned})`,
        suggestion: 'Consider adding pagination with limit and skip, or using aggregation for data processing',
      });
    }

    // Determine performance rating
    let performance: QueryAnalysis['performance'] = 'excellent';
    if (executionStats.executionTimeMillis > 1000) {
      performance = 'poor';
    } else if (executionStats.executionTimeMillis > 500) {
      performance = 'fair';
    } else if (executionStats.executionTimeMillis > 100) {
      performance = 'good';
    }

    const metrics: QueryAnalysis['metrics'] = {
      executionTime: executionStats.executionTimeMillis,
      documentsExamined: executionStats.totalDocsExamined,
      documentsReturned: executionStats.nReturned,
      keysExamined: executionStats.totalKeysExamined,
      indexHit: !isTableScan,
      efficiency,
    };

    return {
      isOptimal: issues.length === 0 && performance === 'excellent',
      performance,
      issues,
      metrics,
    };
  }

  private optimizeQueryStructure(query: any): { 
    query: any; 
    improvements: QueryOptimization['improvements'] 
  } {
    const improvements: QueryOptimization['improvements'] = [];
    let optimizedQuery = { ...query };

    // Convert complex $or operations to $in where possible
    if (optimizedQuery.$or && Array.isArray(optimizedQuery.$or)) {
      const orOptimization = this.optimizeOrToIn(optimizedQuery.$or);
      if (orOptimization) {
        optimizedQuery = orOptimization.query;
        improvements.push(orOptimization.improvement);
      }
    }

    // Optimize regex queries
    for (const [field, value] of Object.entries(optimizedQuery)) {
      if (value && typeof value === 'object' && value.$regex) {
        const regexOptimization = this.optimizeRegex(field, value);
        if (regexOptimization) {
          optimizedQuery[field] = regexOptimization.value;
          improvements.push(regexOptimization.improvement);
        }
      }
    }

    return { query: optimizedQuery, improvements };
  }

  private optimizeOrToIn(orConditions: any[]): {
    query: any;
    improvement: QueryOptimization['improvements'][0];
  } | null {
    // Check if all conditions are equality checks on the same field
    const firstCondition = orConditions[0];
    if (!firstCondition || typeof firstCondition !== 'object') {
      return null;
    }

    const fields = Object.keys(firstCondition);
    if (fields.length !== 1) {
      return null;
    }

    const field = fields[0];
    const values: any[] = [];

    for (const condition of orConditions) {
      if (!condition || typeof condition !== 'object' || Object.keys(condition).length !== 1) {
        return null;
      }
      
      if (!(field in condition) || typeof condition[field] === 'object') {
        return null;
      }
      
      values.push(condition[field]);
    }

    return {
      query: { [field]: { $in: values } },
      improvement: {
        type: 'query_structure',
        description: `Converted $or with ${orConditions.length} equality conditions to $in operator`,
        impact: 'medium',
        before: { $or: orConditions },
        after: { [field]: { $in: values } },
      },
    };
  }

  private optimizeRegex(field: string, value: any): {
    value: any;
    improvement: QueryOptimization['improvements'][0];
  } | null {
    const regex = value.$regex;
    
    // Check if regex can be optimized to a prefix search
    if (typeof regex === 'string' && regex.startsWith('^') && !regex.includes('|') && !regex.includes('*') && !regex.includes('+')) {
      const prefix = regex.slice(1); // Remove ^
      
      return {
        value: {
          $gte: prefix,
          $lt: prefix + '\uffff',
        },
        improvement: {
          type: 'query_structure',
          description: `Converted regex prefix search to range query for better index usage`,
          impact: 'high',
          before: value,
          after: { $gte: prefix, $lt: prefix + '\uffff' },
        },
      };
    }

    return null;
  }

  private optimizeProjection(collection: string, query: any): {
    projection: any;
    improvement: QueryOptimization['improvements'][0];
  } | null {
    // This is a simplified version - in practice, you'd analyze the schema
    // and common usage patterns to determine optimal projections
    return null;
  }

  private optimizeSort(collection: string, query: any, sort: any): {
    sort: any;
    improvement: QueryOptimization['improvements'][0];
  } | null {
    // Analyze if sort can be optimized with existing indexes
    return null;
  }

  private optimizeLimit(analysis: QueryAnalysis): {
    limit: number;
    improvement: QueryOptimization['improvements'][0];
  } | null {
    if (analysis.metrics.documentsReturned > 100) {
      return {
        limit: 100,
        improvement: {
          type: 'limit',
          description: 'Added reasonable limit to prevent large result sets',
          impact: 'medium',
          before: undefined,
          after: 100,
        },
      };
    }

    return null;
  }

  private calculateImprovement(original: number, optimized: number): number {
    if (original === 0) return 0;
    return Math.max(0, ((original - optimized) / original) * 100);
  }

  private generateCacheKey(collection: string, query: any, options: any): string {
    return `${collection}_${JSON.stringify(query)}_${JSON.stringify(options)}`;
  }

  private analyzeQueryPatterns(collection: string): Array<{
    query: any;
    frequency: number;
    avgExecutionTime: number;
  }> {
    // Analyze cached query patterns
    const patterns: Array<{
      query: any;
      frequency: number;
      avgExecutionTime: number;
    }> = [];

    // This would analyze actual query patterns from the metrics
    // For now, return empty array
    return patterns;
  }

  private async createIndexRecommendation(
    collection: string,
    pattern: { query: any; frequency: number; avgExecutionTime: number }
  ): Promise<IndexRecommendation | null> {
    // Create index recommendation based on query pattern
    const fields = Object.keys(pattern.query).map(field => ({
      field,
      direction: 1 as const,
    }));

    if (fields.length === 0) {
      return null;
    }

    return {
      collection,
      fields,
      type: fields.length === 1 ? 'single' : 'compound',
      reason: `Frequently queried fields with ${pattern.frequency} occurrences and ${pattern.avgExecutionTime}ms average execution time`,
      impact: pattern.avgExecutionTime > 1000 ? 'high' : pattern.avgExecutionTime > 500 ? 'medium' : 'low',
      priority: Math.round(pattern.frequency * (pattern.avgExecutionTime / 100)),
      estimatedSize: fields.length * 1024, // Rough estimate
      createStatement: `db.${collection}.createIndex(${JSON.stringify(
        fields.reduce((spec, field) => {
          spec[field.field] = field.direction;
          return spec;
        }, {} as any)
      )})`,
      queryPatterns: [pattern],
    };
  }

  private async getCommonIndexRecommendations(collection: string): Promise<IndexRecommendation[]> {
    // Return common index recommendations based on best practices
    return [];
  }

  // Clean up cache to prevent memory leaks
  cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp.getTime() > maxAge) {
        this.queryCache.delete(key);
      }
    }

    // Clear index recommendation cache
    this.indexRecommendations.clear();
  }
}