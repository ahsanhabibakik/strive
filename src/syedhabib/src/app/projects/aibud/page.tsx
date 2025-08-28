import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ArrowLeft, Bot, Layers, Palette, Zap, Code2, Globe } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Buddy - Landing Page | Syed Habib Portfolio',
  description: 'Modern AI productivity platform landing page with advanced 3D animations, Ghost CMS integration, and sophisticated UI components.',
}

const technicalFeatures = [
  {
    title: 'Advanced 3D Animations',
    description: 'Three.js integration with interactive 3D elements, particle systems, and complex animation sequences',
    icon: Layers
  },
  {
    title: 'Ghost CMS Integration',
    description: 'Headless CMS setup with server-side rendering, static generation, and rich content processing',
    icon: Code2
  },
  {
    title: 'Modern UI Components',
    description: 'Custom Aceternity-inspired components with advanced hover effects and smooth transitions',
    icon: Palette
  },
  {
    title: 'Performance Optimization',
    description: 'Next.js 15 App Router with optimized loading, code splitting, and Core Web Vitals compliance',
    icon: Zap
  },
  {
    title: 'Interactive Elements',
    description: 'Complex user interactions with canvas animations, mouse tracking, and responsive design',
    icon: Bot
  },
  {
    title: 'Analytics Integration',
    description: 'Google Tag Manager, tracking pixels, and comprehensive user behavior analytics',
    icon: Globe
  }
]

const techStack = [
  'Next.js 15',
  'TypeScript',
  'Three.js',
  'Framer Motion',
  'Ghost CMS',
  'Tailwind CSS',
  'React Syntax Highlighter',
  'DOMPurify',
  'Google Tag Manager',
  '@next/third-parties',
  'React Hook Form',
  'Calendly Integration'
]

const uiComponents = [
  {
    title: 'Aurora Background',
    description: 'Animated gradient backgrounds with complex CSS animations and 60-second loop cycles creating mesmerizing visual effects.'
  },
  {
    title: 'Canvas Reveal Effects',
    description: 'Interactive canvas-based animations that reveal content on hover with particle systems and dynamic color schemes.'
  },
  {
    title: '3D Card Effects',
    description: 'Direction-aware 3D cards with mouse tracking, perspective transforms, and realistic lighting effects.'
  },
  {
    title: 'Tracing Beam',
    description: 'Visual progress indicators with animated SVG paths, gradient effects, and scroll-based animations.'
  },
  {
    title: 'Floating Navigation',
    description: 'Scroll-responsive navigation with smooth transitions, blur effects, and context-aware visibility.'
  },
  {
    title: 'Text Generation Effects',
    description: 'Typewriter-style animations with blur filters, staggered timing, and customizable speed controls.'
  }
]

const businessFeatures = [
  {
    title: 'Agent GG Showcase',
    description: 'Dedicated product pages with interactive demos, feature comparisons, and conversion-optimized layouts.'
  },
  {
    title: 'Blog System',
    description: 'Ghost CMS powered blog with rich content rendering, code syntax highlighting, and SEO optimization.'
  },
  {
    title: 'Lead Generation',
    description: 'Calendly integration, contact forms, and strategic CTAs placed throughout the user journey.'
  },
  {
    title: 'Portfolio Display',
    description: 'Dynamic project showcases with metrics, testimonials, and detailed case studies.'
  }
]

export default function AIBudProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/projects" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl text-white">
                <Bot className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Buddy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Advanced Landing Page with 3D Animations & CMS Integration
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A sophisticated landing page for AI Buddy productivity platform featuring cutting-edge 
              web technologies, 3D animations, and seamless content management integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="https://aibud.ca" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Live Site
                </Link>
              </Button>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Status: Live & Production
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Complexity */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Technical Innovation
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              This project pushed the boundaries of web development with advanced animations, 
              complex UI components, and seamless integrations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {technicalFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Advanced Technology Stack</CardTitle>
                <CardDescription>
                  Cutting-edge web technologies for maximum performance and visual impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* UI Components Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Custom UI Components
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {uiComponents.map((component, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{component.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {component.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Integration */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Business Integration Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {businessFeatures.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Achievements */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Development Achievements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-muted-foreground">Custom Components</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">3D</div>
                  <div className="text-muted-foreground">Animation System</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">CMS</div>
                  <div className="text-muted-foreground">Content Management</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">Performance Score</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Development Highlights */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Key Development Highlights
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Animation Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built a comprehensive animation system using Three.js and Framer Motion with 
                    performance optimizations, memory management, and smooth 60fps animations 
                    across all device types.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Headless CMS Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Implemented Ghost CMS with server-side rendering, static generation, 
                    rich content processing, and fallback systems for maximum reliability 
                    and SEO performance.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Engineering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Achieved optimal Core Web Vitals scores through code splitting, 
                    lazy loading, image optimization, and careful animation performance 
                    tuning without sacrificing visual quality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-600/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Advanced Web Development?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              I specialize in complex web applications with advanced animations, 
              performance optimization, and modern tech stacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Discuss Your Vision
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">
                  Explore More Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}