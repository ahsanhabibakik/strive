'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Heart, 
  Brain, 
  Zap, 
  Camera,
  Link,
  FileText,
  Video,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

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
}

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSubmit: (progressData: any) => Promise<void>;
  isLoading?: boolean;
}

const progressTypes = [
  { value: 'update', label: 'Regular Update', icon: TrendingUp },
  { value: 'milestone', label: 'Milestone Achievement', icon: Target },
  { value: 'achievement', label: 'Major Achievement', icon: CheckCircle2 },
  { value: 'setback', label: 'Setback/Challenge', icon: AlertCircle }
];

const moodOptions = [
  { value: 'excellent', label: 'Excellent', emoji: '😄', color: 'text-green-600' },
  { value: 'good', label: 'Good', emoji: '😊', color: 'text-blue-600' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-gray-600' },
  { value: 'poor', label: 'Poor', emoji: '😔', color: 'text-orange-600' },
  { value: 'terrible', label: 'Terrible', emoji: '😢', color: 'text-red-600' }
];

export function ProgressModal({
  isOpen,
  onClose,
  goal,
  onSubmit,
  isLoading = false
}: ProgressModalProps) {
  const [formData, setFormData] = useState({
    type: 'update',
    title: '',
    currentValue: goal?.measurable.currentValue || 0,
    notes: '',
    difficulty: [3],
    confidence: [3],
    motivation: [3],
    mood: 'neutral',
    timeSpent: '',
    challenges: '',
    lessons: '',
    nextSteps: [''],
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStepChange = (index: number, value: string) => {
    const newNextSteps = [...formData.nextSteps];
    newNextSteps[index] = value;
    setFormData(prev => ({ ...prev, nextSteps: newNextSteps }));
  };

  const addNextStep = () => {
    setFormData(prev => ({
      ...prev,
      nextSteps: [...prev.nextSteps, '']
    }));
  };

  const removeNextStep = (index: number) => {
    const newNextSteps = formData.nextSteps.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      nextSteps: newNextSteps.length > 0 ? newNextSteps : ['']
    }));
  };

  const calculateNewProgress = () => {
    if (!goal) return 0;
    return Math.min(Math.round((formData.currentValue / goal.measurable.targetValue) * 100), 100);
  };

  const getProgressChange = () => {
    if (!goal) return 0;
    return formData.currentValue - goal.measurable.currentValue;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Progress title is required';
    }

    if (formData.currentValue < 0) {
      newErrors.currentValue = 'Current value cannot be negative';
    }

    if (goal && formData.currentValue > goal.measurable.targetValue) {
      newErrors.currentValue = `Value cannot exceed target (${goal.measurable.targetValue})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !goal) return;

    const progressData = {
      goalId: goal._id,
      type: formData.type,
      title: formData.title,
      currentValue: formData.currentValue,
      notes: formData.notes,
      difficulty: formData.difficulty[0],
      confidence: formData.confidence[0],
      motivation: formData.motivation[0],
      mood: formData.mood,
      timeSpent: formData.timeSpent ? parseInt(formData.timeSpent) : undefined,
      challenges: formData.challenges,
      lessons: formData.lessons,
      nextSteps: formData.nextSteps.filter(step => step.trim()),
      attachments: formData.attachments
    };

    try {
      await onSubmit(progressData);
      handleClose();
    } catch (error) {
      console.error('Error submitting progress:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'update',
      title: '',
      currentValue: goal?.measurable.currentValue || 0,
      notes: '',
      difficulty: [3],
      confidence: [3],
      motivation: [3],
      mood: 'neutral',
      timeSpent: '',
      challenges: '',
      lessons: '',
      nextSteps: [''],
      attachments: []
    });
    setErrors({});
    onClose();
  };

  if (!goal) return null;

  const newProgress = calculateNewProgress();
  const progressChange = getProgressChange();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Update Progress: {goal.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Progress</span>
              <span className="text-sm text-gray-600">
                {formData.currentValue} / {goal.measurable.targetValue} {goal.measurable.unit}
              </span>
            </div>
            <Progress value={newProgress} className="h-2 mb-2" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">{newProgress}% complete</span>
              {progressChange !== 0 && (
                <Badge variant={progressChange > 0 ? 'default' : 'destructive'} className="text-xs">
                  {progressChange > 0 ? '+' : ''}{progressChange} {goal.measurable.unit}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Type and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Progress Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {progressTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value *</Label>
              <div className="relative">
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value) || 0)}
                  min="0"
                  max={goal.measurable.targetValue}
                  step="0.1"
                  className={errors.currentValue ? 'border-red-500' : ''}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {goal.measurable.unit}
                </span>
              </div>
              {errors.currentValue && (
                <p className="text-sm text-red-500">{errors.currentValue}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Progress Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Describe what you accomplished or worked on..."
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Progress Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Share details about your progress, what went well, what you learned..."
              rows={3}
            />
          </div>

          {/* Time and Mood */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="timeSpent"
                  type="number"
                  value={formData.timeSpent}
                  onChange={(e) => handleInputChange('timeSpent', e.target.value)}
                  placeholder="How many minutes?"
                  className="pl-10"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">How are you feeling?</Label>
              <Select value={formData.mood} onValueChange={(value) => handleInputChange('mood', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map(mood => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <div className="flex items-center gap-2">
                        <span>{mood.emoji}</span>
                        <span className={mood.color}>{mood.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            <h4 className="font-medium">Rate Your Experience</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Difficulty
                  </Label>
                  <span className="text-sm text-gray-600">{formData.difficulty[0]}/5</span>
                </div>
                <Slider
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very Easy</span>
                  <span>Very Hard</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    Confidence
                  </Label>
                  <span className="text-sm text-gray-600">{formData.confidence[0]}/5</span>
                </div>
                <Slider
                  value={formData.confidence}
                  onValueChange={(value) => handleInputChange('confidence', value)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Not Confident</span>
                  <span>Very Confident</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Motivation
                  </Label>
                  <span className="text-sm text-gray-600">{formData.motivation[0]}/5</span>
                </div>
                <Slider
                  value={formData.motivation}
                  onValueChange={(value) => handleInputChange('motivation', value)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Not Motivated</span>
                  <span>Very Motivated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Challenges and Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challenges">Challenges Faced</Label>
              <Textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => handleInputChange('challenges', e.target.value)}
                placeholder="What obstacles did you encounter?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessons">Lessons Learned</Label>
              <Textarea
                id="lessons"
                value={formData.lessons}
                onChange={(e) => handleInputChange('lessons', e.target.value)}
                placeholder="What did you learn from this experience?"
                rows={3}
              />
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-2">
            <Label>Next Steps</Label>
            <div className="space-y-2">
              {formData.nextSteps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step}
                    onChange={(e) => handleNextStepChange(index, e.target.value)}
                    placeholder={`Next step ${index + 1}...`}
                    className="flex-1"
                  />
                  {formData.nextSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNextStep(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNextStep}
                className="w-full"
              >
                Add Next Step
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}