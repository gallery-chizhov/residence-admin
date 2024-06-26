import * as React from 'react';
import type {Metadata} from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Download as DownloadIcon} from '@phosphor-icons/react/dist/ssr/Download';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';
import {Upload as UploadIcon} from '@phosphor-icons/react/dist/ssr/Upload';

import {config} from '@/config';
import {CustomersFilters} from '@/components/dashboard/customer/customers-filters';
import {ResidentsTable} from "@/components/dashboard/residents/ResidentsTable";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getResidents} from "@/components/dashboard/residents/api/residentsApi";
import Link from "next/link";

export const metadata = {title: `Жители | Dashboard | ${config.site.name}`} satisfies Metadata;

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams?: {
    page: string
  }
}) {
  const page = Number(searchParams?.page) || 0;
  const session = await getServerSession(authConfig)
  const residents = await getResidents(session?.user?.token || '', page)
  const rowsPerPage = 5;


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{flex: '1 1 auto'}}>
          <Typography variant="h4">Жители</Typography>
          {/*<Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>*/}
          {/*  <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)"/>}>*/}
          {/*    Import*/}
          {/*  </Button>*/}
          {/*  <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)"/>}>*/}
          {/*    Export*/}
          {/*  </Button>*/}
          {/*</Stack>*/}
        </Stack>
        <div>
          <Link href={'/dashboard/residents/add'}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>} variant="contained">
              Добавить
            </Button>
          </Link>
        </div>
      </Stack>
      <ResidentsTable
        count={residents.totalElements}
        page={page}
        rows={residents.content}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
