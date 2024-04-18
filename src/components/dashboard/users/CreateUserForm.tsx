'use client'

import React from 'react';
import {z as zod} from "zod";
import {Resident} from "@/types/types";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import {Autocomplete, CircularProgress, SelectChangeEvent, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createUser} from "@/components/dashboard/users/api/usersApi";
import {updateEmptyStringToNull} from "@/lib/helpers";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";

const schema = zod.object({
  login: zod.string().min(4, {message: "Минимум 4 символа"}).optional().or(zod.literal('')),
  password: zod.string().min(1, {message: "Поле обязательно"}).max(20, {message: "Максимум 20 символов"}),
  phone: zod.string().startsWith("89", {message: "Телефон должен начинаться с 89"}).length(11, {message: "Номер телефона должен содержать 11 символов"}).optional().or(zod.literal('')),
  email: zod.string().email('Введите валидный email').optional().or(zod.literal('')),
  card: zod.string().length(6, {message: 'Карта должна содержать 6 символов'}).optional().or(zod.literal('')),
  role: zod.string().min(1, {message: "Поле обязательно"}),
  resident: zod.any()
});

export type createUserValues = zod.infer<typeof schema>;

type Props = {
  residents: Resident[]
}

const CreateUserForm = ({residents}: Props) => {
  const session = useSession()
  const userToken = session.data?.user.token || '';

  const defaultValues = {
    login: '',
    password: '',
    phone: '',
    email: '',
    card: '',
    role: '',
    resident: null
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<createUserValues>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: createUserValues) => {
    try {
      await createUser(userToken,updateEmptyStringToNull(values))
      reset()
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
                  <InputLabel>Login</InputLabel>
                  <OutlinedInput label="Login" {...field} />
                  {errors.login ? <FormHelperText>{errors.login.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='password'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput label="Password" {...field} />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='phone'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.phone)}>
                  <InputLabel>Phone</InputLabel>
                  <OutlinedInput label="Phone" {...field} />
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
                  <InputLabel>Card number</InputLabel>
                  <OutlinedInput label="Card number" {...field} />
                  {errors.card ? <FormHelperText>{errors.card.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='role'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.role)}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...field}
                    label='Role'
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

            {isSubmitSuccessful ? <Alert color="success">Пользователь создан</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type="submit" variant="contained">Create</Button>}
        </CardActions>
      </Card>
    </form>
  );
};

export default CreateUserForm;
