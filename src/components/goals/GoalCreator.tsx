'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Plus, 
  X, 
  Target, 
  Clock, 
  Users, 
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Milestone {
  title: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
}

interface GoalFormData {
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'financial' | 'education' | 'relationships' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  specific: string;
  measurable: {
    metric: string;
    targetValue: number;
    unit: string;
  };
  achievable: boolean;
  relevant: string;
  timeBound: {
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
  };
  isPublic: boolean;
  tags: string[];
}

interface GoalCreatorProps {
  initialData?: Partial<GoalFormData>;
  isEditing?: boolean;
  onSubmit?: (data: GoalFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const categories = [
  { value: 'personal', label: 'Personal', color: 'bg-blue-500' },
  { value: 'professional', label: 'Professional', color: 'bg-green-500' },
  { value: 'health', label: 'Health & Fitness', color: 'bg-red-500' },
  { value: 'financial', label: 'Financial', color: 'bg-yellow-500' },
  { value: 'education', label: 'Education', color: 'bg-purple-500' },
  { value: 'relationships', label: 'Relationships', color: 'bg-pink-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' }
];

const priorities = [
  { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
  { value: 'medium', label: 'Medium Priority', color: 'text-blue-600' },
  { value: 'high', label: 'High Priority', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical Priority', color: 'text-red-600' }
];

export function GoalCreator({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  isLoading = false
}: GoalCreatorProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    specific: '',
    measurable: {
      metric: '',
      targetValue: 0,
      unit: ''
    },
    achievable: true,
    relevant: '',
    timeBound: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      milestones: []
    },
    isPublic: false,
    tags: [],
    ...initialData
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentMilestone, setCurrentMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    targetDate: new Date(),
    completed: false
  });
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!formData.specific.trim()) {
      newErrors.specific = 'Specific description is required';
    }

    if (!formData.measurable.metric.trim()) {
      newErrors['measurable.metric'] = 'Metric is required';
    }

    if (formData.measurable.targetValue <= 0) {
      newErrors['measurable.targetValue'] = 'Target value must be greater than 0';
    }

    if (!formData.measurable.unit.trim()) {
      newErrors['measurable.unit'] = 'Unit is required';
    }

    if (!formData.relevant.trim()) {
      newErrors.relevant = 'Relevance explanation is required';
    }

    if (formData.timeBound.startDate >= formData.timeBound.endDate) {
      newErrors['timeBound.endDate'] = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof GoalFormData],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof GoalFormData],
            [keys[1]]: {
              ...(prev[keys[0] as keyof GoalFormData] as any)[keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddMilestone = () => {
    if (currentMilestone.title && currentMilestone.targetDate) {
      const milestone: Milestone = {
        title: currentMilestone.title,
        description: currentMilestone.description || '',
        targetDate: currentMilestone.targetDate,
        completed: false
      };

      setFormData(prev => ({
        ...prev,
        timeBound: {
          ...prev.timeBound,
          milestones: [...prev.timeBound.milestones, milestone]
        }
      }));

      setCurrentMilestone({ title: '', description: '', targetDate: new Date(), completed: false });
      setShowMilestoneForm(false);
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      timeBound: {
        ...prev.timeBound,
        milestones: prev.timeBound.milestones.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting goal:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {isEditing ? 'Edit Goal' : 'Create New Goal'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What do you want to achieve?"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide more details about your goal..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={priority.color}>{priority.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
                <Label htmlFor="isPublic">Make this goal public</Label>
              </div>
            </div>
          </div>

          {/* SMART Goal Framework */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SMART Goal Framework</h3>
            
            {/* Specific */}
            <div className="space-y-2">
              <Label htmlFor="specific">
                Specific *
                <span className="text-sm text-gray-500 ml-2">What exactly will you accomplish?</span>
              </Label>
              <Textarea
                id="specific"
                value={formData.specific}
                onChange={(e) => handleInputChange('specific', e.target.value)}
                placeholder="Be as specific as possible about what you want to achieve..."
                rows={3}
                className={errors.specific ? 'border-red-500' : ''}
              />
              {errors.specific && (
                <p className="text-sm text-red-500">{errors.specific}</p>
              )}
            </div>

            {/* Measurable */}
            <div className="space-y-4">
              <Label>Measurable *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric *</Label>
                  <Input
                    id="metric"
                    value={formData.measurable.metric}
                    onChange={(e) => handleInputChange('measurable.metric', e.target.value)}
                    placeholder="What will you measure?"
                    className={errors['measurable.metric'] ? 'border-red-500' : ''}
                  />
                  {errors['measurable.metric'] && (
                    <p className="text-sm text-red-500">{errors['measurable.metric']}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetValue">Target Value *</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.measurable.targetValue}
                    onChange={(e) => handleInputChange('measurable.targetValue', parseInt(e.target.value) || 0)}
                    placeholder="Target number"
                    min="1"
                    className={errors['measurable.targetValue'] ? 'border-red-500' : ''}
                  />
                  {errors['measurable.targetValue'] && (
                    <p className="text-sm text-red-500">{errors['measurable.targetValue']}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    value={formData.measurable.unit}
                    onChange={(e) => handleInputChange('measurable.unit', e.target.value)}
                    placeholder="kg, hours, pages..."
                    className={errors['measurable.unit'] ? 'border-red-500' : ''}
                  />
                  {errors['measurable.unit'] && (
                    <p className="text-sm text-red-500">{errors['measurable.unit']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Achievable */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="achievable"
                  checked={formData.achievable}
                  onCheckedChange={(checked) => handleInputChange('achievable', checked)}
                />
                <Label htmlFor="achievable">
                  I believe this goal is achievable
                  {!formData.achievable && (
                    <AlertCircle className="inline-block h-4 w-4 ml-1 text-orange-500" />
                  )}
                </Label>
              </div>
            </div>

            {/* Relevant */}
            <div className="space-y-2">
              <Label htmlFor="relevant">
                Relevant *
                <span className="text-sm text-gray-500 ml-2">Why is this goal important to you?</span>
              </Label>
              <Textarea
                id="relevant"
                value={formData.relevant}
                onChange={(e) => handleInputChange('relevant', e.target.value)}
                placeholder="Explain why this goal matters and how it aligns with your larger objectives..."
                rows={3}
                className={errors.relevant ? 'border-red-500' : ''}
              />
              {errors.relevant && (
                <p className="text-sm text-red-500">{errors.relevant}</p>
              )}
            </div>

            {/* Time-bound */}
            <div className="space-y-4">
              <Label>Time-bound *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.timeBound.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.timeBound.startDate ? (
                          format(formData.timeBound.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.timeBound.startDate}
                        onSelect={(date) => date && handleInputChange('timeBound.startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.timeBound.endDate && "text-muted-foreground",
                          errors['timeBound.endDate'] && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.timeBound.endDate ? (
                          format(formData.timeBound.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.timeBound.endDate}
                        onSelect={(date) => date && handleInputChange('timeBound.endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors['timeBound.endDate'] && (
                    <p className="text-sm text-red-500">{errors['timeBound.endDate']}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Milestones</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMilestoneForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            {formData.timeBound.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">{milestone.title}</p>
                  {milestone.description && (
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Due: {format(milestone.targetDate, "PPP")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMilestone(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {showMilestoneForm && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Milestone title"
                    value={currentMilestone.title}
                    onChange={(e) => setCurrentMilestone(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentMilestone.targetDate ? (
                          format(currentMilestone.targetDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentMilestone.targetDate}
                        onSelect={(date) => date && setCurrentMilestone(prev => ({ ...prev, targetDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Textarea
                  placeholder="Milestone description (optional)"
                  value={currentMilestone.description}
                  onChange={(e) => setCurrentMilestone(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleAddMilestone}>
                    Add Milestone
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowMilestoneForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Goal' : 'Create Goal'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}