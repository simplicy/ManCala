import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';

const DialogModal = ({show, onClose, title, children}) =>  {
  const router = useRouter();
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };
  const onSubmit = async (e) => {
    onClose();
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
          {children}
      </Dialog>
    </div>
  ):null
  return content;
}
export default DialogModal;