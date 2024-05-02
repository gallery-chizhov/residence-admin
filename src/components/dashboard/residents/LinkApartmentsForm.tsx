'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import {z as zod} from "zod";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {Apartment} from "@/types/types";
import {linkApartment} from "@/components/dashboard/residents/api/residentsApi";

const schema = zod.object({
  apartment: zod.object({
    id: zod.string(),
    number: zod.number()
  }).required()
});

type formData = {
  apartment: Pick<Apartment, 'id' | 'number'> | null
}

type Props = {
  apartments: Pick<Apartment, 'id' | 'number'>[]
}

export function LinkApartmentsForm({apartments}: Props): React.JSX.Element {
  const session = useSession()
  let {id} = useParams()
  const userToken = session.data?.user.token || '';

  if (Array.isArray(id)) {
    id = id[0]
  }

  const defaultValues = {
    apartment: null
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<formData>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: formData) => {
    try {
      await linkApartment(userToken, id, values.apartment?.id || '')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Привязать апартаменты" title="Апартаменты"/>
        <Divider/>
        <CardContent>
          <Stack spacing={3} sx={{maxWidth: 'sm'}}>

            <Controller
              control={control}
              name='apartment'
              render={({field}) => (
                <FormControl fullWidth>
                  <Autocomplete
                    renderInput={(params) => <TextField {...params} helperText={Boolean(errors["apartment"]) && 'Поле обязательно'} error={Boolean(errors["apartment"])} label="Номер" />}
                    options={apartments}
                    getOptionLabel={(option) => `${option.number || ''}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, data) => field.onChange(data)}
                    value={field.value}
                  />
                </FormControl>
              )}
            />

            {isSubmitSuccessful ? <Alert color="success">Апартаменты привязаны</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type='submit' variant="contained">Привязать</Button>}
        </CardActions>
      </Card>
    </form>
  );
}
