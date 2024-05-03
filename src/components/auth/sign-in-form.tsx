'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import {zodResolver} from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Eye as EyeIcon} from '@phosphor-icons/react/dist/ssr/Eye';
import {EyeSlash as EyeSlashIcon} from '@phosphor-icons/react/dist/ssr/EyeSlash';
import {Controller, useForm} from 'react-hook-form';
import {z as zod} from 'zod';

import {paths} from '@/paths';
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

const schema = zod.object({
  username: zod.string().min(1, {message: 'Введите имя пользователя'}),
  password: zod.string().min(1, {message: 'Введите пароль'}),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {username: '', password: ''} satisfies Values;

export function SignInForm(): React.JSX.Element {
  const {data: session } = useSession();
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState<boolean>();

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<Values>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: Values): Promise<void> => {
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false
    })
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('root', {message: 'Неправильный логин или пароль'})
    }
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Войти</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({field}) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>Логин</InputLabel>
                <OutlinedInput {...field} label="Логин" />
                {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field}) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Пароль</InputLabel>
                <OutlinedInput
                  {...field}
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
                  }
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button type="submit" variant="contained">
            Войти
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
