import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import Mongo from '../../lib/Mongo'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import AdminModal from '../../components/AdminModal';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Tooltip } from '@material-ui/core';
import DialogModal from '../../components/DialogModal'

export default function admins({accounts}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [payload, setPayload] = useState(null);
  const { data: session, status } = useSession();
  const confirmOptions = {
    path: '/api/admins',
    method: 'DELETE',
  }

  //Opens the add Account component
  const onAddClick = () => {
    setShowAdd(true);
  }
  //Script that will run when the delete button is pressed
  //Finds all checked rows in the table and makes a list of them to send to the database to be deleted
  const onDelete = () => {
    var e = document.querySelectorAll("input[type='checkbox']:checked");
    if(e.length<1)
      toast('Select at least 1 account to delete.');
    else{
      var toDelete = [e.length]
      for(var n = 0; n<e.length; n++){
        if(e[n].id != "checkAll"){
          toDelete.push(document.getElementsByName(e[n].id)[1].innerHTML)  
        }     
      }
      setPayload(toDelete)
      setConfirm(true)
    }
  }
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
  if(session){
    return (
      <div className={styles.container}>
          <main className={styles.main}>
          <h1 className={styles.title}>
              Manage Administrators
          </h1>
          <div>
            <Toaster/>
            <div style={{display:"flex"}}>
              <Tooltip onClick={()=>{onAddClick()}} title="Add">
                <IconButton>
                  <AddIcon   sx={{ fontSize: 30,color: "black"}}/>
                </IconButton>
              </Tooltip>
              <div style={{flex:3}}/>
              <Tooltip onClick={()=>{onDelete()}} title="Remove">
                <IconButton>
                  <RemoveIcon id='deleteButton' sx={{ fontSize: 30,color: "black"}}/>
                </IconButton>
              </Tooltip>
            </div>   
            <DialogModal show={showConfirm} onClose={()=>setConfirm(false)} payload={payload} options={confirmOptions} title={"Delete selected."}>
              Are you sure? This action cannot be undone.
            </DialogModal>            
            <AdminModal  onClose={() => setShowAdd(false)} show={showAdd}/>

            <div className={styles.yscroll, styles.accTable}>
            <table class="table table-bordered table-striped mb-0">
                <thead>
                <tr className={styles.tableRow}>
                    <th scope='col'>
                      <input className={styles.card} id="checkAll" onChange={(value) => onCheckAll(value.target.checked)} type="checkbox" />
                    </th>                                        
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
                <tbody>
                { accounts != {} ? accounts.map((user, index) => (                    
                    <tr key={index} id={index} className={styles.tableRow, styles.rowDiv} onClick={(e)=>onCheck(e,index)} >
                        <td key="checkbox" id={index}>
                          <input id={index} className={styles.card}  type="checkbox" />
                        </td>
                        <td key="name" id={index}>
                          <div className={styles.rowItem}>
                            <div name={index}>
                              {user.name}
                            </div>                            
                          </div>
                        </td>
                        <td key="email" id={index}>
                          <div className={styles.rowItem}>
                            <div name={index}>
                              {user.email}
                            </div>                                                                     
                          </div>
                        </td>        
                    </tr>
                    )): null
                }
                </tbody>
            </table>
            </div>
          </div>
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

