import styles from '../../../styles/custom.module.css'
import Calendar from '../../../components/Calendar'
import { useSession } from "next-auth/react"

export default function AccoundID() {
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
      <div>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Account Page
          </h1>
          <Calendar />
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

