import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSession, signOut } from "next-auth/react"
import MenuIcon from '@mui/icons-material/Menu';
import { Tooltip } from '@material-ui/core';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
export default function UserMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if(session){
    return (
        <>
            <Tooltip title="Menu">
              <IconButton
              edge="start"
              color="inherit"
              aria-label="basic-menu"
              sx={{ mr: 2 }}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              >
                {open ? <KeyboardArrowUp style={{fill: "white"}} fontSize='large'/> : <MenuIcon style={{fill: "white"}} fontSize='large'/>}
              </IconButton>
            </Tooltip>   
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>Signed in as <br/>{session.user.email.substring(0,session.user.email.indexOf("@"))}</MenuItem>            
            <MenuItem onClick={()=>{router.push("/dashboard"); handleClose()}}>Dashboard</MenuItem>
            <MenuItem onClick={() => {signOut(); handleClose()}}>Logout</MenuItem>
          </Menu>
        </>
      );
  }
}
