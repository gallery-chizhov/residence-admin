import React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import {Trash} from "@phosphor-icons/react/dist/ssr/Trash";
import {Resident} from "@/types/types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useSession} from "next-auth/react";
import {activateResident, deactivateResident, deleteResident} from "@/components/dashboard/residents/api/residentsApi";
import {Switch} from "@mui/material";
import {activateUser, deactivateUser} from "@/components/dashboard/users/api/usersApi";

type Props = {
  resident: Resident
}

const ResidentTableRow = ({resident}: Props) => {
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const session = useSession()
  const userToken = session.data?.user.token || '';
  const [checked, setChecked] = React.useState(resident.enabled);

  const handleClickOpen = () => {
    setOpenDeleteUserDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteUserDialog(false);
  };

  const handleDelete = async () => {
    try {
      await deleteResident(userToken, resident.id)
      setOpenDeleteUserDialog(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleDeactivate = async () => {
    await deactivateResident(userToken, resident.id)
    setChecked(false)
  }

  const handleActivate = async () => {
    await activateResident(userToken, resident.id)
    setChecked( true)
  }

  const handleSwitch = async () => {
    if (resident.enabled) {
      await handleDeactivate()
    } else {
      await handleActivate()
    }
  }

  return (
    <>
      <TableRow hover key={resident.id}>
        <TableCell>
          <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
            <Typography variant="subtitle2">
              <Link href={`/dashboard/residents/${resident.id}`}>
                {resident.id}
              </Link>
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{resident.lastName}</TableCell>
        <TableCell>{resident.firstName}</TableCell>
        <TableCell>{resident.phone}</TableCell>
        <TableCell><Switch checked={checked} onChange={handleSwitch}/></TableCell>
        <TableCell>
          <IconButton onClick={handleClickOpen}>
            <Trash size={32}/>
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={openDeleteUserDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Удалить пользователя?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleDelete} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResidentTableRow;
