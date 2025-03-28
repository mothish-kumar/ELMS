import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Typography } from "@mui/material";
import { VideoLibrary, School, Assignment, Person} from "@mui/icons-material";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TelegramIcon from '@mui/icons-material/Telegram';

const InstructorSlideBar = ({ onSelect }) => {
  const useName = localStorage.getItem("useName")||"Unknown"
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          bgcolor: "var(--background-color)",
          color: "var(--text-color)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh", 
          overflow: "hidden", 
          borderRight: "none", 
      boxShadow: "none",
        },
      }}
    >

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          <ListItem button onClick={() => onSelect("dashboard")} style={{marginTop:'100px'}}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <School />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => onSelect("courses")}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>
          <ListItem button onClick={() => onSelect("videos")}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <VideoLibrary />
            </ListItemIcon>
            <ListItemText primary="Videos" />
          </ListItem>
          <ListItem button onClick={() => onSelect("assignments")}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Assignments" />
          </ListItem>
          <ListItem button onClick={() => onSelect("submissions")}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <AssignmentTurnedInIcon/>
            </ListItemIcon>
            <ListItemText primary="Submissions" />
          </ListItem>
          <ListItem button onClick={() => onSelect("chat")}>
            <ListItemIcon sx={{ color: "var(--text-color)" }}>
              <TelegramIcon/>
            </ListItemIcon>
            <ListItemText primary="Chats" />
          </ListItem>
        </List>
      </Box>

 
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          width: "100%",
          position: "relative", 
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Person />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "14px" }} style={{marginLeft:'25px'}}>
            {useName}
          </Typography>

        </Box>
      </Box>
    </Drawer>
  );
};

export default InstructorSlideBar;
