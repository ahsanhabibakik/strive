'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Video,
  ArrowRight,
  Users,
  Target,
  Zap,
  Star,
  Timer,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const callTypes = [
  {
    id: 'quick',
    icon: MessageCircle,
    title: 'Quick Questions',
    duration: '15 min',
    price: 'FREE',
    description: 'Perfect for pricing, timeline, or service questions',
    features: ['Instant answers', 'No commitment', 'Quick guidance'],
    color: 'bg-green-500',
    popular: false,
    savings: null
  },
  {
    id: 'consultation',
    icon: Video,
    title: 'Project Consultation',
    duration: '30 min',
    price: 'FREE',
    description: 'Deep dive into your project needs and get a custom plan',
    features: ['Detailed project discussion', 'Custom strategy', 'Pricing breakdown', 'Timeline planning'],
    color: 'bg-blue-500',
    popular: true,
    savings: 'Save $100+'
  },
  {
    id: 'strategy',
    icon: Target,
    title: 'Business Strategy',
    duration: '60 min',
    price: '$49',
    description: 'Comprehensive business growth and digital strategy session',
    features: ['Complete business analysis', 'Growth roadmap', 'Digital strategy', 'Action plan'],
    color: 'bg-purple-500',
    popular: false,
    savings: 'Worth $200+'
  }
];

const timeSlots = [
  { time: '10:00 AM', available: true, popular: true },
  { time: '2:00 PM', available: true, popular: true },
  { time: '4:00 PM', available: true, popular: false },
  { time: '7:00 PM', available: true, popular: true },
  { time: '8:00 PM', available: true, popular: false }
];

export default function SchedulePage() {
  const [hoveredCall, setHoveredCall] = useState<string | null>(null);

  const handleBookCall = (callType: string) => {
    const selectedType = callTypes.find(type => type.id === callType);
    const message = `Hi Syed! I'd like to book a ${selectedType?.title} (${selectedType?.duration}). When are you available?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/8801518926700?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-6 border border-green-500/20">
            <Gift className="w-4 h-4" />
            Free consultation available
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Let&apos;s Talk About Your Project
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Book a <span className="font-semibold text-green-600">free consultation</span> and discover how I can help 
            bring your ideas to life. No sales pitch - just honest advice and clear next steps.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span>Quick 24hr response</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>50+ successful projects</span>
            </div>
          </div>
        </motion.div>

        {/* Call Types - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Call Type</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg md:text-xl">
            Pick what works best for you - all designed to give you maximum value
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {callTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onMouseEnter={() => setHoveredCall(type.id)}
                onMouseLeave={() => setHoveredCall(null)}
                className="relative"
              >
                <Card className={`p-6 h-full cursor-pointer transition-all duration-300 ${
                  type.popular ? 'ring-2 ring-primary/30 bg-primary/5' : ''
                } ${hoveredCall === type.id ? 'scale-105 shadow-xl' : 'hover:shadow-lg'}`}>
                  
                  {type.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  )}
                  
                  {type.savings && (
                    <Badge variant="secondary" className="absolute -top-3 right-4 bg-green-500 text-white">
                      {type.savings}
                    </Badge>
                  )}

                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${type.color} mb-6 transition-transform ${
                      hoveredCall === type.id ? 'scale-110' : ''
                    }`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                    
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-primary">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{type.duration}</span>
                      </div>
                      <div className={`font-bold text-lg ${type.price === 'FREE' ? 'text-green-600' : 'text-primary'}`}>
                        {type.price}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {type.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {type.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => handleBookCall(type.id)}
                      className={`w-full ${type.color} text-white hover:opacity-90 transition-all duration-300 ${
                        hoveredCall === type.id ? 'scale-105' : ''
                      }`}
                      size="lg"
                    >
                      Book {type.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works - Simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: 'Book Your Call', description: 'Click any button above to instantly book via WhatsApp' },
              { icon: MessageCircle, title: 'We Chat', description: 'Discuss your project, goals, and requirements in detail' },
              { icon: Zap, title: 'Get Results', description: 'Receive a clear plan, timeline, and next steps within 24 hours' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Available Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-16"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Available Times</h3>
              <p className="text-muted-foreground">Generally available Monday-Saturday (Bangladesh Time)</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    slot.available 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  {slot.time}
                  {slot.popular && <span className="ml-1 text-xs">🔥</span>}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => handleBookCall('consultation')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book Now via WhatsApp
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Or <a href="mailto:syedmirhabib@gmail.com" className="text-blue-500 hover:underline">email me</a> your preferred time
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Stop waiting and start building! Every day you delay is a day your competitors get ahead. 
              Let&apos;s discuss your project today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleBookCall('consultation')}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
              
              <Button
                variant="outline"
                className="px-8 py-4 text-lg"
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                Or Use Project Form
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              💡 <strong>Pro tip:</strong> The sooner we start, the sooner you see results!
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}