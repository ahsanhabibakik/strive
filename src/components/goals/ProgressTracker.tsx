'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Award,
  Activity,
  Calendar,
  Zap,
  Heart,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Plus
} from 'lucide-react';

interface ProgressEntry {
  _id: string;
  type: 'milestone' | 'update' | 'setback' | 'achievement';
  title: string;
  currentValue: number;
  previousValue: number;
  changeAmount: number;
  changePercentage: number;
  dateRecorded: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  confidence: 1 | 2 | 3 | 4 | 5;
  motivation: 1 | 2 | 3 | 4 | 5;
  mood: 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';
  timeSpent?: number;
  notes?: string;
}

interface ProgressAnalytics {
  summary: {
    totalEntries: number;
    totalTimeSpent: number;
    averageDifficulty: number;
    averageConfidence: number;
    averageMotivation: number;
    improvementEntries: number;
    setbackEntries: number;
    totalProgress: number;
  };
  trends: Array<{
    _id: string;
    entries: number;
    averageProgress: number;
    averageDifficulty: number;
    averageConfidence: number;
    averageMotivation: number;
    totalTimeSpent: number;
  }>;
  mood: Array<{
    _id: string;
    count: number;
    averageProgress: number;
  }>;
}

interface Goal {
  _id: string;
  title: string;
  measurable: {
    metric: string;
    targetValue: number;
    currentValue: number;
    unit: string;
  };
  progressPercentage: number;
  timeBound: {
    startDate: string;
    endDate: string;
  };
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
}

interface ProgressTrackerProps {
  goal: Goal;
  progressEntries: ProgressEntry[];
  analytics: ProgressAnalytics;
  onAddProgress?: () => void;
  onUpdateGoal?: () => void;
  isLoading?: boolean;
}

const moodColors = {
  excellent: '#10B981',
  good: '#3B82F6',
  neutral: '#6B7280',
  poor: '#F59E0B',
  terrible: '#EF4444'
};

const moodIcons = {
  excellent: '😄',
  good: '😊',
  neutral: '😐',
  poor: '😔',
  terrible: '😢'
};

export function ProgressTracker({
  goal,
  progressEntries,
  analytics,
  onAddProgress,
  onUpdateGoal,
  isLoading = false
}: ProgressTrackerProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');

  // Prepare chart data
  const progressChartData = useMemo(() => {
    return analytics.trends.map(trend => ({
      date: new Date(trend._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      progress: Math.round(trend.averageProgress),
      confidence: trend.averageConfidence,
      motivation: trend.averageMotivation,
      difficulty: trend.averageDifficulty,
      timeSpent: trend.totalTimeSpent || 0
    }));
  }, [analytics.trends]);

  const moodChartData = useMemo(() => {
    return analytics.mood.map(mood => ({
      name: mood._id,
      value: mood.count,
      color: moodColors[mood._id as keyof typeof moodColors]
    }));
  }, [analytics.mood]);

  // Calculate streaks and achievements
  const currentStreak = useMemo(() => {
    let streak = 0;
    const sortedEntries = [...progressEntries]
      .sort((a, b) => new Date(b.dateRecorded).getTime() - new Date(a.dateRecorded).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.changeAmount > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [progressEntries]);

  const timeToTarget = useMemo(() => {
    const remaining = goal.measurable.targetValue - goal.measurable.currentValue;
    if (remaining <= 0) return 0;
    
    const recentEntries = progressEntries.slice(-5);
    if (recentEntries.length === 0) return null;
    
    const averageProgress = recentEntries.reduce((sum, entry) => sum + entry.changeAmount, 0) / recentEntries.length;
    if (averageProgress <= 0) return null;
    
    return Math.ceil(remaining / averageProgress);
  }, [goal, progressEntries]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'achievement': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'setback': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Progress</p>
                <p className="text-2xl font-bold text-gray-900">{goal.progressPercentage}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={goal.progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-green-600">{currentStreak}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">consecutive improvements</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Invested</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(analytics.summary.totalTimeSpent / 60) || 0}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">total hours logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Est. Completion</p>
                <p className="text-2xl font-bold text-orange-600">
                  {timeToTarget ? `${timeToTarget} days` : '—'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">at current pace</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progress Analytics</span>
            {onAddProgress && (
              <Button onClick={onAddProgress} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Log Progress
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} ${goal.measurable.unit}`, 
                        name === 'progress' ? 'Progress' : name
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="confidence" fill="#10B981" name="Confidence" />
                    <Bar dataKey="motivation" fill="#3B82F6" name="Motivation" />
                    <Bar dataKey="difficulty" fill="#F59E0B" name="Difficulty" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.summary.averageConfidence.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-gray-600">Avg Confidence</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.summary.averageMotivation.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-gray-600">Avg Motivation</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {analytics.summary.averageDifficulty.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-gray-600">Avg Difficulty</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mood" className="space-y-4">
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center">
                <div className="flex gap-4">
                  {Object.entries(moodColors).map(([mood, color]) => (
                    <div key={mood} className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span>{moodIcons[mood as keyof typeof moodIcons]}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <span className="text-sm capitalize">{mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Achievements
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Improvement Rate</span>
                      <Badge variant="secondary">
                        {Math.round((analytics.summary.improvementEntries / analytics.summary.totalEntries) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">Total Progress</span>
                      <Badge variant="secondary">
                        +{analytics.summary.totalProgress} {goal.measurable.unit}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm">Consistency</span>
                      <Badge variant="secondary">
                        {analytics.summary.totalEntries} entries
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    Recommendations
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {analytics.summary.averageMotivation < 3 && (
                      <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        Consider finding ways to increase motivation - perhaps break down the goal into smaller, more exciting milestones.
                      </div>
                    )}
                    {analytics.summary.averageDifficulty > 4 && (
                      <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                        The difficulty level seems high. Consider simplifying your approach or seeking additional resources/support.
                      </div>
                    )}
                    {currentStreak >= 3 && (
                      <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                        Great momentum! You're on a {currentStreak}-day improvement streak. Keep it up!
                      </div>
                    )}
                    {analytics.summary.setbackEntries > analytics.summary.improvementEntries && (
                      <div className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                        You've had more setbacks than improvements recently. Consider adjusting your strategy or timeline.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Progress Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressEntries.slice(0, 5).map((entry) => (
              <div key={entry._id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getProgressIcon(entry.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{entry.title}</h4>
                    <Badge variant={entry.changeAmount > 0 ? 'default' : 'destructive'} className="text-xs">
                      {entry.changeAmount > 0 ? '+' : ''}{entry.changeAmount} {goal.measurable.unit}
                    </Badge>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mb-2">{entry.notes}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(entry.dateRecorded)}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {entry.motivation}/5
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      {entry.confidence}/5
                    </span>
                    <span>{moodIcons[entry.mood]} {entry.mood}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {progressEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No progress entries yet.</p>
                {onAddProgress && (
                  <Button
                    onClick={onAddProgress}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Log Your First Progress
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}