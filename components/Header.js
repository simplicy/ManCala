import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {signIn} from "next-auth/react"
import { useSession } from "next-auth/react"
import UserMenu from './UserMenu'
import { useRouter } from 'next/router';

export default function ButtonAppBar() {  
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === "loading") {
    return (
      null
    )
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:'purple'}}>
        <Toolbar>          
          <Button color="inherit" variant='text' onClick={()=>{router.push("/")}}>
            <Typography variant="h6"  component="div" sx={{ flexGrow: 1 }}>              
                Home              
            </Typography>          
          </Button>
          <Typography variant="h6"  component="div" sx={{ flexGrow: 1 }}>             
          </Typography>
          {session ? ( <UserMenu /> ):(
            <Button onClick={() => signIn("google",{callbackUrl:'http://localhost:3000/'})} color="inherit">Login</Button>
          )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}