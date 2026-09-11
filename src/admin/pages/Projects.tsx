import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Film, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardBody, CardHeader, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { ProjectForm } from '../components/ProjectForm';
import { useUIStore } from '../store/uiStore';
import { projectsService } from '../services/supabaseClient';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  media_url?: string;
  mediaUrl?: string;
  media_type?: string;
  mediaType?: 'image' | 'video';
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { addNotification } = useUIStore();

  const categories = [
    'Residential',
    'Modular Kitchen',
    'Commercial',
    'Custom Furniture',
    'General Construction'
  ];

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsService.getAll();
      console.log('Loaded projects from Supabase:', data);
      setProjects(data || []);
      
      // Subscribe to real-time changes
      const subscription = projectsService.subscribe((payload: any) => {
        console.log('Real-time update received:', payload);
        loadProjects(); // Reload when changes happen
      });
      
      return () => subscription?.unsubscribe();
    } catch (error: any) {
      console.error('Error loading projects:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load projects: ' + (error.message || 'Unknown error'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsService.delete(id);
        addNotification({
          type: 'success',
          message: 'Project deleted successfully',
        });
        await loadProjects();
      } catch (error: any) {
        console.error('Error deleting project:', error);
        addNotification({
          type: 'error',
          message: 'Failed to delete project',
        });
      }
    }
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        // Edit existing
        await projectsService.update(editingProject.id, projectData);
        addNotification({
          type: 'success',
          message: 'Project updated successfully',
        });
      } else {
        // Add new
        const newProjectData = {
          id: Date.now().toString(),
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          media_url: projectData.mediaUrl || projectData.media_url,
          media_type: projectData.mediaType || projectData.media_type || 'image',
        };
        console.log('Saving project to Supabase:', newProjectData);
        await projectsService.create(newProjectData);
        addNotification({
          type: 'success',
          message: 'Project added successfully',
        });
      }
      setShowForm(false);
      await loadProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      addNotification({
        type: 'error',
        message: 'Failed to save project: ' + (error.message || 'Unknown error'),
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">Manage your portfolio projects and videos ({projects.length} total)</p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={handleAddProject}
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {/* Project Form Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            categories={categories}
            onSave={handleSaveProject}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Projects List */}
        {loading ? (
          <Card>
            <CardBody className="text-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </CardBody>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 mb-4">No projects yet. Create your first project!</p>
              <Button variant="primary" onClick={handleAddProject}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Media Preview */}
                <div className="h-48 bg-gray-900 overflow-hidden relative group flex items-center justify-center">
                  {(project.media_type || project.mediaType) === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Film className="w-6 h-6 text-white fill-white" />
                      </div>
                      <p className="text-white text-xs font-semibold">VIDEO</p>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardBody className="space-y-3">
                  <div>
                    <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {new Date(project.created_at || project.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </CardBody>

                {/* Actions */}
                <CardFooter className="gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
