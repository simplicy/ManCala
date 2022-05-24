import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import Mongo from '../../lib/Mongo'
import AdminTable from '../../components/tables/AdminTable'
export default function Admin({accounts}) {
  const { data: session, status } = useSession()
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
  //If session is there, or user is signed in will serve them this page. 
  if (status === "loading") {
    return (
      null
    )
  }
  //Returns this page if user is signed in
  //Displays a table of the account database, to edit and manipulate from here
  if(session && admin==true){
    console.log(session)
    return (
      <div>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Admins
          </h1>
          <AdminTable rows={accounts} session={session} title="Administrators"/> 
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
            <h2>You must be an administrator to access this page &rarr;</h2>
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
  const res = await fetch('http://localhost:3000/api/admins', {
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

