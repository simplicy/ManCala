import styles from '../../styles/custom.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from 'react'
export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();
  var [admin, setAdmin] = useState(false)
  if(session){
    //This is bad, but will be changed once the DB lookup is fixed
    var admins = ["dana.thomas@cmscom.co","sean.hopkins@cmscom.co","rbensman@cmscom.co","ratchetclnk55@gmail.com"]
    admins.map(data => {
      console.log(data == session.user.email)
      if(data == session.user.email){
        admin = true
        return;
      }
    })
  }
  if (status === "loading") {
    return (
      null
    )
  }
  if(session && admin==true){
    return (
    <div className={styles.container}>
        <main className={styles.main}>
        <h1 className={styles.title}>
            Dashboard
        </h1>

        <div className={styles.row}>
            <a onClick={()=>{router.push("/")}} className={styles.card}>
            <h2>All Accounts &rarr;</h2>
            <p>View a list of our clients calendars.</p>
            </a>
            <a onClick={()=>{router.push("/dashboard/admins")}} className={styles.card}>
            <h2>Manage Administrators &rarr;</h2>
            <p>Manage who has access to the dashboard</p>
            </a>
        </div>

        <div className={styles.row}>
            <a onClick={()=>{router.push("/dashboard/accounts")}} className={styles.card}>
            <h2>Manage Accounts &rarr;</h2>
            <p>Add, Edit or Delete accounts in the database.</p>
            </a>

            

            <a onClick={()=>{router.push("/dashboard/logs")}} className={styles.card}>
            <h2>View Logs &rarr;</h2>
            <p>View logs of all Calendar event changes.</p>
            </a>
        </div>
        </main>
    </div>
    )
  }
  else{
    return (
      <div>
        <main className={styles.main}>
          <h1 className={styles.title}>
              Access Denied!
          </h1>
          <div className={styles.grid}>
              <h2>You must be an administrator to access this page &rarr;</h2>
          </div>        
        </main>
      </div>
    )}
}

export async function getServerSideProps(params) {
    /* Can remove this when you get mongodb set up */

    return {
      props: {
        
      },
    }
  }
