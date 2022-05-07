import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';


const DialogModal = ({show, onClose, payload, title, editing, account}) =>  {
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

  const handleClose = (e) => {
    reset()
    onClose();
  };
  
  const onSubmit =  (data) => {


    console.log(data)
    reset();
    handleClose();
  };

  if(editing && show){
    setValue("date",payload.date);
    if((payload.start && payload.end) != "00:00" && "24:00"){
      setValue("startTime",payload.start);
      setValue("endTime",payload.end);
    }  
  }
  else if(show){
    setValue("date",new Date(payload.start).toISOString().replace(/T.*/,'').split('-').join('-'));
    setValue("eventTitle", payload.title)
    setValue("details",payload.details);
    setValue("startTime",(new Date(payload.start)).toTimeString().split(' ')[0]);
    setValue("endTime",(new Date(payload.end)).toTimeString().split(' ')[0]);

    if(payload.address){
      var [addr1, city, stateZip, country] = payload.address.split(",")
      var [state, zip] = stateZip.substring(1).split(" ")
      setValue("addr1",addr1);
      setValue("city",city)
      setValue("state",state)
      setValue("zip",zip)
    }
    if(payload.attendees){
      var attList =""; 
      payload.attendees.map(attendee => {
        attList = attList.concat(attendee.email,"\n")
      })
      setValue("attendees", attList)
    }

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
              required
              label="Details"
              color="primary"
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
                  color="primary"
                  sx={{ width: "100%" }}
                  variant="filled"
                  {...register("organizer")}                   
                >
                {account.users.map((item,index)=>{
                  return (
                    <MenuItem value={index}>
                      {item.email}
                    </MenuItem>
                  );
                })}
                </TextField>
              </Grid>

            <Grid item xs={12}>
              <TextField 
                control={control}
                disabled={!editing} 
                label="Attendee Emails"
                color="primary"
                sx={{ width: "100%" }}
                variant="filled"
                multiline            
                rows={4}
                type="text"  
                placeholder={('(Each on a new line)')} 
                {...register("attendees")} 
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              control={control}
              disabled={!editing}
              label="Address 1"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("addr1")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              control={control}
              disabled={!editing}
              label="City"
              variant="filled"
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
              sx={{ width: "100%"}}
              color="primary"
              type="text"
              {...register("zip")} 
            />
          </Grid>
        </Grid>
      </div>
      <DialogActions>
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
export default DialogModal;