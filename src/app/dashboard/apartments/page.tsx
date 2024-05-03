import * as React from 'react';
import type {Metadata} from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';

import {config} from '@/config';
import {CustomersTable} from '@/components/dashboard/customer/customers-table';
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getApartments} from "@/components/dashboard/apartments/api/apartmentsApi";
import Link from "next/link";
import {ApartamentsTable} from "@/components/dashboard/apartments/ApartmentsTable";

export const metadata = {title: `Апартаменты | Dashboard | ${config.site.name}`} satisfies Metadata;

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams?: {
    page: string
  }
}) {
  const page = Number(searchParams?.page) || 0;
  const session = await getServerSession(authConfig)
  const apartments = await getApartments(session?.user?.token || '', page)
  const rowsPerPage = 5;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{flex: '1 1 auto'}}>
          <Typography variant="h4">Апартаменты</Typography>
          {/*<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>*/}
          {/*  <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>*/}
          {/*    Import*/}
          {/*  </Button>*/}
          {/*  <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>*/}
          {/*    Export*/}
          {/*  </Button>*/}
          {/*</Stack>*/}
        </Stack>
        <div>
          <Link href={'/dashboard/apartments/add'}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>} variant="contained">
              Add
            </Button>
          </Link>
        </div>
      </Stack>
      {/*<CustomersFilters />*/}
      <ApartamentsTable
        count={apartments.totalElements}
        page={page}
        rows={apartments.content}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
