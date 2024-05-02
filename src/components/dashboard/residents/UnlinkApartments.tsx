'use client'

import React, {useState} from 'react';
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {Apartment} from "@/types/types";
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import {unlinkApartment} from "@/components/dashboard/residents/api/residentsApi";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";

type Props = {
  apartments: Apartment[]
}

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%'
}));

const UnlinkApartments = ({apartments}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()
  let {id} = useParams()
  const userToken = session.data?.user.token || '';
  if (Array.isArray(id)) {
    id = id[0]
  }
  console.log(apartments)

  const handleUnlinkButton = async (apartmentId: string | null) => {
    try {
      setIsLoading(true)
      await unlinkApartment(userToken, id, apartmentId || '')
    } catch (e) {
      console.log(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader subheader="Отвязать апартаменты" title="Апартаменты"/>
      <Divider/>
      <CardContent>
        <Stack spacing={2}>
          {apartments.length ? apartments.map(el => {
            return (
              <Stack spacing={5} direction={'row'} sx={{width: 1}}>
                <Item>Номер {el.number}</Item>
                {isLoading ? <CircularProgress /> : <Button onClick={(e => handleUnlinkButton(el.id))} variant="contained">Отвязать</Button>}
              </Stack>
            )
          }) : <Box textAlign={'center'}>Апартаменты отсуствуют</Box>}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UnlinkApartments;
