import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import Mongo from '../../lib/Mongo'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UserTable from '../../components/UserTable'
export default function manage({users}) {
  const { data: session, status } = useSession()
  const isAdmin = true;
  //If session is there, or user is signed in will serve them this page. 
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is signed in
  //Displays a table of the account database, to edit and manipulate from here
  if(session && isAdmin){
    return (
      <div>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Accounts
          </h1>
          <UserTable rows={users} session={session} title="Users" /> 
          </main>
      </div>
    )
  }
  //Access denied screen if they are not logged in
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
//Get accounts from database before the page loads in.
export async function getServerSideProps(params) {
  const mongoose = await Mongo()
  if(!mongoose){
    throw new Error 
      "Database is not connected!"
  }

  const res = await fetch('http://localhost:3000/api/users', {
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

