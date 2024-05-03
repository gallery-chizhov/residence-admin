import * as React from 'react';
import type {Metadata} from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Plus as PlusIcon} from '@phosphor-icons/react/dist/ssr/Plus';

import {config} from '@/config';
import Link from "next/link";
import {UsersTable} from "@/components/dashboard/users/UsersTable";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getUsers} from "@/components/dashboard/users/api/usersApi";

export const metadata = {title: `Пользователи | Dashboard | ${config.site.name}`} satisfies Metadata;

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams?: {
    page: string
  }
}) {
  const page = Number(searchParams?.page) || 0;
  const session = await getServerSession(authConfig)
  const users = await getUsers(session?.user?.token || '', page)
  const rowsPerPage = 10;

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
        page={page}
        rowsPerPage={rowsPerPage}
        rows={users.content}
        count={users.totalElements}
      />
    </Stack>
  );
}
