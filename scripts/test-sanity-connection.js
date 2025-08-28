const { createClient } = require('@sanity/client')

// Load environment variables manually from .env.local
const fs = require('fs')
const path = require('path')
const envPath = path.resolve('.env.local')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.trim().split('=')
    if (key && values.length && !line.startsWith('#')) {
      process.env[key.trim()] = values.join('=').trim()
    }
  })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false
})

async function testConnection() {
  try {
    console.log('Testing Sanity connection...')
    console.log('Project ID:', JSON.stringify(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID))
    console.log('Dataset:', JSON.stringify(process.env.NEXT_PUBLIC_SANITY_DATASET))
    console.log('API Version:', JSON.stringify(process.env.NEXT_PUBLIC_SANITY_API_VERSION))
    console.log('Token length:', process.env.SANITY_API_TOKEN?.length || 'Not set')
    
    // Validate project ID format
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
      throw new Error(`Invalid project ID format: ${JSON.stringify(projectId)}`)
    }
    
    // Test basic connection
    const datasets = await client.datasets.list()
    console.log('✅ Connection successful!')
    console.log('Available datasets:', datasets.map(d => d.name))
    
    // Test document query
    const documents = await client.fetch('*[_type == "blogPost"][0...5]{_id, title}')
    console.log('✅ Query successful!')
    console.log('Sample documents:', documents)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    if (error.statusCode) {
      console.error('Status code:', error.statusCode)
    }
  }
}

testConnection()