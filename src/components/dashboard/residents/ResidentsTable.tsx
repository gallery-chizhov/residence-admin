'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Link from "next/link";
import {Trash} from "@phosphor-icons/react/dist/ssr/Trash";
import IconButton from "@mui/material/IconButton";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {deleteUser} from "@/components/dashboard/users/api/usersApi";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Resident} from "@/types/types";
import {deleteResident} from "@/components/dashboard/residents/api/residentsApi";
import ResidentTableRow from "@/components/dashboard/residents/ResidentTableRow";

function noop(): void {
  // do nothing
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Resident[];
  rowsPerPage?: number;
}

export function ResidentsTable({
                                 count = 0,
                                 rows = [],
                                 page = 0,
                                 rowsPerPage = 0,
                               }: CustomersTableProps): React.JSX.Element {
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const [currentId, setCurrentId] = React.useState('')
  const session = useSession()
  const userToken = session.data?.user.token || '';

  const handleClickOpen = (id: string) => {
    setOpenDeleteUserDialog(true);
    setCurrentId(id)
  };

  const handleClose = () => {
    setOpenDeleteUserDialog(false);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteResident(userToken, id)
      setOpenDeleteUserDialog(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Card>
        <Box sx={{overflowX: 'auto'}}>
          <Table sx={{minWidth: '800px'}}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Активировать</TableCell>
                <TableCell>Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <ResidentTableRow resident={row} key={row.id} />
                )
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider/>
        <TablePagination
          component="div"
          count={count}
          onPageChange={noop}
          onRowsPerPageChange={noop}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>


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
          <Button onClick={() => handleDeleteUser(currentId)} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
