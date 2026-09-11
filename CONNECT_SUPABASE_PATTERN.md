# 🔄 Connecting Modules to Supabase - Pattern Guide

**Goal**: Show the exact pattern for connecting each module to real-time Supabase  
**Example**: Projects module (you'll repeat this for Blog, Gallery, Services, etc.)

---

## 📋 Overview: Before vs After

### BEFORE (Local State - resets on refresh)
```typescript
const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
// Add/Edit/Delete updates local state only
// Data is lost when page refreshes
```

### AFTER (Supabase Real-Time - persists & syncs)
```typescript
const [projects, setProjects] = useState<Project[]>([]);
// useEffect loads from Supabase on mount
// Add/Edit/Delete calls Supabase API
// Real-time subscription updates state when data changes anywhere
// Data persists forever in database
```

---

## 🎯 Step-by-Step: Convert Projects Module

### File: `src/admin/pages/Projects.tsx`

**Current structure:**
```
Import section
  ↓
Interface definitions
  ↓
DEFAULT_PROJECTS array
  ↓
React component with useState
  ↓
Handle functions (add/edit/delete)
  ↓
JSX render
```

**Changes needed:**
1. ✅ Add Supabase imports
2. ✅ Remove DEFAULT_PROJECTS (get from Supabase instead)
3. ✅ Add useEffect to load data on mount
4. ✅ Update handle functions to call Supabase
5. ✅ Add real-time subscription

---

## 🔧 Implementation

### Change 1: Add Imports

```typescript
// BEFORE
import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';

// AFTER
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { projectsService } from '../services/supabaseClient'; // ← NEW
```

---

### Change 2: Update useState (Remove DEFAULT_PROJECTS)

```typescript
// BEFORE
const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
const [loading, setLoading] = useState(false);

// AFTER
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(true); // ← Start as true to show loading
```

---

### Change 3: Add useEffect (Load Data on Mount)

```typescript
// ADD THIS NEW HOOK after useState declarations
useEffect(() => {
  loadProjects();
}, []);

const loadProjects = async () => {
  try {
    setLoading(true);
    const data = await projectsService.getAll();
    setProjects(data);
    
    // Subscribe to real-time changes
    const subscription = projectsService.subscribe((payload) => {
      console.log('Projects updated:', payload);
      loadProjects(); // Reload when changes happen
    });
    
    return () => subscription.unsubscribe();
  } catch (error) {
    console.error('Error loading projects:', error);
    addNotification({
      type: 'error',
      message: 'Failed to load projects',
    });
  } finally {
    setLoading(false);
  }
};
```

---

### Change 4: Update Add Function

```typescript
// BEFORE
const handleAddProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
  const newProject: Project = {
    id: Date.now().toString(),
    ...projectData,
    createdAt: new Date().toISOString(),
  };
  setProjects([newProject, ...projects]);
  addNotification({
    type: 'success',
    message: 'Project added successfully',
  });
  setShowForm(false);
};

// AFTER
const handleSaveProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
  try {
    if (editingProject) {
      // UPDATE existing
      await projectsService.update(editingProject.id, projectData);
      addNotification({
        type: 'success',
        message: 'Project updated successfully',
      });
    } else {
      // CREATE new
      await projectsService.create({
        id: Date.now().toString(),
        ...projectData,
        created_at: new Date().toISOString(),
      });
      addNotification({
        type: 'success',
        message: 'Project added successfully',
      });
    }
    setShowForm(false);
    await loadProjects(); // Refresh from database
  } catch (error) {
    console.error('Error saving project:', error);
    addNotification({
      type: 'error',
      message: 'Failed to save project',
    });
  }
};
```

---

### Change 5: Update Delete Function

```typescript
// BEFORE
const handleDeleteProject = (id: string) => {
  if (confirm('Are you sure you want to delete this project?')) {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    addNotification({
      type: 'success',
      message: 'Project deleted successfully',
    });
  }
};

// AFTER
const handleDeleteProject = async (id: string) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await projectsService.delete(id);
      addNotification({
        type: 'success',
        message: 'Project deleted successfully',
      });
      await loadProjects(); // Refresh from database
    } catch (error) {
      console.error('Error deleting project:', error);
      addNotification({
        type: 'error',
        message: 'Failed to delete project',
      });
    }
  }
};
```

---

### Change 6: Remove DEFAULT_PROJECTS Array

```typescript
// DELETE THIS ENTIRE SECTION
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'c4449fcb-6509-4fb6-bc6f-850c61db6c71',
    title: 'Custom Exposed Brick Curved Wall...',
    // ... etc
  },
];
```

---

## 🎯 That's the Pattern!

**Same pattern for ALL modules:**

| Module | Service | Import |
|--------|---------|--------|
| Projects | `projectsService` | `import { projectsService } from '../services/supabaseClient'` |
| Blog | `blogService` | `import { blogService } from '../services/supabaseClient'` |
| Gallery | `galleryService` | `import { galleryService } from '../services/supabaseClient'` |
| Happy Clients | `happyClientsService` | `import { happyClientsService } from '../services/supabaseClient'` |
| Enquiries | `enquiriesService` | `import { enquiriesService } from '../services/supabaseClient'` |
| Services | `servicesService` | `import { servicesService } from '../services/supabaseClient'` |
| Packages | `packagesService` | `import { packagesService } from '../services/supabaseClient'` |

---

## 📊 What Happens Next

### When you add a project:
1. ✅ Data sent to Supabase
2. ✅ Persists in database forever
3. ✅ Real-time subscription triggered
4. ✅ All logged-in users see it immediately
5. ✅ Page refreshes → data is still there

### When another admin updates a project:
1. ✅ Real-time subscription fires
2. ✅ Your screen updates automatically
3. ✅ No need to refresh page

### When Supabase gets new data from website form:
1. ✅ Real-time subscription fires
2. ✅ Admin panel updates automatically
3. ✅ Admin sees new enquiries instantly

---

## 🔄 Complete Modules Order

**Do these in this order:**

1. **Projects** ← Start here (most important)
2. **Happy Clients** ← Similar pattern
3. **Enquiries** ← Slightly different (filter by status)
4. **Blog** ← Medium complexity
5. **Gallery** ← Medium complexity
6. **Services** ← Simple
7. **Packages** ← Depends on Services

---

## ✅ Testing Real-Time

**After updating Projects module:**

1. Open admin panel in browser
2. Open same admin panel in **another browser tab**
3. In first tab: Add a new project
4. In second tab: **Should see it appear instantly** (no refresh needed!)
5. Delete project in first tab
6. Second tab: **Should disappear instantly**

This proves real-time is working! 🎉

---

## 💾 Data Field Mapping

When saving to Supabase, field names matter:

```typescript
// Local state (Projects.tsx)
const project = {
  id: "123",
  title: "My Project",
  description: "...",
  category: "Residential",
  mediaUrl: "https://...",
  mediaType: "image",
  createdAt: "2026-09-11T...",
};

// Supabase expects (snake_case)
const dbProject = {
  id: "123",
  title: "My Project",
  description: "...",
  category: "Residential",
  media_url: "https://...",      // ← Note: snake_case
  media_type: "image",           // ← Note: snake_case
  created_at: "2026-09-11T...",  // ← Note: snake_case
};
```

---

## 🆘 Common Issues When Converting

### Issue: "Cannot read property 'map' of undefined"
**Cause**: Projects array is still undefined when rendering  
**Fix**: Add loading state check:
```typescript
{loading ? <LoadingSpinner /> : projects.map(...)}
```

### Issue: "async/await not working"
**Cause**: Forgot to make function `async`  
**Fix**:
```typescript
// ❌ Wrong
const handleDeleteProject = (id: string) => {

// ✅ Right
const handleDeleteProject = async (id: string) => {
```

### Issue: "Real-time not updating"
**Cause**: Forgot to subscribe or subscription unsubscribed  
**Fix**: Make sure useEffect return unsubscribe:
```typescript
return () => subscription.unsubscribe();
```

---

## 📝 Checklist for Each Module

- [ ] Import the service (`projectsService`, etc.)
- [ ] Add `useEffect` hook
- [ ] Create `loadData()` function
- [ ] Add subscription inside `loadData()`
- [ ] Update add/edit/delete to use service methods
- [ ] Add error handling with `addNotification()`
- [ ] Call `loadData()` after each action
- [ ] Test in two browser tabs simultaneously
- [ ] Verify data persists on page refresh
- [ ] Verify real-time updates in second tab

---

## 🎓 Learning Resources

**Files you'll need:**
- `src/admin/services/supabaseClient.ts` - All services pre-built
- `src/admin/pages/*.tsx` - Each module page to convert
- `src/admin/store/uiStore.ts` - For `addNotification()`

**Key concepts:**
- `async/await` - Making async operations
- `useEffect` - Running code on component mount
- `.subscribe()` - Listening for real-time changes
- `.select()` - Getting data from Supabase
- `.insert()` - Creating new data
- `.update()` - Editing existing data
- `.delete()` - Removing data

---

**Ready?** Follow this pattern and your entire admin panel will be real-time! 🚀

