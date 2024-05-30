import './scss/app.scss';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import React, { useState } from 'react';
import SysAssist from './Pages/SysAssist.jsx';

import Admins from './Pages/Admins.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCheckTeacherAuthData,
  fetchCheckUserAuthData,
  selectIsAuth,
} from './redux/slices/auth.js';
import NotFound from './components/NF.jsx';
import NewProgramm from './components/NewProgram.jsx';
import EditSchdeule from './components/EditSchedule.jsx';
import Calendary from './components/Calendary.jsx';
import Teachers from './components/teachers.jsx';
import Programm from './components/Programm.jsx';

import EditProgramm from './components/edit_programm.jsx';

function App() {
  const page = useSelector((state) => state.pageSlice.page);
  const [isAdmin, setIsAdmin] = React.useState(2);
  const [isTeacher, setIsTeacher] = React.useState(false);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    console.log(isAuth);
    if (isAuth)
      dispatch(fetchCheckUserAuthData())
        .then((res) => {
          setIsAdmin(res.payload.isAdmin);
          setIsTeacher(false);
        })
        .catch((e) => {
          dispatch(fetchCheckTeacherAuthData()).then((res) => {
            setIsTeacher(true);
            setIsAdmin(2);
          });
        });
  }, [isAuth]);

  return (
    <div className="App">
      {page ? <Header auth={isAuth} user={isAdmin} teacher={isTeacher} /> : <></>}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {isAuth ? (
          <>
            {isAdmin ? (
              !isTeacher ? (
                <Route path="/admins" element={<Admins />} />
              ) : (
                <>
                  <Route path="/teachers" element={<Teachers />} />
                </>
              )
            ) : (
              <>
                <Route path="/system_assistants" element={<SysAssist />} />
                <Route path="/system_assistants/programm/:id" element={<EditProgramm />} />
                <Route path="/system_assistants/new_programm" element={<NewProgramm />} />
                <Route path="/system_assistants/schedule" element={<Calendary />} />
                <Route path="/system_assistants/schedule/edit" element={<EditSchdeule />} />
              </>
            )}
          </>
        ) : (
          <></>
        )}
        <Route path="*" element={<NotFound />} />

      </Routes>

      <Outlet />
      <Footer />
    </div>
  );
}
export default App;
