import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Resident} from "@/types/types";
import ResidentTableRow from "@/components/dashboard/residents/ResidentTableRow";
import ResidentsTablePagination from "@/components/dashboard/residents/ResidentsTablePagination";


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
                  <ResidentTableRow resident={row} key={row.id}/>
                )
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider/>
        <ResidentsTablePagination count={count} page={page} rowsPerPage={rowsPerPage}/>
      </Card>

    </>
  );
}
