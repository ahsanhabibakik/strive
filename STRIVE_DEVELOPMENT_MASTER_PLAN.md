# 🚀 STRIVE - Development Master Plan & Implementation Guide

## 📌 Project Context

**Strive** is a global youth opportunity platform where students discover competitions, scholarships, internships, hackathons, and events. Users build portfolios, find teammates, and engage in community discussions.

### Current State Analysis

- **Tech Stack**: Next.js 15 + TypeScript + MongoDB + NextAuth + Tailwind + shadcn/ui ✅
- **Basic Structure**: Landing page, dashboard, auth system, basic components ✅
- **Missing**: All core features (browse opportunities, community, team finder, atlas, etc.)

---

## 🎯 MVP Development Roadmap

### Phase 1: Foundation & Core Data Models (Week 1-2)

**Priority: Critical** | **Complexity: Medium** | **Effort: 3-4 days**

### Phase 2: Browse & Discovery Experience (Week 2-3)

**Priority: Critical** | **Complexity: High** | **Effort: 5-6 days**

### Phase 3: User Profiles & Portfolio System (Week 3-4)

**Priority: High** | **Complexity: Medium** | **Effort: 4-5 days**

### Phase 4: Community & Social Features (Week 4-5)

**Priority: High** | **Complexity: High** | **Effort: 6-7 days**

### Phase 5: Team Finder & Collaboration (Week 5-6)

**Priority: Medium** | **Complexity: Medium** | **Effort: 3-4 days**

### Phase 6: Atlas & Visual Discovery (Week 6-7)

**Priority: Medium** | **Complexity: High** | **Effort: 4-5 days**

---

## 📋 Detailed Implementation Tickets

## TICKET 1: DATABASE MODELS & API FOUNDATION

**Phase: 1** | **Priority: Critical** | **Effort: 3-4 days**

### Task 1.1: Core Data Models

**Instructions for Claude Code:**

```
Create the following Mongoose models in src/lib/models/:

1. Opportunity.ts - Core opportunities model
2. Submission.ts - User submissions to opportunities
3. Hub.ts - Community hubs (like Reddit subreddits)
4. Post.ts - Community posts within hubs
5. Team.ts - Team formation and management
6. UserProfile.ts - Extended user profiles with portfolio data

Reference the existing User.ts model for patterns. Each model should include:
- Proper TypeScript interfaces
- Mongoose schema with validation
- Indexing for search fields
- Timestamps and audit fields
- Relationship references

Key fields for Opportunity:
- title, description, category, country, location
- deadline, fee, isOnline, difficulty
- organizerId, requirements, prizes
- submissionCount, viewCount
- tags[], website, socialLinks

Key fields for UserProfile:
- skills[], achievements[], certifications[]
- university, city, country, graduationYear
- portfolioItems[], socialLinks
- streakCount, totalSubmissions, wins
- preferences (location, categories, etc.)

Key fields for Hub:
- name, description, category, rules
- memberCount, postCount, isPrivate
- moderatorIds[], tags[], coverImage

Follow existing patterns in the codebase for error handling and validation.
```

### Task 1.2: API Route Structure

**Instructions for Claude Code:**

```
Create RESTful API routes in src/app/api/:

/api/opportunities/
  - GET / (list with filters)
  - POST / (create - organizers only)
  - GET /[id] (single opportunity)
  - PUT /[id] (update - organizers only)
  - POST /[id]/submit (submit to opportunity)

/api/submissions/
  - GET / (user's submissions)
  - GET /[id] (single submission)
  - PUT /[id] (update submission)

/api/hubs/
  - GET / (list hubs)
  - POST / (create hub)
  - GET /[slug] (hub details + posts)
  - POST /[slug]/posts (create post in hub)

/api/posts/
  - GET /[id] (single post)
  - POST /[id]/comments (add comment)
  - PUT /[id]/vote (upvote/downvote)

/api/teams/
  - GET / (user's teams)
  - POST / (create team)
  - POST /[id]/join (join team request)

/api/profiles/
  - GET /[username] (public profile)
  - PUT /me (update own profile)

Each route should include:
- Proper TypeScript types
- Input validation with Zod schemas
- Authentication middleware where needed
- Error handling
- CORS headers
- Rate limiting

Use existing auth patterns from the codebase.
```

---

## TICKET 2: BROWSE OPPORTUNITIES EXPERIENCE

**Phase: 2** | **Priority: Critical** | **Effort: 5-6 days**

### Task 2.1: Opportunities Listing Page

**Instructions for Claude Code:**

```
Create src/app/opportunities/page.tsx with layout inspired by Youth Opportunities website:

Structure:
- Header with search bar and primary filters
- Sidebar with detailed filters (category, location, fee, difficulty, deadline)
- Main grid showing opportunity cards (3-4 per row desktop, 1 per row mobile)
- Pagination or infinite scroll
- Sort options (deadline, newest, most popular)

Key Features:
- Real-time search with debouncing
- Filter combinations (AND logic)
- Bookmark/save functionality
- Quick preview on hover
- Share buttons for social media

Opportunity Card Component:
- Title, organizer, deadline, location
- Category badge, fee indicator
- Participant count, difficulty level
- Bookmark heart icon, share button
- "Submit on Strive" CTA button

Use existing UI components from shadcn/ui.
Match the color palette: red-orange gradient theme.
Mobile-first responsive design.
```

### Task 2.2: Opportunity Details Page

**Instructions for Claude Code:**

```
Create src/app/opportunities/[id]/page.tsx following FilmFreeway-style detailed view:

Layout:
- Hero section with title, organizer, key details
- Tabs: Overview, Requirements, Prizes, Submissions Stats
- Sticky sidebar with key info and submission CTA
- Related opportunities section
- Community discussion thread for this opportunity

Key Features:
- Submission wizard modal (4-step process)
- Social sharing with custom OG images
- Add to calendar functionality
- Team formation suggestions
- Progress indicators for multi-step applications

Submission Wizard Steps:
1. Basic Info (name, email, university)
2. Requirements Upload (documents, portfolio)
3. Team Formation (if applicable)
4. Review & Submit

Use Framer Motion for smooth page transitions.
Implement proper SEO with dynamic meta tags.
```

---

## TICKET 3: USER PROFILES & PORTFOLIO SYSTEM

**Phase: 3** | **Priority: High** | **Effort: 4-5 days**

### Task 3.1: Public Profile Pages

**Instructions for Claude Code:**

```
Create src/app/profile/[username]/page.tsx inspired by Duolingo profiles:

Profile Structure:
- Avatar, name, university, location, join date
- Skill badges with icons (📷 Design, 🤖 AI, 💻 Code, 📊 Business)
- Achievement showcase (wins, participations, streaks)
- Portfolio grid with project previews
- Activity feed (recent submissions, achievements)
- Statistics dashboard (total events, win rate, streak count)

Gamification Elements:
- Experience points and levels
- Badge collection display
- Streak counters (daily activity, submission streaks)
- Leaderboard rankings (university, city, global)
- Achievement unlocks with celebration animations

Social Features:
- Follow/unfollow functionality
- Direct profile sharing
- Achievement celebrations in feed
- University/city rankings display

Use vivid colors and playful animations like Duolingo.
Implement progressive image loading for portfolio items.
```

### Task 3.2: Profile Edit & Onboarding

**Instructions for Claude Code:**

```
Create comprehensive profile setup in src/app/dashboard/profile/:

Onboarding Flow:
1. Basic Info (name, university, graduation year)
2. Skills & Interests selection with visual icons
3. Location & Preferences
4. Portfolio Upload (optional)
5. Community Hub Recommendations

Profile Edit Features:
- Drag-and-drop skill reordering
- Portfolio item management with previews
- Privacy settings (public/private profile)
- Notification preferences
- Social links management

Validation:
- Required fields for complete profile
- Image upload with compression
- University auto-complete with verification
- Skill validation against predefined list

Use multi-step form with progress indicators.
Implement auto-save for draft changes.
```

---

## TICKET 4: COMMUNITY & SOCIAL FEATURES

**Phase: 4** | **Priority: High** | **Effort: 6-7 days**

### Task 4.1: Community Hub System

**Instructions for Claude Code:**

```
Create Reddit/Glassdoor-inspired community system in src/app/community/:

Hub Structure (Like Reddit Subreddits/Glassdoor Bowls):
- Industry Hubs (Tech, Business, Design, etc.)
- University Hubs (Harvard, MIT, Oxford, etc.)
- Location Hubs (London, NYC, Dubai, etc.)
- Interest Hubs (Startups, AI, Sustainability, etc.)
- Event-Specific Hubs (Hackathons, Case Competitions)

Hub Features:
- Hub discovery page with trending/popular hubs
- Join/leave hub functionality
- Hub rules and moderation guidelines
- Member count and activity stats
- Hub-specific post feeds with sorting
- Pinned posts and announcements

Post Types:
- Text posts with rich formatting
- Link sharing (opportunities, articles)
- Image posts with captions
- Poll posts for community decisions
- Event coordination posts

Engagement Features:
- Upvote/downvote system with karma
- Comment threads with nested replies
- Post bookmarking and sharing
- User mentions and notifications
- Report and moderation tools

Use Reddit's design patterns for information hierarchy.
```

### Task 4.2: Community Posts & Engagement

**Instructions for Claude Code:**

```
Create engaging post system in src/app/community/[hub]/page.tsx:

Post Feed Features:
- Infinite scroll with optimized loading
- Real-time activity indicators
- Trending posts algorithm
- Hot/New/Top sorting options
- Search within hub

Post Creation:
- Rich text editor with markdown support
- Image upload with automatic compression
- Link preview generation
- Tag suggestions based on hub
- Draft saving functionality

Comment System:
- Nested comment threads (up to 5 levels)
- Comment sorting (best, newest, controversial)
- Inline reply functionality
- Comment editing with version history
- Voting on individual comments

Notification System:
- Real-time notifications for mentions
- Post reply notifications
- Hub activity digests
- Achievement notifications
- Weekly community highlights

Moderation Tools:
- Report inappropriate content
- Community voting on content quality
- Moderator dashboard for hub management
- Automated spam detection

Implement WebSocket for real-time features.
Use optimistic updates for better UX.
```

### Task 4.3: Weekly Community Rituals

**Instructions for Claude Code:**

```
Create engaging weekly ritual system (inspired by successful BD Facebook groups):

Weekly Post Templates:
- "Motivation Monday" - Goal setting and inspiration
- "Team-up Tuesday" - Finding teammates for events
- "Win Wednesday" - Celebrating recent achievements
- "Throwback Thursday" - Sharing past competition experiences
- "CV Roast Friday" - Peer feedback on resumes/portfolios
- "Weekend Warriors" - Weekend hackathon/event planning

Ritual Features:
- Automated weekly post creation by system
- Template-based posting with guided prompts
- Community challenges and contests
- Leaderboard for most active participants
- Special badges for ritual participation

University/City Competition:
- Weekly leaderboards by institution
- City vs city friendly rivalries
- Monthly competition statistics
- Pride-building metrics and showcases
- Achievement sharing between institutions

Implement automated scheduling system.
Track participation metrics for engagement analytics.
```

---

## TICKET 5: TEAM FINDER & COLLABORATION

**Phase: 5** | **Priority: Medium** | **Effort: 3-4 days**

### Task 5.1: Team Formation System

**Instructions for Claude Code:**

```
Create team formation features in src/app/teams/:

Team Discovery:
- Search teams by university, skills, location
- Filter by team type (hackathon, case comp, etc.)
- Browse open positions within teams
- Skill-based team recommendations

Team Creation:
- Team setup wizard with role definitions
- Skill requirements and preferences
- Team visibility settings (public/private)
- Event association and goals

Team Management:
- Member invitation system
- Role-based permissions (leader, member)
- Team chat/communication channel
- Shared file storage and collaboration
- Progress tracking for team goals

Request System:
- Join team requests with skill showcase
- Team invitation system via email/platform
- Automatic matching suggestions
- Skill verification and endorsements

Integration:
- Link teams to specific opportunities
- Team submission management
- Shared portfolio creation
- Achievement tracking for teams

Use card-based layout for team discovery.
Implement real-time notifications for team activities.
```

---

## TICKET 6: ATLAS & VISUAL DISCOVERY

**Phase: 6** | **Priority: Medium** | **Effort: 4-5 days**

### Task 6.1: Interactive Opportunity Map

**Instructions for Claude Code:**

```
Create interactive world map in src/app/atlas/page.tsx using react-leaflet:

Map Features:
- OpenStreetMap tiles for global coverage
- Clustered markers for opportunity density
- Filter overlays (category, deadline, fee type)
- Zoom-based detail levels
- Custom marker icons by opportunity type

Visual Elements:
- Opportunity density heat map
- Country/city statistics panels
- Real-time opportunity counter
- Trending locations spotlight
- Custom popup cards with opportunity previews

Interactive Features:
- Click markers to view opportunity details
- Draw custom search regions
- Save filtered map views
- Share map snapshots as PNG images
- Export filtered results to CSV

Mobile Experience:
- Touch-friendly map controls
- Swipe-based opportunity browsing
- Location-based auto-suggestions
- GPS integration for "near me" features

Integration:
- Sync with browse page filters
- Link to community hubs by location
- Team finder integration by geography
- Social sharing of map discoveries

Use Leaflet plugins for enhanced functionality.
Optimize for performance with marker clustering.
```

---

## TICKET 7: LANDING PAGE REDESIGN

**Phase: Parallel** | **Priority: Medium** | **Effort: 2-3 days**

### Task 7.1: Youth-Focused Landing Page

**Instructions for Claude Code:**

```
Redesign src/app/page.tsx and src/components/landing/ inspired by Youth Opportunities:

Hero Section:
- Bold headline: "Discover Global Opportunities"
- Subheading: "Competitions • Scholarships • Internships • Hackathons"
- Search bar with trending opportunity suggestions
- Visual statistics (X opportunities, Y countries, Z students)

Features Showcase:
- "Submit on Strive" - Unified application system
- "Build Your Portfolio" - Achievement tracking
- "Find Your Team" - Collaboration tools
- "Join Communities" - Hub-based discussions
- "Explore the Atlas" - Global opportunity map

Social Proof:
- University logos of active users
- Success story carousel
- Recent opportunity highlights
- Community activity feed preview

Design Elements:
- Red-orange gradient color scheme
- Bolt logo (⚡) integration
- Playful animations and micro-interactions
- Mobile-first responsive design
- High contrast for accessibility

CTA Strategy:
- Primary: "Get Started Free" -> Registration
- Secondary: "Browse Opportunities" -> Discovery
- Tertiary: "Join Community" -> Hub exploration

Use Framer Motion for engaging animations.
Implement intersection observer for scroll-triggered effects.
```

---

## TICKET 8: AUTHENTICATION & ONBOARDING

**Phase: Parallel** | **Priority: High** | **Effort: 2-3 days**

### Task 8.1: Simple Authentication Flow

**Instructions for Claude Code:**

```
Redesign authentication system inspired by MLH's simple OTP flow:

Registration Flow:
1. Email input with university domain detection
2. OTP verification via email
3. Basic profile setup (name, university, graduation year)
4. Skills selection with visual icons
5. Community hub recommendations

Login Options:
- Primary: Email + OTP (passwordless)
- Secondary: Google OAuth
- Fallback: Traditional email/password

Onboarding Experience:
- Progressive disclosure of features
- Interactive tutorial with real examples
- Achievement unlocks during setup
- First opportunity suggestions
- Community hub auto-joins based on university

User Experience:
- Single-page flows with smooth transitions
- Mobile-optimized input fields
- Clear progress indicators
- Error states with helpful messaging
- Social proof elements throughout

Security Features:
- Rate limiting on OTP requests
- Email verification tracking
- Session management with refresh tokens
- Device fingerprinting for security

Update existing auth pages in src/app/auth/ folder.
Maintain compatibility with existing NextAuth setup.
```

---

## TICKET 9: SEARCH & DISCOVERY ENGINE

**Phase: Advanced** | **Priority: Medium** | **Effort: 3-4 days**

### Task 9.1: Advanced Search System

**Instructions for Claude Code:**

```
Implement comprehensive search in src/lib/search/:

Search Features:
- Global search across opportunities, hubs, users, teams
- Autocomplete with search suggestions
- Saved searches and alerts
- Search history and frequent searches
- Advanced filter combinations

Search Types:
- Text search with relevance ranking
- Location-based search with radius
- Date range filtering (deadlines, events)
- Skill-based matching algorithms
- University/institution search

Technical Implementation:
- Use MongoDB text indexes for basic search
- Implement search result caching with Redis
- Search analytics and popular query tracking
- Search performance monitoring
- Fuzzy matching for typo tolerance

User Experience:
- Instant search results with debouncing
- Search result highlighting
- "No results" state with suggestions
- Search filters with clear indicators
- Recent searches dropdown

Integration Points:
- Header search bar across all pages
- Browse page advanced filters
- Community hub search
- Team finder search
- Profile/user discovery

Plan for future Algolia/Elasticsearch integration.
Optimize database queries for search performance.
```

---

## 🎨 Design System Guidelines

### Color Palette

```
Primary: Red-Orange Gradient (#FF5722 to #FF9800)
Secondary: Deep Red (#D32F2F)
Accent: Orange (#FF7043)
Neutral: Grays (#F5F5F5, #E0E0E0, #9E9E9E, #424242)
Success: Green (#4CAF50)
Warning: Amber (#FFC107)
Error: Red (#F44336)
```

### Typography

```
Headlines: Inter Bold (32px, 28px, 24px, 20px)
Body: Inter Regular (16px, 14px)
Captions: Inter Medium (12px, 10px)
Code: JetBrains Mono (14px, 12px)
```

### Component Patterns

- Use existing shadcn/ui components as base
- Add bolt (⚡) icon variations throughout
- Implement loading skeletons for all async content
- Use Framer Motion for page transitions
- Follow mobile-first responsive design

---

## 📊 Success Metrics & Analytics

### Key Performance Indicators (KPIs)

**User Engagement:**

- Daily/Monthly Active Users (DAU/MAU)
- User session duration and page views
- Opportunity submission completion rate
- Community post engagement (upvotes, comments)
- Profile completion percentage

**Content Metrics:**

- Opportunity listing growth rate
- Community hub activity levels
- User-generated content volume
- Search query success rate
- Team formation success rate

**Business Metrics:**

- User registration conversion rate
- Opportunity submission volume
- Premium feature adoption (if applicable)
- University/institution coverage
- Geographic user distribution

### Implementation:

- Use existing Google Analytics setup
- Implement Mixpanel for event tracking
- Add custom analytics dashboard
- Track user journey conversion funnels
- Monitor performance with Sentry

---

## 🚀 Deployment & Infrastructure

### Deployment Strategy

- Continue using Vercel for frontend deployment
- MongoDB Atlas for production database
- Implement staging environment for testing
- Use feature flags for gradual rollouts
- Set up automated testing pipeline

### Performance Optimization

- Implement proper caching strategies
- Optimize images with Next.js Image component
- Use code splitting for large components
- Implement service worker for offline functionality
- Monitor Core Web Vitals metrics

### Security & Compliance

- Implement rate limiting on all API routes
- Add CSRF protection for forms
- Use proper input validation and sanitization
- Set up monitoring for security incidents
- Implement GDPR compliance features

---

## 🎯 Priority Implementation Order

**Week 1-2: Critical Foundation**

1. Database Models & API Foundation (Ticket 1)
2. Basic Browse Opportunities (Ticket 2.1)
3. Simple Authentication (Ticket 8.1)

**Week 3-4: Core Features**  
4. Complete Opportunity Details (Ticket 2.2) 5. User Profiles & Portfolio (Ticket 3) 6. Landing Page Redesign (Ticket 7)

**Week 5-6: Social & Community** 7. Community Hub System (Ticket 4.1-4.2) 8. Team Finder (Ticket 5.1) 9. Search & Discovery (Ticket 9.1)

**Week 7-8: Advanced Features** 10. Weekly Community Rituals (Ticket 4.3) 11. Interactive Atlas (Ticket 6.1) 12. Advanced Search Features (Ticket 9.1)

---

## 📝 Final Notes for Implementation

### Code Quality Standards

- Follow existing TypeScript patterns in codebase
- Use proper error boundaries and loading states
- Implement comprehensive logging for debugging
- Write unit tests for critical business logic
- Use proper SEO optimization for all pages

### User Experience Priorities

- Mobile-first responsive design
- Fast page load times (<3 seconds)
- Intuitive navigation and clear CTAs
- Accessible design following WCAG guidelines
- Engaging micro-interactions and animations

### Technical Debt Management

- Regular code reviews and refactoring
- Database query optimization
- Bundle size monitoring and optimization
- Security vulnerability scanning
- Performance monitoring and alerting

This comprehensive plan provides detailed, actionable tickets that Claude Code can implement independently. Each ticket includes specific technical requirements, design guidelines, and integration points with the existing codebase.
