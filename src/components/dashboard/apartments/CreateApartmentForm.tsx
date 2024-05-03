'use client'

import React from 'react';
import {z as zod} from "zod";
import {useSession} from "next-auth/react";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
import {Bill} from "@/types/types";
import {updateEmptyStringToNull} from "@/lib/helpers";
import {createApartment} from "@/components/dashboard/apartments/api/apartmentsApi";

const schema = zod.object({
  name: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  description: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  number: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  floor: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  entrance: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  space: zod.string().min(1, {message: "Поле обязательно"}).max(50, {message: "Максимум 50 символов"}),
  image: zod.any(),
  bill: zod.object({
    id: zod.string(),
    number: zod.string()
  }).required()
});

type formData = {
  name: string
  description: string
  number: string
  floor: string
  entrance: string
  space: string
  image: any
  bill: { id: string, number: string } | null
}

type Props = {
  bills: Bill[]
}

const CreateApartmentForm = ({bills}: Props) => {
  const session = useSession()
  const userToken = session.data?.user.token || '';

  const defaultValues = {
    name: '',
    description: '',
    number: '',
    floor: '',
    entrance: '',
    space: '',
    image: '',
    bill: null
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    register,
    formState: {errors, isSubmitting, isSubmitSuccessful},
  } = useForm<formData>({defaultValues, resolver: zodResolver(schema)});

  const onSubmit = async (values: formData) => {
    try {
      values.image = values.image && values.image[0]
      const updatedValues = updateEmptyStringToNull(values)
      const body = {
        name: updatedValues.name,
        description: updatedValues.description,
        number: updatedValues.number,
        floor: updatedValues.floor,
        entrance: updatedValues.entrance,
        space: updatedValues.space,
        accountId: updatedValues.bill.id
      }
      let formData = new FormData()
      formData.append('apartment', new Blob([JSON.stringify(body)], {
        type: "application/json"
      }));
      formData.append('photo', new Blob([JSON.stringify(values.image)], {
        type: "multipart/form-data"
      }));
      await createApartment(userToken, formData)
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
              name='name'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.name)}>
                  <InputLabel>Название</InputLabel>
                  <OutlinedInput label="Название" {...field} />
                  {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='description'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.description)}>
                  <InputLabel>Описание</InputLabel>
                  <OutlinedInput label="Описание" {...field} />
                  {errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='number'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.number)}>
                  <InputLabel>Номер</InputLabel>
                  <OutlinedInput label="Номер" {...field} />
                  {errors.number ? <FormHelperText>{errors.number.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='floor'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.floor)}>
                  <InputLabel>Этаж</InputLabel>
                  <OutlinedInput label="Этаж" {...field} />
                  {errors.floor ? <FormHelperText>{errors.floor.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='entrance'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.entrance)}>
                  <InputLabel>Подъезд</InputLabel>
                  <OutlinedInput label="Подъезд" {...field} />
                  {errors.entrance ? <FormHelperText>{errors.entrance.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='space'
              render={({field}) => (
                <FormControl fullWidth error={Boolean(errors.space)}>
                  <InputLabel>Площадь</InputLabel>
                  <OutlinedInput label="Площадь" {...field} />
                  {errors.space ? <FormHelperText>{errors.space.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='bill'
              render={({field}) => (
                <FormControl fullWidth>
                  <Autocomplete
                    renderInput={(params) => <TextField {...params} helperText={Boolean(errors["bill"]) && 'Поле обязательно'} error={Boolean(errors["bill"])} label="Счет" />}
                    options={bills}
                    getOptionLabel={(option) => `${option.number || ''}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, data) => field.onChange(data)}
                  />
                </FormControl>
              )}
            />

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              Загрузить файл
              <input style={{display: 'none'}} type='file' {...register("image")} />
            </Button>

            {isSubmitSuccessful ? <Alert color="success">Апартамент создан</Alert> : null}
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

export default CreateApartmentForm;
