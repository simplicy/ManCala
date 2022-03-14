import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DialogModal = ({show, onClose, payload, title, editing}) =>  {
  const handleClose = (e) => {
    document.getElementById("eventForm").reset();
    e.preventDefault();
    onClose();
  };
  const { register, setValue, handleSubmit, formState: { errors } } = useForm();
  const onSubmit =  (data) => {
    console.log(data)
    var form = document.getElementById("eventForm");
    form.reset();
    onClose();  
  };

  setValue("date",payload.event.date);
  if((payload.event.start && payload.event.end) != "00:00" && "24:00"){
    setValue("startTime",payload.event.start);
    setValue("endTime",payload.event.end);
  }  
  const viewEvent = (
    <>
    
    </>
  );
  const editEvent = (
    <form id="eventForm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField 
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
              id="startTime" 
              label="Start Time"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="time" 
              {...register("startTime")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
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
              label="Details"
              color="primary"
              sx={{ width: "100%" }}
              multiline
              rows={4}
              variant="filled"
              type="text"
              placeholder={('Details or Notes about this Event.')} 
              {...register("details")} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
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
          <Grid item xs={12}>
            <TextField
              label="Address 1"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("addr1")} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address 2"
              variant="filled"
              sx={{ width: "100%" }}
              color="primary"
              type="text"
              {...register("location")} 
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
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
            {editEvent}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  ):null
  return content;
}
export default DialogModal;