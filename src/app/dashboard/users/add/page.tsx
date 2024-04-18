import React from 'react';
import Stack from "@mui/material/Stack";
import CreateUserForm from "@/components/dashboard/users/CreateUserForm";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getResidents} from "@/components/dashboard/residents/api/residentsApi";

export default async function Page () {
  const session = await getServerSession(authConfig)
  const residents = await getResidents(session?.user.token || '')
  return (
    <Stack spacing={3}>
      <CreateUserForm residents={residents.content} />
    </Stack>
  );
};
