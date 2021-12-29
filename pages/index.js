import styles from '../styles/custom.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import mongo from '../lib/Mongo'

export default function Home() {
  const { data: session, status } = useSession()
  const isAdmin = true;
  if (status === "loading") {
    return (
      null
    )
  }
  if(session){
    if(isAdmin){
      return (
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>
              <a href="https://github.com/simplicy/next-calendar-manager">Calendar Manager</a>
            </h1>
  
            <div className={styles.row}>
              <a href="/accounts" className={styles.card}>
                <h2>All Accounts &rarr;</h2>
                <p>View a list of our client's calendars.</p>
              </a>
            </div>
            <div className={styles.row}>  
              <a href="/dashboard" className={styles.card}>
                <h2>Dashboard &rarr;</h2>
                <p>Access Administrative Dashboard.</p>
              </a>
            </div>
          </main>
        </div>
      )
    }
    else{
      return (
        <div className={styles.container}>
          <main className={styles.main}>
            <h1 className={styles.title}>
              <a href="https://github.com/simplicy/next-calendar-manager">Calendar Manager</a>
            </h1>
  
            <div className={styles.row}>
              <a href="/accounts" className={styles.card}>
                <h2>All Accounts &rarr;</h2>
                <p>View a list of our client's calendars.</p>
              </a>
            </div>
          </main>
        </div>
      )
    }
  }
  else{
    return (
    <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <a href="https://github.com/simplicy/next-calendar-manager">Calendar Manager</a>
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
