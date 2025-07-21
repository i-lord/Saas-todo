import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Chip,
  CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProject } from '../../features/projects/projectsSlice';

const ProjectSelect = () => {
  const dispatch = useDispatch();
  const { projects, currentProjectId, status } = useSelector((state) => state.projects);
  
  const handleProjectChange = (event) => {
    const projectId = event.target.value;
    dispatch(setCurrentProject(projectId));
  };
  
  const currentProject = projects.find(p => (p.projectId || p.id) === currentProjectId);
  
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading projects...</Typography>
      </Box>
    );
  }
  
  if (projects.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No projects found. Create your first project!
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Select Project</InputLabel>
        <Select
          value={currentProjectId || ''}
          label="Select Project"
          onChange={handleProjectChange}
          renderValue={(value) => {
            const project = projects.find(p => (p.projectId || p.id) === value);
            return project ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{project.name}</Typography>
                <Chip 
                  label={`${project.taskCount || 0} tasks`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            ) : 'Select Project';
          }}
        >
          {projects.map((project) => (
            <MenuItem key={project.projectId || project.id} value={project.projectId || project.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <Typography variant="body2" fontWeight={600}>
                  {project.name}
                </Typography>
                {project.description && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {project.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip 
                    label={`${project.taskCount || 0} tasks`} 
                    size="small" 
                    variant="outlined"
                  />
                  <Chip 
                    label={new Date(project.createdAt).toLocaleDateString()} 
                    size="small" 
                    variant="outlined"
                    color="secondary"
                  />
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {currentProject && (
        <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Current: {currentProject.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectSelect;