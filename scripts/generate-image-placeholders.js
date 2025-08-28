const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')

/**
 * Generate blur placeholder data URLs for images
 * This script creates base64-encoded blur placeholder images for better Core Web Vitals
 */

async function generateBlurDataURL(imagePath) {
  try {
    const image = sharp(imagePath)
    const { width, height } = await image.metadata()
    
    // Create a small blurred version
    const buffer = await image
      .resize(10, Math.round(height / width * 10))
      .blur(2)
      .jpeg({ quality: 20 })
      .toBuffer()
    
    const base64 = buffer.toString('base64')
    return `data:image/jpeg;base64,${base64}`
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message)
    return null
  }
}

async function processDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const placeholders = {}
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subPlaceholders = await processDirectory(fullPath)
        Object.assign(placeholders, subPlaceholders)
      } else if (entry.isFile() && imageExtensions.some(ext => 
        entry.name.toLowerCase().endsWith(ext)
      )) {
        console.log(`Processing: ${fullPath}`)
        const placeholder = await generateBlurDataURL(fullPath)
        
        if (placeholder) {
          // Create relative path from public directory
          const relativePath = path.relative(
            path.join(__dirname, '..', 'public'),
            fullPath
          ).replace(/\\/g, '/') // Convert Windows paths to web paths
          
          placeholders[`/${relativePath}`] = placeholder
        }
      }
    }
    
    return placeholders
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message)
    return {}
  }
}

async function main() {
  console.log('🖼️  Generating image placeholders for Core Web Vitals optimization...')
  
  const publicImagesPath = path.join(__dirname, '..', 'public', 'images')
  
  try {
    const placeholders = await processDirectory(publicImagesPath)
    
    // Generate TypeScript file with placeholders
    const tsContent = `// Auto-generated image placeholders for Core Web Vitals optimization
// Generated on: ${new Date().toISOString()}

export const imagePlaceholders: Record<string, string> = ${JSON.stringify(placeholders, null, 2)}

export const getImagePlaceholder = (src: string): string | undefined => {
  return imagePlaceholders[src]
}
`
    
    const outputPath = path.join(__dirname, '..', 'src', 'lib', 'image-placeholders.ts')
    await fs.writeFile(outputPath, tsContent, 'utf8')
    
    console.log(`✅ Generated placeholders for ${Object.keys(placeholders).length} images`)
    console.log(`📁 Output file: ${outputPath}`)
    
    // Also generate a JSON file for reference
    const jsonOutputPath = path.join(__dirname, 'image-placeholders.json')
    await fs.writeFile(jsonOutputPath, JSON.stringify(placeholders, null, 2), 'utf8')
    console.log(`📄 JSON reference: ${jsonOutputPath}`)
    
  } catch (error) {
    console.error('❌ Error generating placeholders:', error.message)
    process.exit(1)
  }
}

// Check if sharp is available
async function checkDependencies() {
  try {
    require.resolve('sharp')
    return true
  } catch (error) {
    console.error('❌ Sharp is required but not installed.')
    console.log('📦 Install it with: npm install --save-dev sharp')
    return false
  }
}

// Run the script
if (require.main === module) {
  checkDependencies().then(hasSharp => {
    if (hasSharp) {
      main().catch(console.error)
    }
  })
}

module.exports = { generateBlurDataURL, getImagePlaceholder: null }