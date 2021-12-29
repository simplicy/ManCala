import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSession, signOut } from "next-auth/react"
import styles from '../styles/custom.module.css'
import Collapse from '@mui/material/Collapse';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export default function UserMenu() {
  const { data: session } = useSession()
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setChecked(true);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setChecked(false)
    setAnchorEl(null);
  };

  if(session){
    return (
        <div>
          <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <Collapse orientation='horizontal' collapsedSize={20} in={!checked}>
            <MenuRoundedIcon 
            sx={{ fontSize: 40,
            color: "white",
            }}            
            /> 
            </Collapse>
          </Button>
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
            <a className={styles.nostyle} href='/'><MenuItem onClick={handleClose}>Home</MenuItem></a>
            <a className={styles.nostyle} href='/dashboard'><MenuItem onClick={handleClose}>Dashboard</MenuItem></a>
            <MenuItem onClick={() => {signOut(); handleClose()}}>Logout</MenuItem>
          </Menu>
        </div>
      );
  }
  return null;
}
