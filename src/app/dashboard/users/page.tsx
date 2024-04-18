import * as React from 'react';
import type {Metadata} from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';

import {config} from '@/config';
import {CustomersTable} from '@/components/dashboard/customer/customers-table';
import {authConfig} from "@/lib/auth/auth";
import {getServerSession} from "next-auth";
import {getUsers} from "@/components/dashboard/users/api/usersApi";
import Link from "next/link";
import {UsersTable} from "@/components/dashboard/users/UsersTable";

export const metadata = {title: `Customers | Dashboard | ${config.site.name}`} satisfies Metadata;

export default async function Page() {
  const session = await getServerSession(authConfig)
  const users = await getUsers(session?.user?.token || '')
  const page = 0;
  const rowsPerPage = 5;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{flex: '1 1 auto'}}>
          <Typography variant="h4">Пользователи</Typography>
        </Stack>
        <div>
          <Link href={'/dashboard/users/add'}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>} variant="contained">
              Добавить
            </Button>
          </Link>
        </div>
      </Stack>
      {/*<CustomersFilters />*/}
      <UsersTable
        count={users.totalElements}
        page={page}
        rows={users.content}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}
