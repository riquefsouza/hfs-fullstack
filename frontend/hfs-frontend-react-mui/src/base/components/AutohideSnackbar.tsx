import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function snackBar(mensagem: string, titulo: string, duracao: number) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
        {titulo}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );  

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={duracao}
        onClose={handleClose}
        message={mensagem}
        action={action}
      />
    </div>
  );
}
