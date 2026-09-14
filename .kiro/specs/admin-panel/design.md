# Parbati Interior Admin Panel - Design Document

## Phase Overview

The Design Phase translates 22 requirements into a concrete technical architecture, UI/UX design system, component hierarchy, data models, and API structure. This document serves as the blueprint for the implementation phase.

---

## 1. DESIGN SYSTEM & VISUAL STANDARDS

### 1.1 Color Palette (Red & White Theme)

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary | Brand Red | #E53E3E | Buttons, links, accents, hover states |
| Secondary | White | #FFFFFF | Background, cards, text areas |
| Text Primary | Dark Gray | #1A202C | Body text, labels |
| Text Secondary | Medium Gray | #718096 | Secondary text, descriptions |
| Border | Light Gray | #E2E8F0 | Card borders, dividers |
| Background Light | Off-White | #F7FAFC | Page backgrounds, sections |
| Success | Green | #48BB78 | Success messages, confirmations |
| Warning | Orange | #ED8936 | Warning messages, alerts |
| Error | Red | #F56565 | Error messages, validations |
| Hover | Dark Red | #C53030 | Button hover states |

### 1.2 Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Heading 1 | Inter | 32px | 700 | Page titles, section headers |
| Heading 2 | Inter | 24px | 700 | Subsection headers |
| Heading 3 | Inter | 18px | 600 | Card titles, subheaders |
| Body | Inter | 14px | 400 | Body text, descriptions |
| Body Small | Inter | 12px | 400 | Meta text, timestamps |
| Label | Inter | 13px | 600 | Form labels, badges |
| Button | Inter | 14px | 600 | Button text |

### 1.3 Spacing & Layout

- **Base unit**: 4px (all spacing multiples: 4, 8, 12, 16, 24, 32, 48, 64)
- **Container max-width**: 1280px
- **Sidebar width**: 260px (desktop), collapsed on mobile
- **Card border-radius**: 8px
- **Button border-radius**: 6px
- **Gap between sections**: 32px

---

## 2. TECHNICAL ARCHITECTURE

### 2.1 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI components, state management |
| **Build Tool** | Vite | Fast dev server and builds |
| **State Management** | Zustand/React Context | Global auth, UI state, content cache |
| **UI Components** | Headless UI + Radix UI | Accessible base components |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Form Handling** | React Hook Form | Form state, validation, submission |
| **Routing** | React Router v6 | Admin panel navigation |
| **Backend** | Supabase | Auth, database, real-time |
| **Media** | Cloudinary | Image/video upload, optimization |
| **API Calls** | Fetch + Custom Hooks | REST API communication |
| **Date Handling** | date-fns | Date parsing, formatting |
| **Real-Time** | Supabase RealtimeClient | Live enquiries, notifications |
| **Icons** | Lucide React | Consistent iconography |
| **Notifications** | Sonner | Toast notifications |

### 2.2 Folder Structure

```
src/
├── admin/
│   ├── components/
│   │   ├── AuthLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── FormElements/
│   │   │   ├── CloudinaryUploader.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   └── DatePicker.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Enquiries/
│   │   │   ├── EnquiriesPage.tsx
│   │   │   ├── EnquiryDetail.tsx
│   │   │   └── EnquiryForm.tsx
│   │   ├── HeroSlider/
│   │   ├── Gallery/
│   │   ├── Projects/
│   │   ├── Blog/
│   │   ├── Services/
│   │   ├── Packages/
│   │   └── ThemeCustomizer/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEnquiries.ts
│   │   ├── useProjects.ts
│   │   ├── useCloudinary.ts
│   │   └── ...
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── contentStore.ts
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── cloudinary.ts
│   │   ├── api.ts
│   │   └── whatsapp.ts
│   ├── types/
│   │   ├── admin.ts
│   │   ├── database.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── constants.ts
│   └── AdminRouter.tsx
├── pages/
├── components/
└── ...
```

### 2.3 Database Schema (Supabase)

#### Table: `admin_users`
```
id: uuid (PK)
email: string (UNIQUE)
password_hash: string
full_name: string
role: enum (Admin, Content_Editor, Enquiry_Manager, Viewer)
status: enum (Active, Inactive, Invited)
last_login: timestamp
created_at: timestamp
updated_at: timestamp
settings: jsonb
```

#### Table: `enquiries`
```
id: uuid (PK)
customer_name: string
email: string
phone: string
service_type: string
room_type: string (nullable)
budget_range: string (nullable)
project_description: text
status: enum (New, Contacted, In_Progress, Closed)
contacted_by: uuid (FK admin_users, nullable)
contacted_at: timestamp (nullable)
source: enum (website, whatsapp, referral)
created_at: timestamp
updated_at: timestamp
archived_at: timestamp (nullable)
tags: string[] (ARRAY)
```

#### Table: `hero_slides`
```
id: uuid (PK)
headline: string
subheading: string
button_text: string (nullable)
button_link: string (nullable)
image_url: string
cloudinary_id: string
status: enum (Draft, Published, Scheduled)
scheduled_publish_date: timestamp (nullable)
display_order: integer
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `gallery_images`
```
id: uuid (PK)
room_type: enum (Bedroom, Living_Room, Kitchen, Bathroom, Office, Commercial)
title: string
description: text
image_url: string
cloudinary_id: string
before_image_url: string (nullable)
before_cloudinary_id: string (nullable)
is_before_after: boolean
project_reference: uuid (FK projects, nullable)
display_order: integer
status: enum (Draft, Published)
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `projects`
```
id: uuid (PK)
title: string
slug: string (UNIQUE)
category: enum (Residential, Modular_Kitchen, Commercial, Custom_Furniture, Construction)
description: text
client_name: string
location: string
completion_date: date
budget_range: string (nullable)
media_urls: jsonb (array of {url, cloudinary_id, type})
room_types: string[] (ARRAY)
is_featured: boolean
status: enum (Draft, Published)
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `blog_posts`
```
id: uuid (PK)
title: string
slug: string (UNIQUE)
category: enum (Design_Tip, Case_Study, Industry_Insight, Tutorial)
content: text
excerpt: string
featured_image_url: string
cloudinary_id: string
author: string
status: enum (Draft, Published, Scheduled)
published_date: timestamp (nullable)
scheduled_publish_date: timestamp (nullable)
view_count: integer (default: 0)
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `services`
```
id: uuid (PK)
name: string
slug: string (UNIQUE)
description: text
featured_image_url: string
cloudinary_id: string
icon_emoji: string (nullable)
display_order: integer
is_active: boolean
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `packages`
```
id: uuid (PK)
service_id: uuid (FK services)
name: string
description: text
price: decimal
currency: enum (NPR, USD)
features: jsonb (array of {description})
delivery_timeline_days: integer
display_order: integer
is_active: boolean
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `theme_config`
```
id: uuid (PK)
config_type: enum (Colors, Fonts, CustomCSS)
preset_name: string (nullable)
config_data: jsonb
custom_css: text (nullable)
is_active: boolean (one active per type)
created_by: uuid (FK admin_users)
created_at: timestamp
updated_at: timestamp
```

#### Table: `content_versions`
```
id: uuid (PK)
content_type: enum (Project, Blog, Service, Package, Gallery, HeroSlide)
content_id: uuid
action: enum (Created, Edited, Deleted, Restored)
changed_fields: jsonb (object with field names and before/after values)
created_by: uuid (FK admin_users)
created_at: timestamp
```

---

## 3. COMPONENT HIERARCHY & LAYOUT

### 3.1 Layout Structure

```
AdminApp
├── AuthContext Provider
├── Router
│   ├── PublicRoute (Login)
│   │   └── AuthLayout
│   │       └── LoginPage
│   │
│   └── PrivateRoute (Dashboard & Sections)
│       └── DashboardLayout
│           ├── Sidebar (Navigation)
│           ├── Topbar (User Menu, Notifications)
│           └── MainContent
│               ├── Dashboard
│               ├── EnquiriesPage
│               ├── HeroSliderPage
│               ├── GalleryPage
│               ├── ProjectsPage
│               ├── BlogPage
│               ├── ServicesPage
│               ├── PackagesPage
│               ├── ServiceDetailPage
│               ├── ThemeCustomizerPage
│               └── SettingsPage
```

### 3.2 Core Components

#### Common Components
- **Button**: Primary, secondary, danger variants; loading, disabled states
- **Input**: Text input with validation, labels, error messages
- **Select**: Dropdown selector with search capability
- **Modal**: Reusable modal container with close, confirm actions
- **Card**: Styled container with optional header, footer
- **Badge**: Status badges (Draft, Published, Active, etc.)
- **Alert**: Success, warning, error notifications
- **Pagination**: Table pagination with prev/next
- **Breadcrumb**: Navigation breadcrumbs
- **Tooltip**: Hover tooltips for help text
- **Skeleton**: Loading skeleton placeholder

#### Form Components
- **FormField**: Wrapper with label, error, help text
- **CloudinaryUploader**: File upload widget with progress
- **RichTextEditor**: WYSIWYG editor for content
- **DatePicker**: Date selection input
- **ColorPicker**: Hex color input with preview
- **ToggleSwitch**: ON/OFF switch
- **MultiSelect**: Select multiple items
- **FileDropZone**: Drag-drop file upload area

#### Layout Components
- **Sidebar**: Navigation menu with collapsible on mobile
- **Topbar**: Header with user menu, notifications
- **PageHeader**: Page title with breadcrumbs and actions
- **SectionCard**: Card for content sections

---

## 4. UI/UX WIREFRAME DESCRIPTIONS

### 4.1 Dashboard Page

**Layout**: Full-width with responsive grid

```
┌─────────────────────────────────────────┐
│  Welcome back, [User Name]!             │
└─────────────────────────────────────────┘

Metrics Row (4 columns, responsive):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Enquiries│ │ Projects │ │ Services │ │   Blog   │
│    12    │ │    45    │ │    8     │ │    23    │
│ (monthly)│ │(published)│ │ (active) │ │ (posts)  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Recent Activity Section (2 columns):
┌─────────────────────────┐  ┌──────────────────┐
│ Recent Enquiries        │  │ Quick Actions    │
│ • Customer Name | New   │  │ • Add Project    │
│ • Customer Name |Closed │  │ • Add Blog Post  │
│ • Customer Name |Contacted│ │ • Add Service   │
└─────────────────────────┘  └──────────────────┘
```

**Key Elements**:
- Metric cards showing: Total New Enquiries (monthly), Projects Published, Active Services, Blog Posts
- Recent enquiries list with status badges
- Quick action buttons
- Color scheme: Red buttons on white cards

### 4.2 Enquiries Page

**Layout**: Master-detail layout

```
┌──────────────────────────┬─────────────────────┐
│ ENQUIRIES                │ ENQUIRY DETAIL (when│
│ [Search] [Filter]        │ item is selected)   │
│ [Add | Archive | Delete] │                     │
│                          │ Customer Name       │
│ TABLE:                   │ Email               │
│ Name | Type | Date|Status│ Phone               │
│ ─────────────────────────│ Service Type        │
│ • Cust 1 | Kitchen |New  │ Room Type           │
│ • Cust 2 | Bedroom |...  │ Budget              │
│ • Cust 3 | Office |...   │ Description         │
│                          │                     │
│ [Previous] 1 2 3 [Next]  │ [Mark Contacted]    │
│                          │ [Send WhatsApp]     │
└──────────────────────────┴─────────────────────┘
```

**Key Elements**:
- Master list with columns: Name, Service, Date, Status
- Filter by status (New, Contacted, In Progress, Closed)
- Search by name/email
- Detail panel on right (or modal on mobile)
- Action buttons: Mark Contacted, Mark In Progress, Close, Send WhatsApp, Archive

### 4.3 Projects Page (Create/Edit)

**Layout**: Form with multi-column inputs

```
PROJECT DETAILS
┌─────────────────────────────────────────┐
│ Title           [_________________]     │
│ Category        [Dropdown ▼]            │
│ Description     [Rich Text Editor]      │
│                                         │
│ Client Info                             │
│ ├─ Client Name  [_________________]     │
│ ├─ Location     [_________________]     │
│ ├─ Completion   [Date Picker]           │
│ └─ Budget Range [_________________]     │
│                                         │
│ Room Types (Multi-select)               │
│ ☑ Bedroom  ☑ Kitchen  ☑ Office         │
│                                         │
│ MEDIA GALLERY                           │
│ [Cloudinary Uploader]                   │
│ ┌──────┬──────┬──────┐                   │
│ │ Img1 │ Img2 │ Img3 │                   │
│ └──────┴──────┴──────┘                   │
│                                         │
│ ☐ Featured Project                      │
│                                         │
│ [Save Draft] [Publish] [Cancel]         │
└─────────────────────────────────────────┘
```

**Key Elements**:
- Title, category, rich text description
- Client info (name, location, completion date, budget)
- Multi-select for room types
- Cloudinary media gallery upload
- Featured toggle
- Save Draft / Publish buttons
- Color: Red buttons, white form

### 4.4 Theme Customizer Page

**Layout**: Three-tab interface with live preview

```
┌─────────────────────────┬────────────────┐
│ THEME CUSTOMIZER        │ LIVE PREVIEW   │
│                         │ (Right panel)  │
│ [Colors][Fonts][CSS]    │                │
│                         │ ┌────────────┐ │
│ Color Themes            │ │  Website   │ │
│ ┌──────────────────┐    │ │ Preview    │ │
│ │ Terracotta Brown ▼    │ │            │ │
│ │ (9 presets)      │    │ │ Updates    │ │
│ └──────────────────┘    │ │ in         │ │
│                         │ │ real-time  │ │
│ Color Picker            │ │            │ │
│ Primary: [#E53E3E ▼]    │ └────────────┘ │
│ Secondary: [#...   ▼]   │                │
│ Accent: [#...      ▼]   │                │
│ Background: [#...  ▼]   │                │
│                         │                │
│ [Reset to Default]      │                │
│ [Save Theme]            │                │
└─────────────────────────┴────────────────┘
```

**Key Elements**:
- Three tabs: Colors, Fonts, Custom CSS
- Color preset selector (9 themes)
- Individual color pickers
- Font preset selector
- Custom CSS editor
- Live preview panel on right
- Save/Reset buttons

---

## 5. USER FLOWS

### 5.1 Authentication Flow

```
User Visits /admin
  ↓
Check if authenticated?
  ├─ NO → Redirect to /admin/login
  │   ↓
  │   Show Login Form
  │   ↓
  │   Enter Email & Password
  │   ↓
  │   Validate with Supabase
  │   ├─ Invalid → Show Error, Stay on Login
  │   ├─ Valid → Create Session, Set Auth Cookie
  │   └─ Account Not Activated → Show Message
  │   ↓
  │   Redirect to /admin/dashboard
  │
  ├─ YES → Check Session Validity
      ├─ Valid → Show Dashboard
      └─ Expired → Logout, Redirect to /admin/login
```

### 5.2 Create Project Flow

```
User Clicks "Add New Project"
  ↓
Show Project Form (Modal or New Page)
  ↓
Fill in Details:
  • Title, Category, Description
  • Client Info
  • Room Types
  • Upload Media
  ↓
Click "Save Draft" or "Publish"
  ├─ Save Draft → Save to DB with status=Draft, Show Success Toast
  ├─ Publish → Validate all required fields
  │   ├─ Missing fields → Show Validation Errors
  │   └─ Valid → Save to DB with status=Published, Show Success Toast
  │       ↓
  │       Record version entry
  │       ↓
  │       Update website in real-time
  ↓
User can view project in Projects List
```

### 5.3 Handle Enquiry Flow

```
New Enquiry Submitted on Website
  ↓
Supabase receives data
  ↓
Real-time listener notifies admin (if logged in)
  ├─ Browser notification
  ├─ Increment badge count
  └─ Add to top of enquiries list
  ↓
Admin Opens Enquiry
  ↓
View Details (name, email, phone, service, description)
  ↓
Choose Action:
  ├─ Mark as Contacted → Update status, record timestamp
  ├─ Mark as In Progress → Update status
  ├─ Send WhatsApp → Pre-populate template, open WhatsApp
  ├─ Close Enquiry → Mark as Closed, hide from active view
  └─ Archive → Move to archive section
```

---

## 6. API ENDPOINTS (Backend REST/RPC)

### 6.1 Authentication

```
POST /api/auth/login
  Body: { email, password }
  Response: { token, user, expiresAt }

POST /api/auth/logout
  Response: { success: true }

GET /api/auth/me
  Response: { user }

POST /api/auth/refresh-token
  Response: { token, expiresAt }
```

### 6.2 Enquiries

```
GET /api/enquiries
  Query: { page, limit, status, search, sortBy }
  Response: { data: [enquiry], total, page }

GET /api/enquiries/:id
  Response: { enquiry }

PATCH /api/enquiries/:id
  Body: { status, contacted_by, tags, ... }
  Response: { enquiry }

POST /api/enquiries/:id/send-whatsapp
  Body: { message }
  Response: { success, messageId }

DELETE /api/enquiries/:id
  Response: { success: true }
```

### 6.3 Projects

```
GET /api/projects
  Query: { page, limit, status, category, search }
  Response: { data: [project], total }

POST /api/projects
  Body: { title, category, description, ... }
  Response: { project }

GET /api/projects/:id
  Response: { project }

PATCH /api/projects/:id
  Body: { ...project fields }
  Response: { project }

DELETE /api/projects/:id
  Response: { success: true }

POST /api/projects/:id/publish
  Response: { project }
```

### 6.4 Theme Configuration

```
GET /api/theme
  Response: { colors, fonts, customCss }

PATCH /api/theme
  Body: { configType, presetName, configData, customCss }
  Response: { theme }

POST /api/theme/reset
  Response: { theme }
```

---

## 7. STATE MANAGEMENT (Zustand Stores)

### 7.1 Auth Store

```typescript
interface AuthStore {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user) => void;
  checkAuth: () => Promise<void>;
}
```

### 7.2 UI Store

```typescript
interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeModal: string | null;
  openModal: (name) => void;
  closeModal: () => void;
  notifications: Notification[];
  addNotification: (notification) => void;
  removeNotification: (id) => void;
}
```

### 7.3 Content Store

```typescript
interface ContentStore {
  projects: Project[];
  enquiries: Enquiry[];
  selectedProject: Project | null;
  selectedEnquiry: Enquiry | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  fetchEnquiries: () => Promise<void>;
  createProject: (data) => Promise<void>;
  updateEnquiry: (id, data) => Promise<void>;
  setSelectedProject: (project) => void;
  setSelectedEnquiry: (enquiry) => void;
}
```

---

## 8. AUTHENTICATION & AUTHORIZATION

### 8.1 Role-Based Access Control (RBAC)

| Feature | Admin | Content_Editor | Enquiry_Manager | Viewer |
|---------|-------|----------------|-----------------|--------|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Enquiries (View) | ✓ | ✗ | ✓ | ✓ |
| Enquiries (Respond) | ✓ | ✗ | ✓ | ✗ |
| Projects (Create/Edit) | ✓ | ✓ | ✗ | ✗ |
| Blog (Create/Edit) | ✓ | ✓ | ✗ | ✗ |
| Services (Create/Edit) | ✓ | ✓ | ✗ | ✗ |
| Theme Customizer | ✓ | ✗ | ✗ | ✗ |
| User Management | ✓ | ✗ | ✗ | ✗ |
| Settings | ✓ | ✗ | ✗ | ✗ |

### 8.2 Session Management

- Session stored in secure HTTP-only cookie
- 30-minute inactivity timeout with auto-logout
- Automatic token refresh before expiry
- Session validation on every protected route

---

## 9. NOTIFICATION SYSTEM

### 9.1 Toast Notifications (Sonner)

- **Success**: Green toast for publish, save, delete actions
- **Error**: Red toast for validation, API errors
- **Warning**: Orange toast for cautions (e.g., "Data will be deleted")
- **Info**: Blue toast for informational messages

### 9.2 Real-Time Enquiry Notifications

- Browser notification when new enquiry arrives
- Badge increment in sidebar
- Sound alert (optional, user configurable)
- Direct link to enquiry detail in notification

---

## 10. ERROR HANDLING & VALIDATION

### 10.1 Client-Side Validation

- All forms validate on blur and submit
- Real-time error messages below inputs
- Red error borders on invalid fields
- Disabled submit button until form is valid

### 10.2 Server-Side Validation

- All inputs re-validated on backend
- Consistent error response format
- Detailed error messages for UI to display
- Rate limiting on API endpoints

### 10.3 Error Display Strategy

- Form field errors: Inline below field
- API errors: Toast notification + optional modal for critical errors
- Network errors: Retry button with exponential backoff
- Validation errors: Clear error message with guidance

---

## 11. PERFORMANCE CONSIDERATIONS

### 11.1 Optimization Strategies

- **Code Splitting**: Separate admin panel code from main app
- **Lazy Loading**: Load pages on-demand with React.lazy()
- **Image Optimization**: Use Cloudinary variants for thumbnails
- **API Caching**: Cache enquiries, projects in Zustand (invalidate on update)
- **Debouncing**: Debounce search inputs (300ms)
- **Pagination**: Limit list results (25 items per page)
- **Virtual Scrolling**: Use virtualization for large lists

### 11.2 Build Optimization

- Tree-shaking unused code
- Minify and compress assets
- Use dynamic imports for modals
- Lazy load icons from Lucide

---

## 12. SECURITY CONSIDERATIONS

### 12.1 Data Protection

- All API calls over HTTPS
- Input sanitization on all forms
- SQL injection prevention via parameterized queries
- XSS prevention via React's automatic escaping
- CSRF tokens on state-changing operations

### 12.2 Access Control

- Verify authorization on every API call
- Store JWT tokens securely (HTTP-only cookies)
- Enforce role-based permissions server-side
- Audit log all admin actions

---

## 13. TESTING STRATEGY

### 13.1 Testing Layers

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit Tests | Vitest | Components, utils, hooks |
| Integration Tests | Vitest + Testing Library | Forms, flows, API calls |
| E2E Tests | Playwright | Critical user journeys |
| Visual Tests | Percy/Chromatic | UI consistency |

### 13.2 Critical Paths to Test

1. Authentication (login, logout, session expiry)
2. Create/Edit/Delete operations (projects, enquiries, blog)
3. Role-based access (verify permission denials)
4. Real-time updates (enquiries, notifications)
5. File uploads (Cloudinary integration)
6. Form validation (required fields, format validation)

---

## 14. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)

- [ ] Setup project structure and tech stack
- [ ] Implement authentication (login, logout, session)
- [ ] Create base components (Button, Input, Select, Modal, Card)
- [ ] Setup Zustand stores (auth, ui, content)
- [ ] Create Supabase schema and RLS policies
- [ ] Implement Sidebar, Topbar, Dashboard layout

### Phase 2: Core Features (Week 3-4)

- [ ] Enquiries module (list, detail, status update, archive)
- [ ] Projects module (CRUD, form, list, filters)
- [ ] Hero Slider module (CRUD, reorder, preview)
- [ ] Gallery module (CRUD by room type, before/after)
- [ ] Cloudinary integration (uploader, optimization)

### Phase 3: Content Management (Week 5-6)

- [ ] Blog module (CRUD, rich text editor, scheduling)
- [ ] Services module (CRUD, display order)
- [ ] Packages module (CRUD within services, pricing)
- [ ] Service detail pages (hero, FAQ, testimonials, gallery)

### Phase 4: Advanced Features (Week 7-8)

- [ ] Theme Customizer (color presets, fonts, live preview)
- [ ] Content versioning (change history, restore)
- [ ] Batch operations (publish, archive, delete multiple)
- [ ] User management and RBAC

### Phase 5: Polish & Deploy (Week 9-10)

- [ ] Real-time notifications (Supabase listeners)
- [ ] WhatsApp integration
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing and QA
- [ ] Documentation and deployment

---

## 15. DELIVERABLES BY PHASE

### Design Phase Deliverables (This Document)
✓ Design System & Color Palette
✓ Technical Architecture
✓ Database Schema
✓ Component Hierarchy
✓ UI/UX Wireframes
✓ User Flows
✓ API Endpoints
✓ State Management Design
✓ Testing Strategy
✓ Implementation Roadmap

### Next Phase: Implementation
- Create repository/branch structure
- Setup development environment
- Begin Phase 1 (Foundation) implementation
- Create task breakdown for each Phase

---

## 16. DESIGN DECISIONS & RATIONALE

### Decision 1: Red & White Theme
**Rationale**: Aligns with Parbati Interior brand colors (#E53E3E red, #FFFFFF white) for consistency across web and admin panel. Red provides strong CTA emphasis for important actions (publish, save, delete).

### Decision 2: Master-Detail Layout for Enquiries
**Rationale**: Allows admins to view list and details simultaneously on desktop, improving workflow efficiency. Detail panel collapses to modal on mobile for responsive design.

### Decision 3: Zustand for State Management
**Rationale**: Lightweight alternative to Redux, easier mental model for small-to-medium admin panel, supports real-time updates via Supabase subscriptions, good TypeScript support.

### Decision 4: Supabase with Real-Time
**Rationale**: No additional server infrastructure needed, built-in authentication and real-time listeners, Cloudinary integration straightforward, good for timeline (MVP in 10 weeks).

### Decision 5: Cloudinary for Media
**Rationale**: Automatic image optimization, CDN delivery, responsive variants generated server-side, reduces storage overhead, integrates with form uploads seamlessly.

---

## 17. NEXT STEPS

1. **Review & Approve Design**: User review of architecture, color scheme, component structure
2. **Clarify Ambiguities**: Address any questions about flows, features, or data models
3. **Create Task Breakdown**: Convert implementation roadmap into granular tasks
4. **Begin Phase 1**: Setup project, create base components, implement auth
5. **Iterate with Feedback**: Adjust design based on implementation discoveries

---

**Document Version**: 1.0  
**Date**: September 11, 2026  
**Status**: Ready for Review & Implementation  
**Next Phase**: Implementation Phase (Phase 1: Foundation)
