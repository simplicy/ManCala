import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import Mongo from '../../lib/Mongo'
import LogTable from '../../components/tables/LogTable'

export default function admins({accounts: logList}) {
  const { data: session, status } = useSession();
  const isAdmin = true;
  //When the top most checkbox is checked, will check all entries in the table
  const onCheckAll = (checked) => {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    if (checked === true) {
        for(var n=0;n<checkboxes.length;n++)
          checkboxes[n].checked=true
    }
    if(checked == false){
      for(var n=0;n<checkboxes.length;n++)
          checkboxes[n].checked=false
    }
  }
  //Checks the checkbox if the row is clicked
  const onCheck = (e,index) => {
    var checkbox = document.querySelectorAll("input[type='checkbox']")[index+1];
    if (checkbox.checked)
      checkbox.checked = false
    else if (!checkbox.checked)
      checkbox.checked = true
    
  }

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
      <div className={styles.container}>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Logs
          </h1>
          <LogTable rows={logList} title="Logs"/> 
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
  const res = await fetch('http://localhost:3000/api/logs', {
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

