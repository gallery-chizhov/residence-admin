import React from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {Switch} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Trash} from "@phosphor-icons/react/dist/ssr/Trash";
import {User} from "@/types/types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {activateUser, deactivateUser, deleteUser} from "@/components/dashboard/users/api/usersApi";
import {useSession} from "next-auth/react";

type Props = {
  user: User
}

const UsersTableRow = ({user}: Props) => {
  const session = useSession()
  const userToken = session.data?.user.token || '';
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const [checked, setChecked] = React.useState(user.enabled);

  const handleClickOpen = () => {
    setOpenDeleteUserDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteUserDialog(false);
  };

  const handleDeactivateUser = async () => {
    await deactivateUser(userToken, user.id)
    setChecked(false)
  }

  const handleActivateUser = async () => {
    await activateUser(userToken, user.id)
    setChecked( true)
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToken, user?.id || '')
      setOpenDeleteUserDialog(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleSwitch = async () => {
    if (user.enabled) {
      await handleDeactivateUser()
    } else {
      await handleActivateUser()
    }
  }

  return (
    <>
      <TableRow hover key={user.id}>
        <TableCell>
          <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
            <Typography variant="subtitle2">
              <Link href={`/dashboard/users/${user.id}`}>
                {user.id}
              </Link>
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{user.login}</TableCell>
        <TableCell>{user.phone}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Switch checked={checked} onChange={handleSwitch}/>
        </TableCell>
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
          <Button onClick={handleDeleteUser} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTableRow;
