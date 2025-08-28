'use client';

import { Star } from 'lucide-react';
import { Card } from './card';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

export default function TestimonialCard({ name, role, company, content, rating, image }: TestimonialCardProps) {
  return (
    <Card className="p-6 h-full">
      <div className="flex items-start space-x-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role} at {company}</p>
        </div>
      </div>
      <div className="flex mt-2 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{content}</p>
    </Card>
  );
} 