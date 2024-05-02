import React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import {Trash} from "@phosphor-icons/react/dist/ssr/Trash";
import {Apartment} from "@/types/types";
import {useSession} from "next-auth/react";
import {
  activateApartment,
  deactivateApartment,
  deleteApartament
} from "@/components/dashboard/apartments/api/apartmentsApi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {Switch} from "@mui/material";
import {activateUser, deactivateUser, deleteUser} from "@/components/dashboard/users/api/usersApi";

type Props = {
  apartment: Apartment
}

const ApartmentsTableRow = ({apartment}: Props) => {
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const [checked, setChecked] = React.useState(apartment.enabled);
  const session = useSession()
  const userToken = session.data?.user.token || '';

  const handleOpen = () => {
    setOpenDeleteUserDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteUserDialog(false);
  };

  const handleActivate = async () => {
    await activateApartment(userToken, apartment.id)
    setChecked( true)
  }

  const handleDeactivate = async () => {
    await deactivateApartment(userToken, apartment.id)
    setChecked(false)
  }

  const handleSwitch = async () => {
    if (apartment.enabled) {
      await handleDeactivate()
    } else {
      await handleActivate()
    }
  }

  const handleDeleteApartment = async () => {
    try {
      await deleteApartament(userToken, apartment.id)
      setOpenDeleteUserDialog(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <TableRow hover key={apartment.id}>
        <TableCell>
          <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
            <Typography variant="subtitle2">
              <Link href={`/dashboard/apartments/${apartment.id}`}>
                {apartment.id}
              </Link>
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{apartment.name}</TableCell>
        <TableCell>{apartment.number}</TableCell>
        <TableCell>{apartment.floor}</TableCell>
        <TableCell><Switch checked={checked} onChange={handleSwitch}/></TableCell>
        <TableCell>
          <IconButton onClick={handleOpen}>
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
          Удалить апартамент?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleDeleteApartment} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default ApartmentsTableRow;
