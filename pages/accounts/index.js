import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import React from "react";
import Mongo from '../../lib/Mongo'
import Link from 'next/link'
import { Input } from '@material-ui/core';
export default function Accounts({accounts}) {
  const { data: session, status } = useSession()
  var searchQuery = "";
  const handleSearch = (value) => {
    console.log(value)
    if(value==null)
      searchQuery=searchQuery.substring(0,searchQuery.length-1)
    else
      searchQuery+=value
    console.log(searchQuery)
  }
  //If session is there, or user is signed in will serve them this page. 
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is not signed in
  if(session){
    return (
      <div className={styles.container}>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Accounts Page
          </h1>
          <div>
            <Input className={styles.searchBar} placeholder="Search by Name or Account Number" type="text" onChange={(value)=>{handleSearch(value.nativeEvent.data)}}/>
          </div>          
          <div className={styles.yscroll, styles.accGrid}>
            <div className={styles.grid}>
            { accounts.length > 0 ? (
              accounts.map((client) => (
                
                <Link href={{
                  pathname: '/accounts/'+client.accountID}} as={'/accounts/'+client.accountID}>
                  <div className={styles.accountCard}>
                    <a>
                      <h4>{client.friendlyName}</h4>  
                      <h5>{client.accountID}</h5>
                    </a>                                      
                  </div>
                </Link>         
              ))):(
                <h2 className="subtitle">
                No Accounts Found
                </h2>
              )     
            }
            </div>
          </div>
          </main>
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


