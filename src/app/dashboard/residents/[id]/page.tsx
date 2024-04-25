import React from 'react';
import Stack from "@mui/material/Stack";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getResident} from "@/components/dashboard/residents/api/residentsApi";
import UpdateResidentForm from "@/components/dashboard/residents/UpdateResidentForm";

export default async function Page({params}: { params: { id: string } }) {
  const session = await getServerSession(authConfig)
  const resident = await getResident(session?.user?.token || '', params.id)
  return (
    <Stack spacing={3}>
      <UpdateResidentForm resident={resident} />
    </Stack>
  );
};
