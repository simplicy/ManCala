import styles from '../../styles/custom.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import dbConnect from '../../lib/Mongo'
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter();
  const isAdmin = true;
  if (status === "loading") {
    return (
      null
    )
  }
  if(session && isAdmin){
    return (
    <div className={styles.container}>
        <main className={styles.main}>
        <h1 className={styles.title}>
            Dashboard
        </h1>

        <div className={styles.row}>
            <a onClick={()=>{router.push("/accounts")}} className={styles.card}>
            <h2>All Accounts &rarr;</h2>
            <p>View a list of our client's calendars.</p>
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
              <h2>Please Sign in using your company email to continue. &rarr;</h2>
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
