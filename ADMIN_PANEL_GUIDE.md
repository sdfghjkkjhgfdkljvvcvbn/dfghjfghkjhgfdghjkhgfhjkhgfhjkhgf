# Parbati Interior Admin Panel - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Dependencies installed via `npm install`

### Starting the Admin Panel

```bash
npm run dev
```

Visit: **http://localhost:3000/admin/login**

---

## 🔐 Login Credentials

```
Email: admin@parbati.com
Password: admin123
```

---

## 📁 Project Structure

```
src/admin/
├── components/       # UI components (Button, Input, Card, Modal, etc.)
├── pages/           # Admin pages (Login, Dashboard, Enquiries, etc.)
├── store/           # Zustand state management (auth, ui)
├── types/           # TypeScript interfaces
└── AdminRouter.tsx  # Routing configuration
```

---

## 🎨 Design System

### Color Palette (Red & White Theme)
- **Primary Red**: `#DC2626` (Brand red for buttons, accents)
- **White**: `#FFFFFF` (Backgrounds, cards)
- **Dark Gray**: `#1A202C` (Text)
- **Light Gray**: `#E2E8F0` (Borders)
- **Off-White**: `#F7FAFC` (Page background)

### Components

#### Button
```tsx
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg" isLoading={false}>
  Click Me
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="..."
  error="Error message"
  helperText="Help text"
/>
```

#### Card
```tsx
<Card>
  <CardHeader title="Title" description="Optional description" />
  <CardBody>Content here</CardBody>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

#### Modal
```tsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="md"
  footer={<Button>Close</Button>}
>
  Content here
</Modal>
```

---

## 🔧 State Management (Zustand)

### Auth Store
```tsx
import { useAuthStore } from '@/admin/store/authStore';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

### UI Store
```tsx
import { useUIStore } from '@/admin/store/uiStore';

const { 
  sidebarOpen, 
  toggleSidebar, 
  addNotification, 
  openModal, 
  closeModal 
} = useUIStore();
```

---

## 📱 Routes

| Route | Component | Protected | Status |
|-------|-----------|-----------|--------|
| `/admin/login` | Login | ❌ No | ✅ Active |
| `/admin/dashboard` | Dashboard | ✅ Yes | ✅ Active |
| `/admin/enquiries` | Enquiries | ✅ Yes | ⏳ Placeholder |
| `/admin/hero-slider` | Hero Slider | ✅ Yes | ⏳ Placeholder |
| `/admin/gallery` | Gallery | ✅ Yes | ⏳ Placeholder |
| `/admin/projects` | Projects | ✅ Yes | ⏳ Placeholder |
| `/admin/blog` | Blog | ✅ Yes | ⏳ Placeholder |
| `/admin/services` | Services | ✅ Yes | ⏳ Placeholder |
| `/admin/packages` | Packages | ✅ Yes | ⏳ Placeholder |
| `/admin/theme` | Theme Customizer | ✅ Yes | ⏳ Placeholder |
| `/admin/settings` | Settings | ✅ Yes | ⏳ Placeholder |

---

## ✨ Features Implemented

### Phase 1: Foundation ✅ COMPLETE

#### Authentication
- ✅ Login form with validation
- ✅ Session management (localStorage mock)
- ✅ Protected routes
- ✅ Auto-logout

#### Dashboard
- ✅ Metrics cards (4 key metrics)
- ✅ Recent activity timeline
- ✅ Quick action buttons
- ✅ Getting started guide

#### Navigation
- ✅ Responsive sidebar (desktop + mobile)
- ✅ 10 navigation items
- ✅ Active route highlighting
- ✅ Mobile hamburger menu

#### UI Components
- ✅ Buttons (4 variants)
- ✅ Input fields with validation
- ✅ Cards with sections
- ✅ Modals
- ✅ Form components

---

## 🔜 Upcoming (Phase 2-5)

### Phase 2: Core Features (Enquiries, Projects)
- [ ] Enquiries management (list, detail, filters, archive)
- [ ] Projects CRUD (form, media upload, featured toggle)
- [ ] Cloudinary integration

### Phase 3: Content Management
- [ ] Blog posts (rich text editor, scheduling)
- [ ] Services management
- [ ] Packages with pricing

### Phase 4: Advanced Features
- [ ] Theme customizer (color presets, live preview)
- [ ] Content versioning (change history, restore)
- [ ] Batch operations

### Phase 5: Polish & Deploy
- [ ] Real-time notifications
- [ ] WhatsApp integration
- [ ] Performance optimization
- [ ] Security hardening

---

## 🛠️ Development Tips

### Adding a New Page
1. Create page file in `src/admin/pages/`
2. Wrap with `<DashboardLayout>`
3. Add route to `AdminRouter.tsx`
4. Add navigation item to `Sidebar.tsx`

### Adding a New Component
1. Create component in `src/admin/components/`
2. Export from component file
3. Use forwardRef for interactive components
4. Apply Tailwind classes with red/white theme

### Adding State
1. Create store in `src/admin/store/`
2. Export hook (`useStoreName`)
3. Use in components: `const { state } = useStoreName()`

### Form Validation
```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();
```

---

## 📊 TypeScript Types

All types defined in `src/admin/types/admin.ts`:

```typescript
AdminUser, AuthState, LoginCredentials
Enquiry, Project, BlogPost, Service, Package
HeroSlide, GalleryImage, ThemeConfig
Notification
```

---

## 🧪 Testing the Admin Panel

### Login Flow
1. Visit http://localhost:3000/admin/login
2. Enter `admin@parbati.com` / `admin123`
3. Should redirect to dashboard

### Sidebar Navigation
1. Click items in sidebar
2. Should navigate to respective pages
3. Active item highlighted in red

### Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar
3. Hamburger menu appears
4. Click to open/close sidebar

### Session Persistence
1. Login to dashboard
2. Refresh page (F5)
3. Should remain logged in
4. Check localStorage for tokens

---

## 📝 Notes

- Admin panel is separate from public website
- All routes start with `/admin/`
- Public website routes remain unchanged
- Authentication uses localStorage (will integrate Supabase in Phase 2)
- All styling uses Tailwind CSS + red/white brand theme

---

## 📞 Support

For issues or questions:
1. Check console (F12) for errors
2. Review design document: `.kiro/specs/admin-panel/design.md`
3. Check implementation guide: `.kiro/specs/admin-panel/implementation-phase1.md`

---

**Last Updated**: September 11, 2026  
**Version**: 1.0.0  
**Status**: Phase 1 Complete - Ready for Phase 2
