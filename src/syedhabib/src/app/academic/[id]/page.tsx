'use client';

import { academicWorks, type AcademicWork } from '@/data/academic-works';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  ExternalLink, 
  Download,
  FileText,
  Award,
  Target,
  Lightbulb,
  ArrowLeft,
  Share2,
  BookOpen,
  Presentation
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AcademicWorkDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AcademicWorkDetailPage({ params }: AcademicWorkDetailPageProps) {
  const [work, setWork] = useState<AcademicWork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWork = async () => {
      const { id } = await params;
      const foundWork = academicWorks.find(w => w.id === id);
      
      if (!foundWork) {
        notFound();
      }
      
      setWork(foundWork);
      setLoading(false);
    };

    loadWork();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!work) {
    notFound();
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'term-paper':
        return FileText;
      case 'presentation':
        return Presentation;
      case 'research':
        return BookOpen;
      default:
        return Target;
    }
  };

  const TypeIcon = getTypeIcon(work.type);

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild>
            <Link href="/academic">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Academic Work
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-6">
                {work.coverImage ? (
                  <Image
                    src={work.coverImage}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <TypeIcon className="w-24 h-24 text-primary/60" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-black/70 text-white">
                    {work.type.replace('-', ' ')}
                  </Badge>
                  {work.grade && (
                    <Badge className="bg-green-500 text-white">
                      {work.grade}
                    </Badge>
                  )}
                  {work.featured && (
                    <Badge className="bg-yellow-500 text-black">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title and Description */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {work.title}
              </h1>
              <p className="text-xl text-primary font-medium mb-4">{work.subject}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {work.description}
              </p>
            </div>

            {/* Sidebar - Project Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Project Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{work.semester}, {work.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{work.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    {work.workType === 'group' ? <Users className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
                    <span className="capitalize">{work.workType} Work</span>
                  </div>

                  {work.grade && (
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span>Grade: {work.grade}</span>
                    </div>
                  )}

                  {work.myRole && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium mb-1">My Role:</p>
                      <p className="text-sm text-muted-foreground">{work.myRole}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Files and Links */}
              {work.files.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Files & Documents
                  </h3>
                  
                  <div className="space-y-3">
                    {work.files.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          <div className="text-left flex-1">
                            <div className="font-medium">{file.name}</div>
                            {file.description && (
                              <div className="text-xs text-muted-foreground">{file.description}</div>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Presentation Details */}
              {work.presentationDetails && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Presentation className="w-5 h-5" />
                    Presentation Info
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Duration:</span> {work.presentationDetails.duration}</div>
                    <div><span className="font-medium">Audience:</span> {work.presentationDetails.audience}</div>
                    {work.presentationDetails.location && (
                      <div><span className="font-medium">Location:</span> {work.presentationDetails.location}</div>
                    )}
                    {work.presentationDetails.slidesCount && (
                      <div><span className="font-medium">Slides:</span> {work.presentationDetails.slidesCount}</div>
                    )}
                  </div>
                </Card>
              )}

              {/* Share */}
              <Card className="p-6">
                <Button variant="outline" className="w-full" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Objectives */}
        {work.objectives && work.objectives.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Project Objectives
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {work.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{objective}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>
        )}

        {/* Methodology */}
        {work.methodology && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary" />
                Methodology & Approach
              </h2>
              
              <p className="text-muted-foreground leading-relaxed">{work.methodology}</p>
            </Card>
          </motion.section>
        )}

        {/* Key Findings */}
        {work.keyFindings && work.keyFindings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Key Findings & Results
              </h2>
              
              <div className="space-y-4">
                {work.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-primary/30 bg-primary/5">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>
        )}

        {/* Images Gallery */}
        {work.images && work.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {work.images.map((image, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {image.caption && (
                    <p className="text-sm text-muted-foreground">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills and Tools */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Skills Demonstrated</h3>
              <div className="flex flex-wrap gap-2">
                {work.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Tools */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {work.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="px-3 py-1">
                    {tool}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Tags */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* Related Work / Navigation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Explore More Academic Work</h3>
            <p className="text-muted-foreground mb-6">
              Discover other projects and research papers from my academic journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/academic">
                  <BookOpen className="w-5 h-5 mr-2" />
                  View All Academic Work
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  <Target className="w-5 h-5 mr-2" />
                  Professional Projects
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
