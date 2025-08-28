const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      envVars[key.trim()] = value;
    }
  });
  
  Object.assign(process.env, envVars);
}

// Create Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN // Required for write operations
});

console.log('🚀 Starting Sanity dataset population...');
console.log('Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);

// Helper function to generate Sanity document ID
function generateId(prefix = '') {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
}

// Sample categories to create
const categories = [
  {
    _id: generateId('cat-'),
    _type: 'category',
    title: 'Web Development',
    slug: { _type: 'slug', current: 'web-development' },
    description: 'Modern web development techniques and frameworks',
    color: 'blue',
    icon: 'Code',
    featured: true,
    isActive: true,
    order: 1
  },
  {
    _id: generateId('cat-'),
    _type: 'category',
    title: 'Cloud Computing',
    slug: { _type: 'slug', current: 'cloud-computing' },
    description: 'Cloud architecture and infrastructure solutions',
    color: 'purple',
    icon: 'Cloud',
    featured: true,
    isActive: true,
    order: 2
  },
  {
    _id: generateId('cat-'),
    _type: 'category',
    title: 'AI & Technology',
    slug: { _type: 'slug', current: 'ai-technology' },
    description: 'Artificial Intelligence and emerging technologies',
    color: 'green',
    icon: 'Cpu',
    featured: true,
    isActive: true,
    order: 3
  }
];

// Sample authors to create
const authors = [
  {
    _id: generateId('author-'),
    _type: 'author',
    name: 'Delwer Hossain',
    slug: { _type: 'slug', current: 'delwer-hossain' },
    shortBio: 'Full-stack developer and web architect with expertise in modern JavaScript frameworks.',
    bio: [
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Delwer is a passionate full-stack developer with over 8 years of experience building scalable web applications. He specializes in React, Next.js, and modern web technologies.'
          }
        ]
      }
    ],
    expertise: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Web Architecture'],
    socialLinks: {
      website: 'https://webcloudor.com',
      linkedin: 'https://linkedin.com/in/delwer-hossain',
      github: 'https://github.com/delwerhossain'
    },
    isActive: true,
    featured: true
  },
  {
    _id: generateId('author-'),
    _type: 'author',
    name: 'Ahsan Habib Akik',
    slug: { _type: 'slug', current: 'ahsan-habib-akik' },
    shortBio: 'Cloud architect and DevOps engineer specializing in scalable infrastructure solutions.',
    bio: [
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Syed is a certified cloud architect with extensive experience in AWS, Azure, and Google Cloud. He helps businesses build robust, scalable infrastructure solutions.'
          }
        ]
      }
    ],
    expertise: ['AWS', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Infrastructure as Code'],
    socialLinks: {
      website: 'https://webcloudor.com',
      linkedin: 'https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=ahsanhabibakik'
    },
    isActive: true,
    featured: true
  }
];

// Sample blog posts to create
const blogPosts = [
  {
    _id: generateId('post-'),
    _type: 'blogPost',
    title: 'The Future of Web Development: Next.js 15 and Beyond',
    slug: { _type: 'slug', current: 'future-web-development-nextjs-15' },
    excerpt: 'Explore the latest features in Next.js 15 and how they are shaping the future of modern web development with improved performance and developer experience.',
    content: [
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Next.js 15 represents a significant milestone in web development, introducing groundbreaking features that enhance both developer experience and application performance.'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Key Features in Next.js 15'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'The latest version brings several exciting improvements including enhanced App Router capabilities, improved static generation, and better TypeScript integration.'
          }
        ]
      }
    ],
    publishedAt: '2024-12-15T10:00:00.000Z',
    tags: ['Next.js', 'Web Development', 'React', 'Frontend'],
    readingTime: 5,
    featured: true,
    status: 'published',
    tableOfContents: true,
    viewCount: 0,
    seoTitle: 'Next.js 15: The Future of Web Development',
    seoDescription: 'Discover the latest features in Next.js 15 and how they are revolutionizing modern web development.'
  },
  {
    _id: generateId('post-'),
    _type: 'blogPost', 
    title: 'Cloud Architecture Best Practices for Modern Applications',
    slug: { _type: 'slug', current: 'cloud-architecture-best-practices' },
    excerpt: 'Learn essential cloud architecture patterns and best practices for building scalable, reliable applications that can handle enterprise-level traffic.',
    content: [
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Building scalable cloud applications requires careful architectural planning and adherence to proven best practices. This guide covers essential patterns for modern cloud infrastructure.'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Microservices Architecture'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Implementing microservices architecture allows for better scalability, maintainability, and team autonomy in large-scale applications.'
          }
        ]
      }
    ],
    publishedAt: '2024-12-10T14:30:00.000Z',
    tags: ['Cloud', 'Architecture', 'AWS', 'Scalability'],
    readingTime: 8,
    featured: true,
    status: 'published',
    tableOfContents: true,
    viewCount: 0,
    seoTitle: 'Cloud Architecture Best Practices Guide',
    seoDescription: 'Essential cloud architecture patterns for building scalable, reliable modern applications.'
  },
  {
    _id: generateId('post-'),
    _type: 'blogPost',
    title: 'AI Integration in Web Applications: A Practical Guide',
    slug: { _type: 'slug', current: 'ai-integration-web-applications' },
    excerpt: 'Discover how to effectively integrate AI capabilities into your web applications with practical examples and implementation strategies.',
    content: [
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Artificial Intelligence is transforming web applications, offering new possibilities for user experience and business automation. This guide shows you how to integrate AI effectively.'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Getting Started with AI APIs'
          }
        ]
      },
      {
        _type: 'block',
        _key: generateId('block-'),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: generateId('span-'),
            text: 'Modern AI APIs make it easier than ever to add intelligent features to your web applications, from natural language processing to image recognition.'
          }
        ]
      }
    ],
    publishedAt: '2024-12-05T09:15:00.000Z',
    tags: ['AI', 'Machine Learning', 'Integration', 'APIs'],
    readingTime: 6,
    featured: false,
    status: 'published',
    tableOfContents: true,
    viewCount: 0,
    seoTitle: 'AI Integration in Web Applications Guide',
    seoDescription: 'Learn how to integrate AI capabilities into web applications with practical examples.'
  }
];

async function populateSanity() {
  try {
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const category of categories) {
      try {
        const result = await client.create(category);
        createdCategories.push(result);
        console.log(`✅ Created category: ${category.title}`);
      } catch (error) {
        console.log(`⚠️  Category "${category.title}" might already exist or error occurred:`, error.message);
      }
    }

    console.log('👥 Creating authors...');
    const createdAuthors = [];
    for (const author of authors) {
      try {
        const result = await client.create(author);
        createdAuthors.push(result);
        console.log(`✅ Created author: ${author.name}`);
      } catch (error) {
        console.log(`⚠️  Author "${author.name}" might already exist or error occurred:`, error.message);
      }
    }

    // Wait a moment for categories and authors to be available
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('📝 Creating blog posts...');
    const createdPosts = [];
    
    for (let i = 0; i < blogPosts.length; i++) {
      const post = blogPosts[i];
      
      // Add references to categories and authors
      const categoryRef = createdCategories[i] ? {
        _type: 'reference',
        _ref: createdCategories[i]._id
      } : null;
      
      const authorRef = createdAuthors[i % createdAuthors.length] ? {
        _type: 'reference', 
        _ref: createdAuthors[i % createdAuthors.length]._id
      } : null;

      if (categoryRef) {
        post.categories = [categoryRef];
      }
      
      if (authorRef) {
        post.author = authorRef;
      }

      try {
        const result = await client.create(post);
        createdPosts.push(result);
        console.log(`✅ Created blog post: ${post.title}`);
      } catch (error) {
        console.log(`⚠️  Blog post "${post.title}" might already exist or error occurred:`, error.message);
      }
    }

    console.log('🎉 Population complete!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${createdCategories.length} created`);
    console.log(`   Authors: ${createdAuthors.length} created`);
    console.log(`   Blog Posts: ${createdPosts.length} created`);
    
    console.log('🔍 Verifying data...');
    const [posts, cats, auths] = await Promise.all([
      client.fetch('*[_type == "blogPost"] | order(_createdAt desc) { title, status, featured }'),
      client.fetch('*[_type == "category"] { title }'),
      client.fetch('*[_type == "author"] { name }')
    ]);
    
    console.log(`✅ Verification complete:`);
    console.log(`   Total blog posts in Sanity: ${posts.length}`);
    console.log(`   Total categories in Sanity: ${cats.length}`);
    console.log(`   Total authors in Sanity: ${auths.length}`);
    
    if (posts.length > 0) {
      console.log('📝 Blog posts:');
      posts.forEach(post => console.log(`   - ${post.title} (${post.status}) ${post.featured ? '[FEATURED]' : ''}`));
    }

  } catch (error) {
    console.error('❌ Error during population:', error.message);
    if (error.details) {
      console.error('Error details:', error.details);
    }
    process.exit(1);
  }
}

// Check if we have the required configuration
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ Missing Sanity configuration. Please check your environment variables.');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN. Write operations require an API token.');
  console.error('💡 You can:');
  console.error('   1. Generate a new token in your Sanity project dashboard');
  console.error('   2. Or use the Sanity Studio UI at http://localhost:3000/studio');
  process.exit(1);
}

// Run the population script
populateSanity();