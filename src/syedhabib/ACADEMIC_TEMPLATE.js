/*
ACADEMIC WORK TEMPLATE
======================

Copy this template and fill in your details, then add to academic-works.ts

const newAcademicWork = {
  id: 'your-project-id', // Use kebab-case, e.g., 'marketing-research-2024'
  title: 'Your Project Title',
  subject: 'Subject Name',
  semester: '5th Semester', // Update this
  year: '2024', // Current year
  type: 'term-paper', // Options: 'term-paper', 'presentation', 'assignment', 'project', 'research', 'case-study', 'design'
  workType: 'individual', // Options: 'individual' or 'group'
  myRole: 'For group work only - describe your specific role and contributions',
  description: 'Brief description of what this project is about and what you accomplished.',
  
  objectives: [
    'First objective you aimed to achieve',
    'Second objective',
    'Third objective',
    // Add more as needed
  ],
  
  methodology: 'Describe your approach - how you conducted research, what methods you used, etc.',
  
  keyFindings: [
    'Important finding or result #1',
    'Important finding or result #2', 
    'Important finding or result #3',
    // Add more key results
  ],
  
  skills: ['Skill 1', 'Skill 2', 'Skill 3'], // Skills you demonstrated or learned
  tools: ['Tool 1', 'Tool 2', 'Tool 3'], // Software, frameworks, methodologies used
  
  // Images - add your actual image paths
  coverImage: '/images/academic/your-cover-image.jpg', // Main preview image
  images: [
    {
      url: '/images/academic/your-slide1.jpg',
      alt: 'Description of this image',
      caption: 'Optional caption explaining what this shows'
    },
    {
      url: '/images/academic/your-slide2.jpg', 
      alt: 'Description of this image',
      caption: 'Optional caption'
    }
    // Add more images as needed
  ],
  
  // Files and documents
  files: [
    {
      type: 'pdf', // Options: 'pdf', 'ppt', 'doc', 'excel', 'other'
      name: 'Your Paper Title.pdf',
      url: 'https://drive.google.com/file/d/your-file-id/view',
      description: 'Complete research paper with analysis and recommendations'
    },
    {
      type: 'ppt',
      name: 'Presentation Slides.pptx', 
      url: 'https://drive.google.com/file/d/your-file-id/view',
      description: 'Presentation slides used for class presentation'
    }
    // Add more files as needed
  ],
  
  tags: ['tag1', 'tag2', 'tag3'], // Keywords for search and filtering
  grade: 'A+', // Optional - your grade/score
  duration: '4 weeks', // How long the project took
  createdAt: '2024-03-15', // Date when you completed it (YYYY-MM-DD)
  featured: true, // Set to true for your best work
  
  // Optional - only for presentations
  presentationDetails: {
    duration: '15 minutes',
    audience: 'Class description (e.g., "25 students + professor")',
    location: 'Where you presented',
    slidesCount: 18 // Number of slides
  }
};

QUICK SETUP GUIDE:
==================

1. **Prepare Your Files:**
   - Upload your PDF, PowerPoint, etc. to Google Drive
   - Get shareable links (make sure they're viewable by anyone with the link)
   - Take screenshots of key slides/pages for the image gallery

2. **Add Images:**
   - Create folder: /public/images/academic/
   - Add your cover image and slide screenshots
   - Use descriptive filenames

3. **Copy & Customize:**
   - Copy this template
   - Fill in all your details
   - Update the file paths and links
   - Add to the academicWorks array in academic-works.ts

4. **Categories to Use:**
   - Types: 'term-paper', 'presentation', 'case-study', 'research', 'design', 'project', 'assignment'
   - Skills: Research, Analysis, Design, Presentation, etc.
   - Tools: PowerPoint, Excel, Figma, SPSS, etc.
   - Tags: Short keywords for easy searching

5. **Tips:**
   - Set featured: true for your 2-3 best works
   - Use clear, descriptive titles
   - Include quantifiable results in keyFindings
   - Add your specific role for group projects

EXAMPLE WORKFLOW:
================

1. Complete your term paper/presentation
2. Upload files to Google Drive and get sharing links
3. Take screenshots of key slides or pages
4. Copy the template above
5. Fill in all your details
6. Add images to /public/images/academic/
7. Add the new object to academicWorks array in src/data/academic-works.ts
8. The work will automatically appear on your portfolio!

*/
