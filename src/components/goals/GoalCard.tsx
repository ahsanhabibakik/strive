'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarDays, 
  Target, 
  TrendingUp, 
  Users, 
  MoreVertical,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Collaborator {
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: 'viewer' | 'contributor' | 'editor';
  addedAt: string;
}

interface Milestone {
  title: string;
  description?: string;
  targetDate: string;
  completed: boolean;
  completedAt?: string;
}

interface Goal {
  _id: string;
  title: string;
  description?: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'education' | 'relationships' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
  measurable: {
    metric: string;
    targetValue: number;
    currentValue: number;
    unit: string;
  };
  timeBound: {
    startDate: string;
    endDate: string;
    milestones: Milestone[];
  };
  progressPercentage: number;
  lastUpdated: string;
  isPublic: boolean;
  collaborators: Collaborator[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  daysRemaining?: number;
  isOverdue?: boolean;
}

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onViewDetails?: (goalId: string) => void;
  onUpdateProgress?: (goalId: string) => void;
  onLike?: (goalId: string) => void;
  isLiked?: boolean;
  compact?: boolean;
  showActions?: boolean;
}

const categoryColors = {
  personal: 'bg-blue-500',
  professional: 'bg-green-500',
  health: 'bg-red-500',
  financial: 'bg-yellow-500',
  education: 'bg-purple-500',
  relationships: 'bg-pink-500',
  other: 'bg-gray-500'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onViewDetails,
  onUpdateProgress,
  onLike,
  isLiked = false,
  compact = false,
  showActions = true
}: GoalCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemainingText = () => {
    if (goal.status === 'completed') return 'Completed';
    if (goal.status === 'cancelled') return 'Cancelled';
    if (goal.status === 'paused') return 'Paused';
    
    const daysRemaining = goal.daysRemaining ?? 0;
    if (daysRemaining < 0) return 'Overdue';
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return '1 day left';
    return `${daysRemaining} days left`;
  };

  const getProgressColor = () => {
    if (goal.status === 'completed') return 'bg-emerald-500';
    if (goal.isOverdue) return 'bg-red-500';
    if (goal.progressPercentage >= 75) return 'bg-green-500';
    if (goal.progressPercentage >= 50) return 'bg-blue-500';
    if (goal.progressPercentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const completedMilestones = goal.timeBound.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.timeBound.milestones.length;

  const handleLike = async () => {
    if (onLike && !isLoading) {
      setIsLoading(true);
      try {
        await onLike(goal._id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${compact ? 'p-4' : ''}`}>
      <CardHeader className={`pb-3 ${compact ? 'p-0 pb-2' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${categoryColors[goal.category]}`} />
              <Badge variant="secondary" className={priorityColors[goal.priority]}>
                {goal.priority}
              </Badge>
              <Badge variant="outline" className={statusColors[goal.status]}>
                {goal.status}
              </Badge>
            </div>
            
            <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-1`}>
              {goal.title}
            </CardTitle>
            
            {goal.description && !compact && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {goal.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{getDaysRemainingText()}</span>
              </div>
              {!compact && (
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{goal.measurable.metric}</span>
                </div>
              )}
            </div>
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(goal._id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onUpdateProgress && goal.status === 'active' && (
                  <DropdownMenuItem onClick={() => onUpdateProgress(goal._id)}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Progress
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(goal._id)}>
                    Edit Goal
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(goal._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Goal
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? 'p-0 pt-2' : ''}>
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-gray-600">
                {goal.measurable.currentValue} / {goal.measurable.targetValue} {goal.measurable.unit}
              </span>
            </div>
            <Progress 
              value={goal.progressPercentage} 
              className="h-2"
              style={{
                backgroundColor: '#e5e7eb'
              }}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{goal.progressPercentage}% complete</span>
              {goal.isOverdue && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Overdue</span>
                </div>
              )}
            </div>
          </div>

          {/* Milestones */}
          {!compact && totalMilestones > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Milestones</span>
                <span className="text-gray-600">
                  {completedMilestones} / {totalMilestones}
                </span>
              </div>
              <div className="space-y-1">
                {goal.timeBound.milestones.slice(0, 3).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 
                      className={`h-3 w-3 ${milestone.completed ? 'text-green-500' : 'text-gray-300'}`} 
                    />
                    <span className={milestone.completed ? 'line-through text-gray-500' : ''}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
                {totalMilestones > 3 && (
                  <div className="text-xs text-gray-500 ml-5">
                    +{totalMilestones - 3} more milestones
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              {!compact && (
                <>
                  <button
                    onClick={handleLike}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span>{goal.likeCount}</span>
                  </button>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{goal.commentCount}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{goal.viewCount}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Collaborators */}
              {goal.collaborators.length > 0 && (
                <div className="flex -space-x-1">
                  {goal.collaborators.slice(0, 3).map((collaborator, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={collaborator.userId.avatar} />
                      <AvatarFallback className="text-xs">
                        {collaborator.userId.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {goal.collaborators.length > 3 && (
                    <div className="h-6 w-6 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-xs text-gray-600">
                      +{goal.collaborators.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Last updated */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatDate(goal.lastUpdated)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {!compact && goal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {goal.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {goal.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{goal.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}