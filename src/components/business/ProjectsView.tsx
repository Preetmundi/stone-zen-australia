import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Project, Customer } from '@/types/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface ProjectsViewProps {
  customers: Customer[];
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
}

// Placeholder for ProjectModal (to be implemented)
const ProjectModal = ({ open, onClose, onSave, project, customers }: any) => null;

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  customers,
  onNewProject,
  onSelectProject
}) => {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditName, setInlineEditName] = useState('');
  const [inlineEditStatus, setInlineEditStatus] = useState('');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/api/projects');
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setModalOpen(true);
  };
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };
  const handleView = (project: Project) => {
    setViewProject(project);
  };
  const handleInlineEdit = (project: Project) => {
    setInlineEditId(project.id);
    setInlineEditName(project.projectName);
    setInlineEditStatus(project.status);
  };
  const handleInlineSave = async (project: Project) => {
    try {
      await api.put(`/api/projects/${project.id}`, {
        ...project,
        projectName: inlineEditName,
        status: inlineEditStatus,
      });
      fetchProjects();
    } catch {
      setError('Failed to update project');
    }
    setInlineEditId(null);
  };
  const handleDelete = async (project: Project) => {
    try {
      await api.del(`/api/projects/${project.id}`);
      fetchProjects();
    } catch {
      setError('Failed to delete project');
    }
  };
  const handleSave = async (project: Project) => {
    try {
      if (project.id) {
        await api.put(`/api/projects/${project.id}`, project);
      } else {
        await api.post('/api/projects', project);
      }
      fetchProjects();
    } catch {
      setError('Failed to save project');
    }
    setModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'quote': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <Button onClick={handleAdd} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Projects</CardTitle>
            <div className="flex space-x-2">
              <select className="px-3 py-1 border border-input rounded text-sm bg-background">
                <option>All Status</option>
                <option>Quote</option>
                <option>Approved</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <select className="px-3 py-1 border border-input rounded text-sm bg-background">
                <option>All Types</option>
                <option>Kitchen</option>
                <option>Bathroom</option>
                <option>Commercial</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(project => {
                  const customer = customers.find(c => c.id === project.customerId);
                  const isEditing = inlineEditId === project.id;
                  return (
                    <tr key={project.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input value={inlineEditName} onChange={e => setInlineEditName(e.target.value)} className="border px-2 py-1 rounded w-full" />
                        ) : (
                          <div>
                            <p className="font-medium text-foreground">{project.projectName}</p>
                            <p className="text-sm text-muted-foreground">{project.address}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-foreground">{customer?.name}</p>
                          <p className="text-sm text-muted-foreground">{customer?.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize text-foreground">{project.projectType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-foreground">
                          ${project.totalCost.toLocaleString('en-AU')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <select value={inlineEditStatus} onChange={e => setInlineEditStatus(e.target.value)} className="border px-2 py-1 rounded">
                            <option value="quote">Quote</option>
                            <option value="approved">Approved</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {project.createdAt.toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(project)}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Quote
                          </Button>
                          {isEditing ? (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleInlineSave(project)}>Save</Button>
                              <Button variant="ghost" size="sm" onClick={() => setInlineEditId(null)}>Cancel</Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleInlineEdit(project)}>Edit</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>Edit (Modal)</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(project)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Modal for Add/Edit Project */}
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={() => setModalOpen(false)} project={editingProject} customers={customers} />
      {/* Dialog for Project Details */}
      <Dialog open={!!viewProject} onOpenChange={open => !open && setViewProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {viewProject && (
            <div>
              <p><b>Name:</b> {viewProject.projectName}</p>
              <p><b>Type:</b> {viewProject.projectType}</p>
              <p><b>Status:</b> {viewProject.status}</p>
              <p><b>Customer:</b> {customers.find(c => c.id === viewProject.customerId)?.name}</p>
              <p><b>Address:</b> {viewProject.address}</p>
              <p><b>Created:</b> {viewProject.createdAt.toLocaleDateString('en-AU')}</p>
              {/* Add more details as needed */}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};