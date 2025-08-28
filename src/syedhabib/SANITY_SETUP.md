# Sanity CMS Setup Instructions

## Quick Setup Steps:

1. **Create a Sanity Account:**
   - Go to https://sanity.io/
   - Sign up with GitHub or email

2. **Create a New Project:**
   - Visit https://sanity.io/manage
   - Click "Create new project"
   - Name: "Syed Habib Blog"
   - Dataset: "production"
   - Copy the **Project ID** (looks like: abc123def)

3. **Update Environment Variables:**
   - Open `.env.local` in your project
   - Replace `your-project-id` with your actual Project ID:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=abc123def
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
   ```

4. **Test the Setup:**
   - Run `npm run dev`
   - Visit `http://localhost:3000/studio`
   - You should see the Sanity Studio login

## Alternative CLI Method:
If you have Sanity CLI installed globally:
```bash
npx sanity@latest init
```

## Your Project Configuration:
- **Studio URL:** `http://localhost:3000/studio`
- **Schema:** Blog posts with rich text, images, and code blocks
- **Dataset:** production