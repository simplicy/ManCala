import styles from '../../../styles/custom.module.css'
import Calendar from '../../../components/Calendar'
import { useSession } from "next-auth/react"
import Mongo from '../../../lib/Mongo'

export default function AccoundID({account}) {
  //If session is there, or user is signed in will serve them this page. 
  console.log(account)
  const { data: session, status } = useSession()
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is not signed in
  if(session){
    return (
      <>
          <main className={styles.main}>
          <h1 className={styles.title}>
              {account[0].name}
          </h1>

         
            <Calendar
              account={account}
            />
         
          </main>
      </>
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
  const cals = await fetch('http://localhost:3080/api/calendars/', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      email:'ratchetclnk55@gmail.com',
    },
  })
  
  const res = await fetch('http://localhost:3000/api/accounts/', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      id:params.query.id,
    },
  })
  const payload = await (res.json())
  const account = payload.data || {}

  return { props: { account} }
}


