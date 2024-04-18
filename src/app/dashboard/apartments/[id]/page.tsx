import React from 'react';
import Stack from "@mui/material/Stack";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getUser} from "@/components/dashboard/users/api/usersApi";
import {getResidents} from "@/components/dashboard/residents/api/residentsApi";
import UpdateApartmentForm from "@/components/dashboard/apartments/UpdateApartmentForm";
import {getApartment} from "@/components/dashboard/apartments/api/apartmentsApi";
import {getBills} from "@/components/dashboard/bills/api/billsApi";

export default async function Page({params}: { params: { id: string } }) {
  const session = await getServerSession(authConfig)
  const apartment = await getApartment(session?.user?.token || '', params.id)
  const bills = await getBills(session?.user.token || '')
  return (
    <Stack spacing={3}>
      <UpdateApartmentForm apartment={apartment} bills={bills}/>
    </Stack>
  );
};
