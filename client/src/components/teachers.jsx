import React, { useEffect, useState } from 'react';
import '../scss/app.scss';
import { useDispatch } from 'react-redux';
import { fetchCheckTeacherAuthData } from '../redux/slices/auth';
import Calendary from '../components/Calendary';

function Teachers() {
  const dispatch = useDispatch();
  const [teacherID, setTeacherId] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      dispatch(fetchCheckTeacherAuthData()).then((res) => setTeacherId(res.payload._id));
    }
    fetchData();
  }, []);

  return (
    <>
      <Calendary teacherID={teacherID} />
    </>
  );
}

export default Teachers;
