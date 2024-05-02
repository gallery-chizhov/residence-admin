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
import {activateUser, deleteUser, getUsers} from "@/components/dashboard/users/api/usersApi";
import {useSession} from "next-auth/react";
import {Resident, User} from "@/types/types";
import {Switch} from "@mui/material";
import UsersTableRow from "@/components/dashboard/users/UsersTableRow";
import {useEffect, useState} from "react";
import UsersTablePagination from "@/components/dashboard/users/UsersTablePagination";

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: User[];
  rowsPerPage?: number;
}

export function UsersTable({
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
                <TableCell>Логин</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Активирован</TableCell>
                <TableCell>Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row) => {
                return (
                  <UsersTableRow user={row} key={row.id}/>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider/>
        <UsersTablePagination count={count} page={page} rowsPerPage={rowsPerPage}   />
      </Card>
    </>
  );
}
