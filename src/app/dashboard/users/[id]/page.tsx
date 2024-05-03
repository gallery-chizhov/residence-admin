import React from 'react';
import UpdateUserForm from "@/components/dashboard/users/UpdateUserForm";
import Stack from "@mui/material/Stack";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getUser} from "@/components/dashboard/users/api/usersApi";
import {UpdateUserPasswordForm} from "@/components/dashboard/users/UpdateUserPasswordForm";
import {getResidentsAll} from "@/components/dashboard/residents/api/residentsApi";

export default async function Page({params}: { params: { id: string } }) {
  const session = await getServerSession(authConfig)
  const residents = await getResidentsAll(session?.user.token || '')
  const user = await getUser(session?.user?.token || '', params.id)
  return (
    <Stack spacing={3}>
      <UpdateUserForm user={user} residents={residents}/>
      <UpdateUserPasswordForm/>
    </Stack>
  );
};
