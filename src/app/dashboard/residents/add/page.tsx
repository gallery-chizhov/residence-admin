import React from 'react';
import Stack from "@mui/material/Stack";
import CreateResidentForm from "@/components/dashboard/residents/CreateResidentForm";

export default function Page () {
  return (
    <Stack spacing={3}>
      <CreateResidentForm />
    </Stack>
  );
};
