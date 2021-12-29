import React from "react";
import {AppBar} from "@material-ui/core";
import LoginButton from "./LoginButton";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function Header(){
    const { data: session, status } = useSession()
    if (status === "loading") {
        return (
          null
        )
      }  
  if (session) {
    return (
        <AppBar style={{height:"55px"}}>
            <div style={{display: "flex"}}>
                <div style={{width: "auto", marginLeft:"auto"}}><UserMenu /></div>
            </div>            
        </AppBar>
    );
  }
  else{
      return (
        <AppBar style={{height:"85px"}}>
            <div style={{display: "flex"}}>
                <div style={{width: "200px", marginLeft:"auto",marginRight:"5px",paddingTop:"15px"}}><LoginButton /></div>
            </div>
        </AppBar>
      )
  }
} 