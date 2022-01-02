import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const FormDialog = ({show, onClose, onSubmit, title,children}) => {
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const modalContent= show ? (
    <div>
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
        {children}
        </DialogContentText>        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  </div>
  ):null;

  return modalContent;
}

export default FormDialog;
