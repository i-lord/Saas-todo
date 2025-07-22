import React from "react";
import AppBar from "@mui/material/AppBar";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentProject } from "../features/projects/projectsSlice";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ListSubheader from '@mui/material/ListSubheader';

const drawerWidth = 240;

const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "" },
  { text: "Tasks", icon: <AssignmentIcon />, path: "/tasks" },
  { text: "Analytics", icon: <BarChartIcon />, path: "/analytics" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

function ProjectSelector({ inDrawer = false }) {
  const dispatch = useDispatch();
  const { projects, currentProjectId, status } = useSelector((state) => state.projects);

  if (status === "loading") {
    return <CircularProgress size={28} sx={{ ml: inDrawer ? 0 : 2 }} />;
  }
  if (!projects.length) {
    return null;
  }
  return (
    <FormControl size="small" sx={{ 
      minWidth: 180, 
      ml: inDrawer ? 0 : 2, 
      width: inDrawer ? '100%' : 'auto',
      mt: inDrawer ? 2 : 0 
    }}>
      <InputLabel id="project-selector-label">Project</InputLabel>
      <Select
        labelId="project-selector-label"
        value={currentProjectId || ""}
        label="Project"
        onChange={(e) => dispatch(setCurrentProject(e.target.value))}
      >
        {projects.map((project) => (
          <MenuItem key={project.projectId || project.id} value={project.projectId || project.id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation();
  const { projects, currentProjectId } = useSelector((state) => state.projects);

  const handleNavClick = (path) => {
    navigate(`/app${path === '/dashboard' ? '' : path}`);
    setMobileOpen(false); // Close drawer on mobile
  };

  const drawer = (
    <div>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>SaaS To-Do</Typography>
        <ProjectSelector inDrawer />
      </Box>
      <List
        subheader={
          <ListSubheader component="div" disableSticky sx={{ fontWeight: 700, fontSize: 16, bgcolor: 'background.paper' }}>
            Main
          </ListSubheader>
        }
      >
        {navItems.map((item) => {
          const isActive = item.text === "Home"
            ? location.pathname === "/app" || location.pathname === "/app/"
            : location.pathname === `/app${item.path}`;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                selected={isActive}
                sx={isActive ? {
                  bgcolor: 'primary.100',
                  fontWeight: 700,
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                } : {}}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={isActive ? { fontWeight: 700 } : {}} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <List
        subheader={
          <ListSubheader component="div" disableSticky sx={{ fontWeight: 700, fontSize: 16, bgcolor: 'background.paper', mt: 2 }}>
            Projects
          </ListSubheader>
        }
      >
        {projects && projects.length > 0 ? projects.map((project) => {
          const isCurrent = (project.projectId || project.id) === currentProjectId;
          return (
            <ListItem key={project.projectId || project.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  dispatch(setCurrentProject(project.projectId || project.id));
                  // Stay on current page but switch project context
                }}
                selected={isCurrent}
                sx={isCurrent ? {
                  bgcolor: 'secondary.100',
                  fontWeight: 700,
                  color: 'secondary.main',
                  '& .MuiListItemIcon-root': { color: 'secondary.main' }
                } : {}}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary={project.name} sx={isCurrent ? { fontWeight: 700 } : {}} />
              </ListItemButton>
            </ListItem>
          );
        }) : (
          <ListItem>
            <ListItemText primary="No projects" sx={{ color: 'text.secondary' }} />
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            SaaS To-Do App
          </Typography>
          {/* Project Selector - hidden on mobile */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ProjectSelector />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, // Responsive padding
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
