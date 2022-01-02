import styles from '../../styles/custom.module.css'
import { useSession } from "next-auth/react"
import Mongo from '../../lib/Mongo'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import toast, { Toaster } from 'react-hot-toast';
import DeleteModal from '../../components/DialogModal';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Tooltip } from '@material-ui/core';
import Input from '@mui/material/Input';
import SaveModal from '../../components/DialogModal';
import AddModal from '../../components/FormDialog'

export default function manage({accounts}) {  
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showAdd, setShowAdd] = useState(false);
  const [Editing, setEditing] = useState(false);
  const [SaveChanges, setSaveChanges] = useState(false);
  const [oldAccount, setOldAccount] = useState(null)
  const [AccountNumber,setAccountNumber] = useState('');
  const [AccountName,setAccountName] = useState('');
  const [AccountEmail,setAccountEmail] = useState('');
  const [showConfirm, setConfirm] = useState(false);
  const [payload, setPayload] = useState(null)
  const { data: session, status } = useSession()
  const confirmOptions = {
    path: '/api/accounts',
    method: 'DELETE',
  }
  const saveOptions = {
    path: '/api/accounts',
    method: 'PUT',
  }
  const onSubmit = async data => {
    const req = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        }) 
    const json = await req.json()
    toast(json.message)
    if(json.success == true){
      var logContent = {
        group:'admins',
        data: JSON.stringify(data),
      }
      const loggit = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify(logContent), 
        })
        const loggitJson = await loggit.json()
        if(loggitJson.success==true){
          setShowAdd(false)
          router.reload(window.location.pathname);
        } 
      }
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
          toDelete.push(document.getElementsByName(e[n].id)[4].innerHTML)  
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
  //cancel script to cancel editing
  const onCancel = (idx) =>{
    var cancel = document.getElementsByName("cancel")[idx]
    if(Editing){
      var e = document.getElementsByName(idx)
      for(var n = 0; n < e.length; n=n+2){
        e[n].style.display="flex"
        e[n+1].style.display="none"
      }      
      var edit = document.getElementsByName("Edit")[idx]
      var save = document.getElementsByName("Save")[idx]
      setAccountNumber('')
      setAccountName('')
      setAccountEmail('')
      edit.style.display="block"
      save.style.display="none"
      cancel.style.display="none"
      setEditing(false)      
    }
  }
  //Edit Script to edit the currently selected row(s)
  const onEdit = (idx, name, acc, cal) =>{
    if(!Editing){      
      var e = document.getElementsByName(idx)
      for(var n = 0; n < e.length; n=n+2){
        e[n].style.display="none"
        e[n+1].style.display="flex"
      }
      var edit = document.getElementsByName("Edit")[idx]
      var save = document.getElementsByName("Save")[idx]
      var cancel = document.getElementsByName("cancel")[idx]
      edit.style.display="none"
      save.style.display="block"
      cancel.style.display="block"
      setAccountEmail(cal)
      setOldAccount({
        accountID:acc,
        friendlyName:name,
        calendarID:cal
      })
      setEditing(true)
    }else{
      toast("You can only edit one account at a time!")
    }
  }
  //packages data to be saved to the database and replace the old entry
  const onSave = (index) => {
    if(AccountName=='' && AccountEmail==oldAccount.calendarID && AccountNumber==''){
      toast("No changes made.")
      onCancel(index)
    }
    else{
      if(AccountName=='')
        AccountName=oldAccount.friendlyName
      if(AccountNumber=='')
        AccountNumber=oldAccount.accountID
        var updatedDetails = {
          accountID:AccountNumber,
          friendlyName: AccountName,
          calendarID: AccountEmail
        }
        setPayload(updatedDetails)
        setSaveChanges(true)
    }
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
              Manage Clients
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
            <DeleteModal show={showConfirm} onClose={()=>setConfirm(false)} payload={payload} options={confirmOptions} title={"Delete selected?"}>
              Are you sure? This action cannot be undone.
            </DeleteModal> 
            <AddModal onClose={() => setShowAdd(false)} show={showAdd} payload={payload} options={confirmOptions} onSubmit={handleSubmit(onSubmit)} title={"Add Account"}>
            <form  onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" placeholder="Friendly Account Name" {...register("friendlyName", {required:true})} />
                    <br/> <br/> 
                    <Input type="text" placeholder="Account Number"inputProps={{ maxLength: 4 }} {...register("accountID", {required: true})} />
                    <br/> <br/> 
                    <Input type="email" placeholder="Account Email" {...register("calendarID", {required:true, })} />           
              </form>
            </AddModal>
            <SaveModal show={SaveChanges} onClose={()=>setSaveChanges(false)} payload={payload} options={saveOptions} title={"Save changes?"}>
              The account will be overwritten. 
            </SaveModal>
            <div className={styles.yscroll, styles.accTable}>
            <table class="table table-bordered table-striped mb-0">
                <thead>
                <tr className={styles.tableRow}>
                    <th scope='col'>
                      <input className={styles.card} id="checkAll" onChange={(value) => onCheckAll(value.target.checked)} type="checkbox" />
                    </th>                    
                    <th scope="col" style={{maxWidth:"80px"}}>Account Number</th>
                    <th scope="col">Friendly Name</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
                <tbody>
                { accounts != {} ? accounts.map((client, index) => (                    
                    <tr key={index} id={index} className={styles.tableRow, styles.rowDiv} onClick={(e)=>onCheck(e,index)} >
                        <td key="checkbox" id={index}>
                          <input id={index} className={styles.card}  type="checkbox" />
                        </td>                        
                        <td key="accountID" id={index}>
                          <div className={styles.rowItem}>
                            <div name={index}>
                              {client.accountID}
                            </div>
                            <div name={index} style={{display:"none",flex:1}}>
                              <Input onChange={(e)=>{setAccountNumber(e.target.value)}} value={AccountNumber} style={{maxHeight:"2rem",flex:1}} placeholder={client.accountID}></Input>
                            </div>              
                          </div>
                        </td>
                        <td key="friendlyName" id={index}>
                          <div className={styles.rowItem}>
                            <div name={index}>
                              {client.friendlyName}
                            </div>
                            <div name={index} style={{display:"none",flex:1}}>
                              <Input onChange={(e)=>{setAccountName(e.target.value)}} value={AccountName} style={{maxHeight:"2rem",flex:1}} placeholder={client.friendlyName}></Input>
                            </div>
                          </div>
                        </td>
                        <td key="calendarID" id={index}>
                          <div className={styles.rowItem}>
                            <div name={index}>
                              {client.calendarID}
                            </div>
                            <div name={index} style={{display:"none",flex:9}}>
                              <Input onChange={(e)=>{setAccountEmail(e.target.value)}} value={AccountEmail} style={{maxHeight:"2rem",flex:9}} placeholder={client.calendarID}></Input>
                            </div>
                            <div name="cancel" id={index} style={{display:"none"}} onClick={()=>onCancel(index)}>
                              <Tooltip title="Cancel">
                                <IconButton>
                                  <CancelIcon sx={{ fontSize: 25,color: "black",backgroundcolor:"white",}}/>
                                </IconButton>
                              </Tooltip>
                            </div>                            
                          </div>
                        </td>
                        <td>
                          <div name="Edit">
                          <Tooltip onClick={()=>onEdit(index,client.friendlyName,client.accountID,client.calendarID)} title="Edit">
                            <IconButton>
                              <EditIcon sx={{ fontSize: 25,color: "black"}}/>
                            </IconButton>
                          </Tooltip>
                          </div>                                           
                          <div name="Save" style={{display:"none"}}>
                          <Tooltip onClick={()=>{onSave(index)}} title="Save">
                            <IconButton>
                              <SaveIcon sx={{ fontSize: 25,color: "black"}}/>
                            </IconButton>
                          </Tooltip>
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

