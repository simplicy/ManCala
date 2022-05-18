import styles from '../../../styles/custom.module.css'
import Calendar from '../../../components/Calendar'
import { useSession } from "next-auth/react"
import Mongo from '../../../lib/Mongo'

export default function AccoundID({account, calendars}) {
  //If session is there, or user is signed in will serve them this page. 
  const { data: session, status } = useSession()
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is not signed in
  if(session){
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>
            {account.name}
        </h1>
        <Calendar
          calendars={calendars}
          accountUserList={account}
          session={session}
        />
      </main>
    ) 
  }
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>
            Access Denied!
        </h1>
        <div className={styles.grid}>
            <h2>Please Sign in using your company email to continue. &rarr;</h2>
        </div>        
      </main>
    </>
  )
}

export async function getServerSideProps(params) {
  const mongoose = await Mongo()
  if(!mongoose){
    throw new Error 
    "Database is not connected!"
  }
  
  const db = await fetch('http://localhost:3000/api/accounts/', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      id:params.query.id,
    },
  })
  
  const dbResponse = await (db.json())
  const account = dbResponse.data[0] || {}

  const userEmails = account.users.map(data =>{
    return data.email
  }).join(",")

  const api = await fetch('http://localhost:3000/api/calendars/?emails='+userEmails, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const apiResponse = await (api.json())
  const calendars = apiResponse.data || {}
  
  //console.log(apiResponse)
  return { props: { account, calendars} }
}