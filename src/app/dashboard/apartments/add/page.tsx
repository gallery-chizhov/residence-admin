import React from 'react';
import Stack from "@mui/material/Stack";
import CreateApartmentForm from "@/components/dashboard/apartments/CreateApartmentForm";
import {getBills} from "@/components/dashboard/bills/api/billsApi";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";

export default async function Page() {
  const session = await getServerSession(authConfig)
  const bills = await getBills(session?.user.token || '')

  return (
    <Stack spacing={3}>
      <CreateApartmentForm bills={bills} />
    </Stack>
  );
};
