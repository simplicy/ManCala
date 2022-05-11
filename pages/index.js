import styles from '/styles/custom.module.css'
import { useSession } from "next-auth/react"
import React from "react";
import Mongo from '/lib/Mongo'
import { useRouter } from 'next/router';
import AccountList from '/components/AccountList'
import { Card, Grid } from "@mui/material";

export default function Accounts({accounts}) {
  const router = useRouter();
  const { data: session, status } = useSession()
  //If session is there, or user is signed in will serve them this page. 
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is not signed in
  if(session){
    return (
      <div >
        <Grid  container spacing={2}>
          <Grid item xs={2}/>
          <Grid item xs={8}>
            <h1 className={styles.title}>
                Accounts Page
            </h1>
            <AccountList accounts={accounts}/>
          </Grid>
          <Grid item xs={2}/>
        </Grid>
      </div>
    )
  }
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
            Access Denied!
        </h1>
        <div className={styles.grid}>
            <h2>Please Sign in using your company email to continue. &rarr;</h2>
        </div>        
      </main>
    </div>
  )
}

export async function getServerSideProps(params) {
  const mongoose = await Mongo()
  if(!mongoose){
    throw new Error 
    "Database is not connected!"
  }
  
  const res = await fetch('http://localhost:3000/api/accounts', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  const payload = await (res.json())
  const accounts = payload.data || {}

  return { props: { accounts} }
}


