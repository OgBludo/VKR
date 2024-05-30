import '../scss/app.scss';

import { Lock } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { fetchTeacherData, fetchUserData, selectIsAuth } from '../redux/slices/auth';
import { setPage } from '../redux/slices/page';
import React from 'react';
function Login() {
  let data = useSelector((state) => state.authReducer.data);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      login: 'test@testmail.ru',
      password: '12345678',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    data = await dispatch(fetchUserData(values));
    if (!data.payload) {
      data = await dispatch(fetchTeacherData(values));
      if (data.payload) {
        console.log(data);
        window.localStorage.setItem('token', data.payload.token);
        alert('Вы успешно авторизовались!');
      } else alert('Неверный логин или пароль!');
    } else if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
      alert('Вы успешно авторизовались!');
    }
  };

  if (isAuth) {
    if (data.isAdmin) {
      dispatch(setPage('/admins'));
      return <Navigate to="/admins" />;
    } else {
      if (data.subjects) {
        dispatch(setPage('/teachers'));
        return <Navigate to="/teachers" />;
      } else {
        dispatch(setPage('/system_assistants'));
        return <Navigate to="/system_assistants" />;
      }
    }
  }

  return (
    <div className="maincont">
      <Link to="/register">
        <Lock className="registeradm" />
      </Link>

      <div className="loginform">
        <div className="container">
          <span>Авторизация пользователей</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              type="email"
              placeholder="Логин"
              className="form"
              error={Boolean(errors.login?.message)}
              helperText={errors.login?.message}
              {...register('login', { required: 'Укажите логин' })}
            />
            <TextField
              placeholder="Пароль"
              className="form"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register('password', { required: 'Укажите пароль' })}
            />
            <button disabled={!isValid} type="submit" className="button">
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
