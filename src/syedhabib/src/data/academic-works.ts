export interface AcademicWork {
  id: string;
  title: string;
  subject: string;
  semester: string;
  year: string;
  type: 'term-paper' | 'presentation' | 'assignment' | 'project' | 'research' | 'case-study' | 'design';
  workType: 'individual' | 'group';
  myRole?: string; // For group work - what was your specific contribution
  description: string;
  objectives: string[]; // What you aimed to achieve
  methodology?: string; // How you approached the problem
  keyFindings?: string[]; // Main results or conclusions
  skills: string[]; // Skills demonstrated/learned
  tools: string[]; // Software, frameworks, methodologies used
  
  // Visual assets
  coverImage?: string; // Main preview image (cover slide, first page, etc.)
  images: {
    url: string;
    alt: string;
    caption?: string;
  }[];
  
  // Documents & Links
  files: {
    type: 'pdf' | 'ppt' | 'doc' | 'excel' | 'other';
    name: string;
    url: string; // Google Drive, OneDrive, etc.
    description?: string;
  }[];
  
  // Metadata
  tags: string[];
  grade?: string; // Optional - your grade/score
  duration: string; // How long the work took
  createdAt: string;
  featured: boolean;
  
  // Optional presentation details
  presentationDetails?: {
    duration: string;
    audience: string;
    location?: string;
    slidesCount?: number;
  };
}

export const academicWorks: AcademicWork[] = [
  // Example entries - replace with your actual work
  {
    id: 'marketing-strategy-tesla',
    title: 'Marketing Strategy Analysis - Tesla Case Study',
    subject: 'Marketing Management',
    semester: '3rd Semester',
    year: '2024',
    type: 'term-paper',
    workType: 'individual',
    description: 'Comprehensive analysis of Tesla\'s marketing strategy including market positioning, target audience, and competitive analysis.',
    objectives: [
      'Analyze Tesla\'s unique marketing approach',
      'Evaluate their digital marketing strategy',
      'Compare with traditional automotive marketing',
      'Provide recommendations for improvement'
    ],
    methodology: 'Mixed-method research approach combining quantitative market data analysis and qualitative brand perception study',
    keyFindings: [
      'Tesla\'s word-of-mouth marketing generates 300% more engagement than traditional ads',
      'Social media presence drives 40% of customer acquisition',
      'Brand loyalty scores 25% higher than industry average'
    ],
    skills: ['Market Research', 'Data Analysis', 'Strategic Planning', 'Presentation Design'],
    tools: ['PowerPoint', 'Excel', 'SPSS', 'Canva'],
    coverImage: '/images/academic/marketing-tesla-cover.jpg',
    images: [
      {
        url: '/images/academic/marketing-tesla-slide1.jpg',
        alt: 'Tesla Marketing Analysis - Market Overview',
        caption: 'Overview of Tesla\'s target market segmentation'
      },
      {
        url: '/images/academic/marketing-tesla-slide2.jpg',
        alt: 'Tesla Marketing Channels Analysis',
        caption: 'Breakdown of Tesla\'s marketing channels and their effectiveness'
      }
    ],
    files: [
      {
        type: 'pdf',
        name: 'Tesla Marketing Strategy Analysis.pdf',
        url: 'https://drive.google.com/file/d/your-file-id/view',
        description: 'Complete research paper with analysis and recommendations'
      },
      {
        type: 'ppt',
        name: 'Tesla Case Study Presentation.pptx',
        url: 'https://drive.google.com/file/d/your-file-id/view',
        description: 'Presentation slides used for class presentation'
      }
    ],
    tags: ['marketing', 'case-study', 'tesla', 'strategy', 'automotive'],
    grade: 'A+',
    duration: '4 weeks',
    createdAt: '2024-03-15',
    featured: true,
    presentationDetails: {
      duration: '15 minutes',
      audience: 'Marketing Management Class (25 students + professor)',
      location: 'University Business School',
      slidesCount: 18
    }
  },
  {
    id: 'financial-dashboard-design',
    title: 'Personal Financial Planning Dashboard',
    subject: 'Financial Management & UI/UX Design',
    semester: '4th Semester',
    year: '2024',
    type: 'design',
    workType: 'group',
    myRole: 'Lead Designer & Frontend Developer - responsible for UI/UX design and interactive prototyping',
    description: 'Interactive dashboard design for personal financial planning with budget tracking, investment analysis, and financial goal setting.',
    objectives: [
      'Design user-friendly financial management interface',
      'Create interactive budget tracking system',
      'Implement data visualization for spending patterns',
      'Develop goal-setting and progress tracking features'
    ],
    methodology: 'User-centered design approach with user interviews, wireframing, prototyping, and usability testing',
    keyFindings: [
      'Users prefer visual charts over numerical tables by 80%',
      'Goal visualization increases saving motivation by 65%',
      'Mobile-first design is essential for daily usage'
    ],
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Financial Analysis', 'Team Leadership'],
    tools: ['Figma', 'Adobe XD', 'Excel', 'Miro', 'InVision'],
    coverImage: '/images/academic/financial-dashboard-cover.jpg',
    images: [
      {
        url: '/images/academic/financial-dashboard-main.jpg',
        alt: 'Main Dashboard View',
        caption: 'Main dashboard showing budget overview and spending categories'
      },
      {
        url: '/images/academic/financial-dashboard-goals.jpg',
        alt: 'Financial Goals Tracking',
        caption: 'Goal setting and progress tracking interface'
      },
      {
        url: '/images/academic/financial-dashboard-mobile.jpg',
        alt: 'Mobile App Design',
        caption: 'Mobile-responsive design for on-the-go financial management'
      }
    ],
    files: [
      {
        type: 'pdf',
        name: 'Financial Dashboard - Design Process.pdf',
        url: 'https://drive.google.com/file/d/your-file-id/view',
        description: 'Complete design documentation including user research and testing results'
      },
      {
        type: 'other',
        name: 'Interactive Prototype (Figma)',
        url: 'https://figma.com/proto/your-prototype-link',
        description: 'Clickable prototype demonstrating all dashboard features'
      }
    ],
    tags: ['finance', 'dashboard', 'ui-ux', 'design', 'budgeting', 'mobile'],
    grade: 'A',
    duration: '6 weeks',
    createdAt: '2024-04-20',
    featured: true
  },
  {
    id: 'ecommerce-business-model',
    title: 'Rural E-commerce Business Model Canvas',
    subject: 'Entrepreneurship & Business Planning',
    semester: '2nd Semester',
    year: '2024',
    type: 'case-study',
    workType: 'group',
    myRole: 'Market Research Lead & Financial Analyst - conducted market analysis and developed financial projections',
    description: 'Complete business model canvas for an innovative e-commerce platform targeting rural markets in Bangladesh.',
    objectives: [
      'Identify opportunities in rural e-commerce market',
      'Develop sustainable business model for rural areas',
      'Create financial projections and funding requirements',
      'Design go-to-market strategy'
    ],
    methodology: 'Primary research through rural market surveys, competitor analysis, and financial modeling',
    keyFindings: [
      'Rural markets show 45% growth potential in e-commerce adoption',
      'Mobile payment solutions are key to rural market penetration',
      'Local partnership model reduces operational costs by 30%'
    ],
    skills: ['Business Planning', 'Market Research', 'Financial Modeling', 'Team Collaboration'],
    tools: ['Business Model Canvas', 'Excel', 'Google Forms', 'Canva'],
    coverImage: '/images/academic/business-canvas-cover.jpg',
    images: [
      {
        url: '/images/academic/business-canvas-overview.jpg',
        alt: 'Complete Business Model Canvas',
        caption: 'Full business model canvas showing all nine building blocks'
      },
      {
        url: '/images/academic/business-market-research.jpg',
        alt: 'Market Research Results',
        caption: 'Key findings from rural market research and surveys'
      }
    ],
    files: [
      {
        type: 'pdf',
        name: 'Rural E-commerce Business Plan.pdf',
        url: 'https://drive.google.com/file/d/your-file-id/view',
        description: 'Complete business plan with market analysis and financial projections'
      },
      {
        type: 'excel',
        name: 'Financial Projections.xlsx',
        url: 'https://drive.google.com/file/d/your-file-id/view',
        description: '5-year financial model with revenue projections and break-even analysis'
      }
    ],
    tags: ['entrepreneurship', 'business-model', 'rural-market', 'ecommerce', 'bangladesh'],
    grade: 'A-',
    duration: '8 weeks',
    createdAt: '2024-02-10',
    featured: false
  }
];

export const subjects = [
  'All Subjects',
  'Marketing Management',
  'Financial Management',
  'Entrepreneurship',
  'Consumer Psychology',
  'Operations Management',
  'Strategic Management',
  'Business Analytics',
  'International Business',
  'Human Resource Management'
];

export const semesters = [
  'All Semesters',
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester'
];

export const workTypes = [
  'All Types',
  'presentation',
  'assignment',
  'project',
  'research',
  'design'
];
