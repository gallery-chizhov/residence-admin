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
  login: zod.string().min(4, {message: "Минимум 4 символа"}).optional().or(zod.literal('')),
  phone: zod.string().startsWith("89", {message: "Телефон должен начинаться с 89"}).length(11, {message: "Номер телефона должен содержать 11 символов"}).optional().or(zod.literal('')),
  email: zod.string().email('Введите валидный email').optional().or(zod.literal('')),
  card: zod.string().length(6, {message: 'Карта должна содержать 6 символов'}).optional().or(zod.literal('')),
  role: zod.string(),
  resident: zod.any()
});

export type updateUserValues = zod.infer<typeof schema>;

type Props = {
  user: User,
  residents: Resident[]
}

const UpdateUserForm = ({user, residents}: Props) => {
  const session = useSession()
  let {id} = useParams()
  const userToken = session.data?.user.token || '';

  if (Array.isArray(id)) {
    id = id[0]
  }


  const defaultValues = {
    login: user.login || '',
    phone: user.phone || '',
    email: user.email || '',
    card: user.cardNumber || '',
    role: user.role || '',
    resident: user.resident || null
  }

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<updateUserValues>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: updateUserValues) => {
    try {
      await updateUser(userToken, id, updateEmptyStringToNull(values))
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
              name='login'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.login)}>
                  <InputLabel>Логин</InputLabel>
                  <OutlinedInput label="Логин" {...field} />
                  {errors.login ? <FormHelperText>{errors.login.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='phone'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.phone)}>
                  <InputLabel>Телефон</InputLabel>
                  <OutlinedInput label="Телефон" {...field} />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='email'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.email)}>
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput label="Email" {...field} />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='card'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.card)}>
                  <InputLabel>Номер карты</InputLabel>
                  <OutlinedInput label="Номер карты" {...field} />
                  {errors.card ? <FormHelperText>{errors.card.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='role'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.role)}>
                  <InputLabel>Роль</InputLabel>
                  <Select
                    label='Роль'
                    {...field}
                  >
                    <MenuItem value={'CUSTOMER'}>CUSTOMER</MenuItem>
                    <MenuItem value={'EMPLOYEE'}>EMPLOYEE</MenuItem>
                    <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                  </Select>
                  {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='resident'
              render={({field}) => (
                <FormControl fullWidth>
                  <Autocomplete
                    renderInput={(params) => <TextField {...params} error={Boolean(errors["resident"])} label="Житель" />}
                    options={residents}
                    getOptionLabel={(option) => `${option.lastName ?? ''} ${option.firstName ?? ''} ${option.middleName ?? ''}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id || value === ''}
                    onChange={(_, data) => field.onChange(data)}
                    value={field.value}
                  />
                </FormControl>
              )}
            />

            {isSubmitSuccessful ? <Alert color="success">Данные успешно обновлены</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type="submit" variant="contained">Изменить</Button>}
        </CardActions>
      </Card>
    </form>
  );
};

export default UpdateUserForm;
