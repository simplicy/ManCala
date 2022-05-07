import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {signIn} from "next-auth/react"
import { useSession } from "next-auth/react"
import Menu from './Menu'
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
      <AppBar position="static" sx={{backgroundColor:'gray'}}>
        <Toolbar>          
          <Button color="inherit" variant='text' onClick={()=>{router.push("/accounts")}}>
            <Typography variant="h6"  component="div" sx={{ flexGrow: 1}}>              
                Home              
            </Typography>          
          </Button>
          <Typography variant="h6"  component="div" sx={{ flexGrow: 1 }}>             
          </Typography>
          {session ? ( <Menu /> ):(
            <Button onClick={() => {signIn("google",{callbackUrl:window.location.pathname})}}color="inherit">Login</Button>
          )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}