import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

const DialogModal = ({show, onClose, payload, options, title, children}) =>  {
  const router = useRouter();
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };
  const onSubmit = async (e) => {
    const req = await fetch(options.path, {
        method: options.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        });
    var json = await req.json();
    toast(json.message);
    if(json.success == true){
      var logContent = {
        group: options.path.substring(5),
        data: JSON.stringify(payload)
      }
      const loggit = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(logContent),
        });
        const loggitJson = await loggit.json()
        if(loggitJson.success==true){
          onClose();
          router.reload(window.location.pathname);
        }     
    }                      
  }

  const content = show ? (
    <div>
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
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ):null
  return content;
}
export default DialogModal;