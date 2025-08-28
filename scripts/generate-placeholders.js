const fs = require('fs').promises;
const path = require('path');

// SVG template for placeholder images
const createSVG = (width, height, text, bgColor = '#1B365D', textColor = '#ffffff') => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        fill="${textColor}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
    ${text}
  </text>
</svg>`;

// Image definitions
const images = [
  // OG Images
  { path: 'og-image.jpg', width: 1200, height: 630, text: 'WebCloudor - AI-First Web Development', type: 'jpg' },
  
  // Team images
  { path: 'images/team/team-hero.jpg', width: 800, height: 600, text: 'WebCloudor Team', type: 'jpg' },
  { path: 'images/team/delwer-hossain.jpg', width: 400, height: 400, text: 'Delwer Hossain', type: 'jpg' },
  { path: 'images/team/ahsan-habib-akik.jpg', width: 400, height: 400, text: 'Ahsan Habib Akik', type: 'jpg' },
  { path: 'images/team/team-og.jpg', width: 1200, height: 630, text: 'WebCloudor Team Page', type: 'jpg' },
  { path: 'images/team/team-twitter.jpg', width: 1200, height: 630, text: 'Meet the WebCloudor Team', type: 'jpg' },
  
  // Team outside work images
  { path: 'images/team/learning-together.jpg', width: 600, height: 400, text: 'Learning Together', type: 'jpg' },
  { path: 'images/team/community-building.jpg', width: 600, height: 400, text: 'Community Building', type: 'jpg' },
  { path: 'images/team/knowledge-sharing.jpg', width: 600, height: 400, text: 'Knowledge Sharing', type: 'jpg' },
  { path: 'images/team/team-building.jpg', width: 600, height: 400, text: 'Team Building', type: 'jpg' },
  { path: 'images/team/conference-speaking.jpg', width: 600, height: 400, text: 'Conference Speaking', type: 'jpg' },
  { path: 'images/team/meetup-organizing.jpg', width: 600, height: 400, text: 'Meetup Organizing', type: 'jpg' },
  { path: 'images/team/team-collaboration.jpg', width: 600, height: 400, text: 'Team Collaboration', type: 'jpg' },
  { path: 'images/team/learning-sessions.jpg', width: 600, height: 400, text: 'Learning Sessions', type: 'jpg' },
  
  // About images
  { path: 'images/about/team-hero.jpg', width: 800, height: 600, text: 'About WebCloudor', type: 'jpg' },
  { path: 'images/about/team-og.jpg', width: 1200, height: 630, text: 'About WebCloudor', type: 'jpg' },
  { path: 'images/about/team-twitter.jpg', width: 1200, height: 630, text: 'About WebCloudor', type: 'jpg' },
  { path: 'images/about/delwer-hossain.jpg', width: 400, height: 400, text: 'Delwer Hossain', type: 'jpg' },
  { path: 'images/about/ahsan-habib-akik.jpg', width: 400, height: 400, text: 'Ahsan Habib Akik', type: 'jpg' },
  { path: 'images/about/delwer-hossain-sm.jpg', width: 200, height: 200, text: 'DH', type: 'jpg' },
  { path: 'images/about/ahsan-habib-akik-sm.jpg', width: 200, height: 200, text: 'AHA', type: 'jpg' },
  { path: 'images/about/office-workspace.jpg', width: 600, height: 400, text: 'Office Workspace', type: 'jpg' },
  { path: 'images/about/office-collaboration.jpg', width: 600, height: 400, text: 'Office Collaboration', type: 'jpg' },
  { path: 'images/about/office-overview.jpg', width: 800, height: 600, text: 'Office Overview', type: 'jpg' },
  
  // Services images
  { path: 'images/services/services-og.jpg', width: 1200, height: 630, text: 'WebCloudor Services', type: 'jpg' },
  { path: 'images/services/services-twitter.jpg', width: 1200, height: 630, text: 'Our Web Development Services', type: 'jpg' },
  
  // Testimonial images
  { path: 'images/testimonials/sarah-chen.jpg', width: 300, height: 300, text: 'Sarah Chen', type: 'jpg', bgColor: '#4F46E5' },
  { path: 'images/testimonials/marcus-rodriguez.jpg', width: 300, height: 300, text: 'Marcus Rodriguez', type: 'jpg', bgColor: '#059669' },
  { path: 'images/testimonials/jennifer-liu.jpg', width: 300, height: 300, text: 'Jennifer Liu', type: 'jpg', bgColor: '#DC2626' },
  
  // Company logos (SVG format)
  { path: 'images/companies/retailcorp.svg', width: 200, height: 80, text: 'RetailCorp', type: 'svg', bgColor: '#ffffff', textColor: '#1B365D' },
  { path: 'images/companies/techstartup.svg', width: 200, height: 80, text: 'TechStartup', type: 'svg', bgColor: '#ffffff', textColor: '#1B365D' },
  { path: 'images/companies/scaleup.svg', width: 200, height: 80, text: 'ScaleUp', type: 'svg', bgColor: '#ffffff', textColor: '#1B365D' },
];

async function generatePlaceholders() {
  const baseDir = path.join(__dirname, '..', 'public');
  
  console.log('🖼️  Generating placeholder images...\n');
  
  for (const img of images) {
    const filePath = path.join(baseDir, img.path);
    const dir = path.dirname(filePath);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dir, { recursive: true });
    
    // Create SVG content
    const svgContent = createSVG(
      img.width, 
      img.height, 
      img.text,
      img.bgColor || '#1B365D',
      img.textColor || '#ffffff'
    );
    
    // Write file
    await fs.writeFile(filePath, svgContent.trim());
    console.log(`✅ Created: ${img.path} (${img.width}x${img.height})`);
  }
  
  console.log(`\n🎉 Generated ${images.length} placeholder images successfully!`);
  console.log('\n📝 Note: These are placeholder images with SVG format.');
  console.log('   Replace them with actual photos/graphics before production deployment.');
}

// Run the generator
generatePlaceholders().catch(console.error);