'use client'

import React from 'react';
import {z as zod} from "zod";
import {useSession} from "next-auth/react";
import {CircularProgress} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
import Alert from "@mui/material/Alert";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {createResident} from "@/components/dashboard/residents/api/residentsApi";

const schema = zod.object({
  lastname: zod.string().min(1, {message: "Поле обязательно"}).max(100, {message: "Максимум 100 символов"}),
  firstname: zod.string().min(1, {message: "Поле обязательно"}).max(100, {message: "Максимум 100 символов"}),
  middlename: zod.string().min(1, {message: "Минимум 4 символа"}).optional().or(zod.literal('')),
  phone: zod.string().startsWith("89", {message: "Телефон должен начинаться с 89"}).length(11, {message: "Номер телефона должен содержать 11 символов"}).optional().or(zod.literal('')),
  email: zod.string().email('Введите валидный email').optional().or(zod.literal('')),
});

export type createResidentValues = zod.infer<typeof schema>;

const CreateResidentForm = () => {
  const session = useSession()
  const userToken = session.data?.user.token || '';

  const defaultValues = {
    lastname: '',
    firstname: '',
    middlename: '',
    phone: '',
    email: '',
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<createResidentValues>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: createResidentValues) => {
    try {
      await createResident(userToken,updateEmptyStringToNull(values))
      reset()
    } catch (e) {
      setError('root', {message: 'Возникла ошибка'})
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Создать жителя" title="Житель"/>
        <Divider/>
        <CardContent>
          <Stack spacing={3} sx={{maxWidth: 'sm'}}>
            <Controller
              control={control}
              name='lastname'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.lastname)}>
                  <InputLabel>Фамилия</InputLabel>
                  <OutlinedInput label="Фамилия" {...field} />
                  {errors.lastname ? <FormHelperText>{errors.lastname.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='firstname'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.firstname)}>
                  <InputLabel>Имя</InputLabel>
                  <OutlinedInput label="Имя" {...field} />
                  {errors.firstname ? <FormHelperText>{errors.firstname.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='middlename'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.middlename)}>
                  <InputLabel>Отчество</InputLabel>
                  <OutlinedInput label="Отчество" {...field} />
                  {errors.middlename ? <FormHelperText>{errors.middlename.message}</FormHelperText> : null}
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

            {isSubmitSuccessful ? <Alert color="success">Житель создан</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type="submit" variant="contained">Создать</Button>}
        </CardActions>
      </Card>
    </form>
  );
};

export default CreateResidentForm;
