'use client'

import React from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {Autocomplete, CircularProgress, SelectChangeEvent, TextField} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z as zod} from "zod";
import {Resident, User} from "@/types/types";
import FormHelperText from "@mui/material/FormHelperText";
import {useSession} from "next-auth/react";
import {updateUser} from "@/components/dashboard/users/api/usersApi";
import {useParams} from "next/navigation";
import {updateEmptyStringToNull} from "@/lib/helpers";
import Alert from "@mui/material/Alert";

const schema = zod.object({
  lastname: zod.string().min(1, {message: "Поле обязательно"}).max(100, {message: "Максимум 100 символов"}),
  firstname: zod.string().min(1, {message: "Поле обязательно"}).max(100, {message: "Максимум 100 символов"}),
  middlename: zod.string().min(1, {message: "Минимум 4 символа"}).optional().or(zod.literal('')),
  phone: zod.string().startsWith("89", {message: "Телефон должен начинаться с 89"}).length(11, {message: "Номер телефона должен содержать 11 символов"}).optional().or(zod.literal('')),
  email: zod.string().email('Введите валидный email').optional().or(zod.literal('')),
});

export type updateResidentValues = zod.infer<typeof schema>;

type Props = {
  resident: Resident
}

const UpdateUserForm = ({resident}: Props) => {
  console.log(resident)
  const session = useSession()
  let {id} = useParams()
  const userToken = session.data?.user.token || '';

  if (Array.isArray(id)) {
    id = id[0]
  }


  const defaultValues = {
    lastname: resident.lastName || '',
    firstname: resident.firstName || '',
    middlename: resident.middleName || '',
    phone: resident.phone || '',
    email: resident.email || '',
  }

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<updateResidentValues>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: updateResidentValues) => {
    try {
      await update(userToken, id, updateEmptyStringToNull(values))
    } catch (e) {
      setError('root', {message: 'Возникла ошибка'})
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Изменить информацию" title="Информация"/>
        <Divider/>
        <CardContent>
          <Stack spacing={3} sx={{maxWidth: 'sm'}}>
            <Controller
              control={control}
              name='lastname'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.lastname)}>
                  <InputLabel>Lastname</InputLabel>
                  <OutlinedInput label="Lastname" {...field} />
                  {errors.lastname ? <FormHelperText>{errors.lastname.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='firstname'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.firstname)}>
                  <InputLabel>firstname</InputLabel>
                  <OutlinedInput label="firstname" {...field} />
                  {errors.firstname ? <FormHelperText>{errors.firstname.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='middlename'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.middlename)}>
                  <InputLabel>middlename</InputLabel>
                  <OutlinedInput label="Card number" {...field} />
                  {errors.middlename ? <FormHelperText>{errors.middlename.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='phone'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.phone)}>
                  <InputLabel>phone</InputLabel>
                  <OutlinedInput label="phone" {...field} />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='email'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.email)}>
                  <InputLabel>email</InputLabel>
                  <OutlinedInput label="email" {...field} />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            {isSubmitSuccessful ? <Alert color="success">Данные успешно обновлены</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type="submit" variant="contained">Update</Button>}
        </CardActions>
      </Card>
    </form>
  );
};

export default UpdateUserForm;
