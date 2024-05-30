import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../images/logo_citis.png';
import { setPage } from '../redux/slices/page';
import { logout } from '../redux/slices/auth';

import React from 'react';

function AdminsLogic({ teacher }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <div className="btncont">
        {!teacher ? (
          <button
            onClick={() => {
              navigate('/admins');
              dispatch(setPage('/admins'));
            }}>
            Профиль
          </button>
        ) : (
          <button
            onClick={() => {
              navigate('/teachers');
              dispatch(setPage('/teachers'));
            }}>
            Профиль
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm('Вы действительно хотите выйти?')) {
              dispatch(logout());
              window.localStorage.removeItem('token');
            }
            navigate('/');
            dispatch(setPage('/'));
          }}>
          Выйти
        </button>
      </div>
    </>
  );
}

function SysAssistLogic() {
  console.log('work');
  const page = useSelector((state) => state.pageSlice.page);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <div className="btncont">
        <>
          <button
            onClick={() => {
              navigate('/system_assistants');
              dispatch(setPage('/system_assistants'));
            }}>
            Профиль
          </button>
          <button
            onClick={() => {
              if (window.confirm('Вы действительно хотите выйти?')) {
                dispatch(logout());
                window.localStorage.removeItem('token');
              }
              navigate('/');
              dispatch(setPage('/'));
            }}>
            Выйти
          </button>
        </>
      </div>
    </>
  );
}

function Header({ auth, user, teacher }) {
  const page = useSelector((state) => state.pageSlice.page);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(page);
  }, [page]);
  return (
    <div className="header">
      <div className="container">
        <img src={logo} alt="Логотип" className="logo"></img>
        <div>
          <div className="maininf">
            Система учета процессов подготовки кадров в аспирантуре научного учреждения
          </div>
        </div>
        {auth ? (
          page !== '/' ? (
            page !== '/system_assistants' && page !== '/admins' && page !== '/teachers' ? (
              <>
                <div className="btncont">
                  <button
                    onClick={() => {
                      dispatch(setPage('/system_assistants'));
                      navigate(-1);
                    }}>
                    Назад
                  </button>
                </div>
              </>
            ) : (
              <div className="btncont">
                <button
                  onClick={() => {
                    navigate('/');
                    dispatch(setPage('/'));
                  }}>
                  На главную страницу
                </button>
              </div>
            )
          ) : user ? (
            <AdminsLogic teacher={teacher} />
          ) : (
            <SysAssistLogic />
          )
        ) : page ==='/' ? (
          <div className="btncont">
            <button
              onClick={() => {
                navigate('/login');
                dispatch(setPage('/login'));
              }}>
              Войти
            </button>
          </div>
        ):<div className="btncont">
        <button
          onClick={() => {
            navigate('/');
            dispatch(setPage('/'));
          }}>
          На главную страницу
        </button>
      </div>}
      </div>
    </div>
  );
}

export default Header;
