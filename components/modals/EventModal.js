import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Modal from './Modal'
import toast, { Toaster } from 'react-hot-toast';

const EventModal = ({show, onClose, payload, title, newEventMode, account, reloadEvents}) =>  {
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [organize, setOrganize] = useState("")
  const [preEditEvent, setPreEdit] = useState({})
  const { register, reset, setValue, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues:{
      eventTitle:"",
      date:"",
      startTime: "--:--",
      endTime: "--:--",
      details: "",
      attendees: "",
      organizer:"",
      addr1: "",
      city: "",
      state: "",
      zip: "",
    }
  });

  //On delete button event to show delete modal
  const showDeleteModal = async () => {setShowDelete(true)}
  //sends Event to be delete to google api
  const onDelete = async () => {
    reset()
    var deleteEvent = await fetch('http://localhost:3000/api/calendars/?id='+payload.eventID+'&account='+payload.organizer, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    const apiResponse = await (deleteEvent.json())
    
    toast(apiResponse.message)
    
    handleClose();
  }

  //On Edit button event
  const onEdit = async (e) => {
    setPreEdit({
        eventTitle: document.getElementById("eventTitle").value,
        date:document.getElementById("date").value,
        startTime: document.getElementById("startTime").value,
        endTime: document.getElementById("endTime").value,
        details: document.getElementById("details").value,
        attendees: document.getElementById("attendees").value,
        organizer: organize,
        addr1: document.getElementById("addr1").value,
        addr2: document.getElementById("addr2").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
        color: payload.color,
    })
    setEditing(true)
  }
  

  //Handles close for all event modal, handles options
  const handleClose = (e) => {
    onClose();
    organize = ""
    editing = false;
    setEditing(false)
    setShowDelete(false)
    reset();
    reloadEvents();
  };

  //Prefills modal content with data from Google calendar API
  const fillModalContent = () =>{
    setValue("date",new Date(payload.start).toISOString().replace(/T.*/,'').split('-').join('-'));
    setValue("eventTitle", payload.title)
    setValue("details",payload.details);
    setValue("startTime",(new Date(payload.start)).toTimeString().split(' ')[0]);
    setValue("endTime",(new Date(payload.end)).toTimeString().split(' ')[0]);
    //makesure address is an address
    if(payload.address){
      var [addr1, addr2, city, stateZip, country] = payload.address.split(",")
      if(stateZip == null){
        var [addr1, city, stateZip, country] = payload.address.split(",")
        var addr2 = ""
      }
      var [state, zip] = stateZip.substring(1).split(" ")
      setValue("addr1",addr1);
      setValue("addr2",addr2);
      setValue("city",city)
      setValue("state",state)
      setValue("zip",zip)
      console.log(stateZip)
      console.log(country)
    }
    if(payload.attendees){
      var attList =""; 
      payload.attendees.map(attendee => {
        if(!attendee.organizer)
          attList = attList.concat(attendee.email,"\n")
      })
      setValue("attendees", attList)
    }
    organize = payload.organizer;
  }
  //submits form
  const onSubmit = async (data) => {
    var method;
    data.color = payload.color
    //If data is missing organizer, add in the organizer from the event.
    if(!data.organizer) {
      data.organizer = payload.organizer;
    }
    //designate which method to use
    if(newEventMode && editing ){
      method = 'POST';
    }
    else if(editing && !newEventMode){
      method = 'PUT';
    }
    if(data && method){
      if(data.startTime > data.endTime){
        toast("Invalid time selection.")
      }
      //verify that the event has had changes made to it else close modal
      else if(JSON.stringify(preEditEvent) === JSON.stringify(data)){
        toast("No changes made.")
        handleClose();
      }
      else {
        //Re-sets details value on modal, cosmetic fix for issue with changes disapearing before modal close.
        //Event updates fine with or without this line
        setValue("eventTitle", data.eventTitle)
        setValue("details",data.details);
        setValue("addr1",data.addr1);
        setValue("addr2",data.addr2);
        setValue("city",data.city)
        setValue("state",data.state)
        setValue("zip",data.zip)
        console.log(data)
        const newEventRequest = await fetch('http://localhost:3000/api/calendars/?eventId='+payload.eventID, {
          method: method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })        
        const apiResponse = await (newEventRequest.json())
        toast(apiResponse.message)
        handleClose();
      }
    }
    else
      handleClose();
  };

  //Loader condition for when the modal is shown
  if(newEventMode && show){
    setValue("date",payload.date); 
    if((payload.start && payload.end) != "00:00" && "24:00"){
      setValue("startTime",payload.start);
      setValue("endTime",payload.end);
    }
    else{
      setValue("startTime","--:--");
      setValue("endTime","--:--");
    }
    setValue("eventTitle", "")
    setValue("details","");
    setValue("addr1","");
    setValue("city","")
    setValue("state","")
    setValue("zip","")
    setValue("attendees", "")
    editing = true;
  }
  else if(show){
    fillModalContent();
  }
  
  const viewEvent = (
    <form id="eventForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              disabled={!editing}
              control={control}
              required
              sx={{ width: "100%" }}
              label="Title"
              id="eventTitle"
              variant="filled"
              color="primary"
              rows="1" 
              {...register("eventTitle")}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              control={control}
              disabled={!editing}
              required
              id="date"
              label="Date"
              color="primary"
              variant="filled"
              sx={{ width: "100%" }}
              type="date" 
              {...register("date")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              control={control}
              disabled={!editing}
              id="startTime" 
              label="Start Time"
              required
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="time" 
              {...register("startTime")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              control={control}
              disabled={!editing}
              required
              id="endTime" 
              label="End Time"
              sx={{ width: "100%" }}
              color="primary"
              type="time"
              variant="filled"
              {...register("endTime")} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              control={control}
              disabled={!editing}
              label="Details"
              color="primary"
              id="details"
              sx={{ width: "100%" }}
              multiline
              rows={7}
              variant="filled"
              type="text"
              placeholder={('Details or Notes about this Event.')} 
              {...register("details")} 
            />
          </Grid>
          <Grid container item spacing={1} xs={6}>            
            <Grid item xs={12}>
                <TextField
                  control={control}
                  disabled={!editing} 
                  label="Organizer"
                  required
                  select
                  defaultValue={organize}
                  id="organizer"
                  color="primary"
                  sx={{ width: "100%" }}
                  variant="filled"
                  {...register("organizer")}                   
                >
                {account.map(item=>{
                  return (
                    <MenuItem value={item.email}>
                      {item.email}
                    </MenuItem>
                  );
                })}
                </TextField>
              </Grid>

            <Grid item xs={12}>
              <TextField 
                control={control}
                disabled={true} 
                label="Attendee Emails"
                color="primary"
                id="attendees"
                sx={{ width: "100%" }}
                variant="filled"
                multiline            
                rows={4}
                type="text"  
                placeholder={('Each on a new line.')} 
                {...register("attendees")} 
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              disabled={!editing}
              label="Address 1"
              id="addr1"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("addr1")} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              disabled={!editing}
              label="Address 2"
              id="addr2"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("addr2")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              control={control}
              disabled={!editing}
              label="City"
              variant="filled"
              id="city"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("city")} 
            />
          </Grid>          
          <Grid item xs={4}>
            <TextField
              control={control}
              disabled={!editing}
              label="State"
              id="state"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("state")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              control={control}
              disabled={!editing}
              label="Zip Code"
              variant="filled"
              id="zip"
              sx={{ width: "100%"}}
              color="primary"
              type="text"
              {...register("zip")} 
            />
          </Grid>
        </Grid>
      </div>
      
      <DialogActions>
        {editing && !newEventMode ? 
          <>
            <Modal show={showDelete} onClose={() => setShowDelete(false)} title={"Delete selected?"}>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={onDelete} type='submit' autoFocus>
                  Confirm
                </Button>
              </DialogActions>          
            </Modal>
            <Tooltip onClick={() => { showDeleteModal() }} title="Delete" style={{marginRight:"auto", marginLeft: "0"}}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        :<></>}
        {!editing ? 
        <Tooltip onClick={() => { onEdit() }} title="Edit" style={{marginRight:"auto", marginLeft: "0"}}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
      :<></>}
        
        

        <Button onClick={handleClose}>Cancel</Button>
        <Button type='submit' autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </form>
  )

  const content = show ? (
    <>
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {viewEvent}            
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  ):null
  return content;
}
export default EventModal;