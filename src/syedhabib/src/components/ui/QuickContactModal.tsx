'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectType: 'quick-question',
          budget: 'quick-question',
          timeline: 'quick-question'
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch {
      setSubmitError('Message could not be sent. Please try again or contact me directly via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickActions = [
    {
      text: "What's your pricing?",
      action: () => setFormData(prev => ({ 
        ...prev, 
        message: "Hi! I'd like to know about your pricing for website development. Can you give me a rough estimate?" 
      }))
    },
    {
      text: "How long does it take?",
      action: () => setFormData(prev => ({ 
        ...prev, 
        message: "Hi! I'm wondering about typical project timelines. How long does it usually take to complete a website?" 
      }))
    },
    {
      text: "Do you work with students?",
      action: () => setFormData(prev => ({ 
        ...prev, 
        message: "Hi! I'm a student and wondering if you offer student-friendly pricing and if you work with university projects?" 
      }))
    },
    {
      text: "Can you help with...",
      action: () => setFormData(prev => ({ 
        ...prev, 
        message: "Hi! I have a question about whether you can help with " 
      }))
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-6 relative bg-card/50 border border-border/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>

            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-700 mb-2">Message Sent!</h3>
                <p className="text-sm text-green-600">I'll respond within 2 hours.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    <Zap className="w-4 h-4" />
                    Quick Question
                  </div>
                  <h2 className="text-xl font-bold mb-2">Got a Quick Question?</h2>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything! I&apos;ll respond within 2 hours.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="mb-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Quick questions:
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="text-xs h-auto py-2 text-left justify-start"
                      >
                        {action.text}
                      </Button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="quick-name" className="text-sm">Name *</Label>
                      <Input
                        id="quick-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quick-email" className="text-sm">Email *</Label>
                      <Input
                        id="quick-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quick-message" className="text-sm">Your Question *</Label>
                    <Textarea
                      id="quick-message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="What would you like to know?"
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {submitError}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send
                        </span>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    For detailed projects, use the full form instead:
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onClose();
                      window.location.href = '/contact';
                    }}
                    className="text-xs h-auto p-0"
                  >
                    Go to Project Form →
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating Quick Contact Button
export function QuickContactButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <QuickContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
