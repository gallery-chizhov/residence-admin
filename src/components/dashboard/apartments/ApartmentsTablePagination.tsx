'use client'

import React from 'react';
import TablePagination from "@mui/material/TablePagination";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

type Props = {
  count: number;
  page: number;
  rowsPerPage: number;
}

const ApartmentsTablePagination = ({count, page, rowsPerPage}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handlePageChange = (page: any) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set('page', page);
    } else {
      params.delete('page');
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={(event, newPage) => handlePageChange(newPage)}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[-1]}
    />
  );
};

export default ApartmentsTablePagination;
