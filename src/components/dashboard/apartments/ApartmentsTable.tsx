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
import {User} from "@/types/types";
import {deleteApartament} from "@/components/dashboard/apartments/api/apartmentsApi";
import ApartmentsTableRow from "@/components/dashboard/apartments/ApartmentsTableRow";

function noop(): void {
  // do nothing
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: any;
  rowsPerPage?: number;
}

export function ApartamentsTable({
                             count = 0,
                             rows = [],
                             page = 0,
                             rowsPerPage = 0,
                           }: CustomersTableProps): React.JSX.Element {

  return (
    <>
      <Card>
        <Box sx={{overflowX: 'auto'}}>
          <Table sx={{minWidth: '800px'}}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Номер</TableCell>
                <TableCell>Этаж</TableCell>
                <TableCell>Активировать</TableCell>
                <TableCell>Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => {
                return (
                  <ApartmentsTableRow apartment={row} key={row.id} />
                );
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

    </>
  );
}
