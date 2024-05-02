import React from 'react';
import Stack from "@mui/material/Stack";
import {getServerSession} from "next-auth";
import {authConfig} from "@/lib/auth/auth";
import {getResident} from "@/components/dashboard/residents/api/residentsApi";
import UpdateResidentForm from "@/components/dashboard/residents/UpdateResidentForm";
import {LinkApartmentsForm} from "@/components/dashboard/residents/LinkApartmentsForm";
import {getApartments, getApartmentsAll} from "@/components/dashboard/apartments/api/apartmentsApi";
import UnlinkApartments from "@/components/dashboard/residents/UnlinkApartments";

export default async function Page({params}: { params: { id: string } }) {
  const session = await getServerSession(authConfig)
  const resident = await getResident(session?.user?.token || '', params.id)
  const apartments = await getApartmentsAll(session?.user?.token || '')
  const apartmentsMapped = apartments.map((el: any) => ({id: el.id, number: el.number}))

  return (
    <Stack spacing={3}>
      <UpdateResidentForm resident={resident} />
      <LinkApartmentsForm apartments={apartmentsMapped} />
      <UnlinkApartments apartments={resident.apartments} />
    </Stack>
  );
};
