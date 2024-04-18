 'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import {z as zod} from "zod";
import {useSession} from "next-auth/react";
import {useParams} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateUserPassword} from "@/components/dashboard/users/api/usersApi";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";
import {CircularProgress} from "@mui/material";
import {Eye as EyeIcon} from "@phosphor-icons/react/dist/ssr/Eye";
import {EyeSlash as EyeSlashIcon} from "@phosphor-icons/react/dist/ssr/EyeSlash";

const schema = zod.object({
    password: zod.string().min(1, {message: 'Введите пароль'}),
    confirm: zod.string().min(1, {message: 'Подтвердите пароль'})
  })
    .refine((data) => data.password === data.confirm, {
      message: 'Пароли не совпадают',
      path: ['confirm']
    })
;

export type updateUserPasswordValues = zod.infer<typeof schema>;

export function UpdateUserPasswordForm(): React.JSX.Element {
  const session = useSession()
  let {id} = useParams()
  const userToken = session.data?.user.token || '';
  const [showPassword, setShowPassword] = React.useState<boolean>();
  const [showConfirm, setShowConfirm] = React.useState<boolean>()

  if (Array.isArray(id)) {
    id = id[0]
  }

  const defaultValues = {
    password: '',
    confirm: ''
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<updateUserPasswordValues>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: updateUserPasswordValues) => {
    try {
      await updateUserPassword(userToken, id, values.password)
      reset()
    } catch (e) {
      setError('root', {message: 'Возникла ошибка'})
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Изменить пароль" title="Пароль"/>
        <Divider/>
        <CardContent>
          <Stack spacing={3} sx={{maxWidth: 'sm'}}>
            <Controller
              control={control}
              name='password'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput label="Password" {...field}
                                 type={showPassword ? 'text' : 'password'}
                                 endAdornment={
                                   showPassword ? (
                                     <EyeIcon
                                       cursor="pointer"
                                       fontSize="var(--icon-fontSize-md)"
                                       onClick={(): void => {
                                         setShowPassword(false);
                                       }}
                                     />
                                   ) : (
                                     <EyeSlashIcon
                                       cursor="pointer"
                                       fontSize="var(--icon-fontSize-md)"
                                       onClick={(): void => {
                                         setShowPassword(true);
                                       }}
                                     />
                                   )
                                 }/>
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='confirm'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.confirm)}>
                  <InputLabel>Confirm password</InputLabel>
                  <OutlinedInput label="Confirm password" {...field}
                                 type={showConfirm ? 'text' : 'password'}
                                 endAdornment={
                                   showConfirm ? (
                                     <EyeIcon
                                       cursor="pointer"
                                       fontSize="var(--icon-fontSize-md)"
                                       onClick={(): void => {
                                         setShowConfirm(false);
                                       }}
                                     />
                                   ) : (
                                     <EyeSlashIcon
                                       cursor="pointer"
                                       fontSize="var(--icon-fontSize-md)"
                                       onClick={(): void => {
                                         setShowConfirm(true);
                                       }}
                                     />
                                   )
                                 }/>
                  {errors.confirm ? <FormHelperText>{errors.confirm.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {isSubmitSuccessful ? <Alert color="success">Пароль успешно обновлен</Alert> : null}
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          </Stack>
        </CardContent>
        <Divider/>
        <CardActions sx={{justifyContent: 'flex-end'}}>
          {isSubmitting ? <CircularProgress/> : <Button type='submit' variant="contained">Update</Button>}
        </CardActions>
      </Card>
    </form>
  );
}
