import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../scss/app.scss';
import axios from '../axios';
import { useDispatch } from 'react-redux';
import { setPage } from '../redux/slices/page';

function Admins() {
  const dispatch = useDispatch();
  dispatch(setPage('/admins'));
  const [userType, setUserType] = useState('sysAss');
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      login: '',
      password: '',
      fullname: '',
      subjects: [],
      available_time: 0,
      isAdmin: false,
    },
  });

  const onSubmit = async (data) => {
    console.log(userType);
    console.log(data);
    try {
      userType === 'sysAss'
        ? axios.post('/register/user', data).then((res) => {
            alert('Системынй ассистент зарегестрирован');
          })
        : axios.post('/register/teacher', data).then((res) => {
            alert('Преподаватель зарегестрирован');
          });
      reset();
    } catch (error) {
      console.error('Ошибка регистрации пользователя:', error);
      alert('Ошибка регистрации пользователя');
    }
  };

  return (
    <div className="admMaincont">
      <div className="container">
        <div className="admForm-container">
          <h1>Регистрация нового пользователя</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <InputLabel id="user-type-label"></InputLabel>
              <Select
                labelId="user-type-label"
                id="user-type"
                value={userType}
                onChange={(event) => setUserType(event.target.value)}>
                <MenuItem value="sysAss">Системный ассистент</MenuItem>
                <MenuItem value="teacher">Преподаватель</MenuItem>
              </Select>
            </FormControl>
            <Controller
              name="login"
              control={control}
              render={({ field }) => (
                <TextField fullWidth id="login" label="Логин" {...field} margin="normal" />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="password"
                  type="text"
                  label="Пароль"
                  {...field}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="fullname"
              control={control}
              render={({ field }) => (
                <TextField fullWidth id="fullname" label="Имя" {...field} margin="normal" />
              )}
            />
            {userType === 'teacher' && (
              <>
                <Controller
                  name="subjects"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      id="subjects"
                      label="Преподаваемые направления подготовки"
                      {...field}
                      value={field.value.join(', ')}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value.split(',').map((subject) => subject.trim()),
                        )
                      }
                      margin="normal"
                    />
                  )}
                />
                <Controller
                  name="available_time"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      id="available_time"
                      type="number"
                      label="Доступное время"
                      {...field}
                      margin="normal"
                    />
                  )}
                />
              </>
            )}
            <Button type="submit" variant="contained" color="primary">
              Зарегистрировать
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admins;
