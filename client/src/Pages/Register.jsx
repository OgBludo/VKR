import { useDispatch, useSelector } from 'react-redux';
import '../scss/app.scss';
import { TextField } from '@mui/material';
import { fetchRegister, selectIsAuth } from '../redux/slices/auth';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { setPage } from '../redux/slices/page';

function Register() {
  let data = useSelector((state) => state.authReducer.data);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullname: 'Иван И.И.',
      login: 'test@testmail.ru',
      password: '12345678',
      secret: '',
      isAdmin: true,
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    data = await dispatch(fetchRegister(values));
    console.log(values);
    if (!data.payload) {
      alert('Не удалось зарегестрироваться!');
    } else if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
      alert('Вы успешно зарегестрировались');
    }
  };

  if (isAuth) {
    dispatch(setPage('/admins'));
    return <Navigate to="/admins" />;
  }
  return (
    <div className="maincont">
      <div className="loginform">
        <div className="container">
          <span>Регистрация администратора</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            {' '}
            <TextField
              placeholder="ФИО"
              className="form"
              error={Boolean(errors.fullname?.message)}
              helperText={errors.fullname?.message}
              {...register('fullname', { required: 'Введите полное имя' })}
            />
            <TextField
              type="email"
              placeholder="Логин"
              className="form"
              error={Boolean(errors.login?.message)}
              helperText={errors.login?.message}
              {...register('login', { required: 'Укажите логин' })}
            />
            <TextField
              type="text"
              placeholder="Пароль"
              className="form"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register('password', { required: 'Укажите пароль' })}
            />
            <TextField
              type="text"
              placeholder="Подтверждение"
              className="form"
              error={Boolean(errors.secret?.message)}
              helperText={errors.secret?.message}
              {...register('secret', { required: 'Подтвердите что вы администратор' })}
            />
            <button disabled={!isValid} type="submit" className="button">
              Зарегестрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
