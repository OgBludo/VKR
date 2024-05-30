import { ArrowDropDownCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgramms, setActiveIndex, setTheme } from '../redux/slices/progSlice';
import { Link } from 'react-router-dom';
import Disc from './Disciplines';
import React from 'react';
import MyLoader from './Loader.jsx';
import * as XLSX from 'xlsx';

import { TextField } from '@mui/material';
import { setPage } from '../redux/slices/page.js';

function Text({ label, value }) {
  return (
    <TextField
      multiline
      className="text"
      label={label}
      value={value}
      InputProps={{
        readOnly: true,
        disabled: true,
        classes: {
          disabled: 'disabled-text',
        },
      }}
      variant="outlined"
    />
  );
}

function Programms() {
  const dispatch = useDispatch();
  dispatch(setPage('/system_assistants'));
  React.useEffect(() => {
    dispatch(fetchProgramms());
  }, [dispatch]);

  const data = useSelector((state) => state.progSlice.data);

  const activeIndex = useSelector((state) => state.progSlice.activeIndex);
  const theme = useSelector((state) => state.progSlice.theme);
  const prevTheme = useSelector((state) => state.progSlice.prevTheme);
  const prevind = useSelector((state) => state.progSlice.prevActiveIndex);
  const test = useSelector((state) => state.progSlice.items);
  const loading = useSelector((state) => state.progSlice.isLoading);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    test.forEach((program) => {
      const wsData = [
        ['ID', program._id],
        ['Шифр и наименование научной специальности', program.title],
        ['Информация', program.info],
        [''],
        ['Дисциплины'],
        ['Индекс', 'Заголовок', 'Часы', 'Занятия'],
      ];

      program.disciplines.forEach((discipline) => {
        wsData.push([discipline.index, discipline.title, discipline.hours]);

        discipline.lessons.forEach((lesson) => {
          wsData.push(['', '', '', `Занятие ${lesson.number}: ${lesson.info} (${lesson.hours} ч)`]);
        });
      });

      const sheetName =
        program.title.length > 31 ? program.title.substring(0, 28) + '...' : program.title;
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'programms.xlsx');
  };

  return (
    <div className="prscont">
      <div className="new_prog">
        <Link className="tol" to="/system_assistants/new_programm">
          Создать программу
        </Link>
        <button className="tol" onClick={exportToExcel}>
          Выгрузить в Excel
        </button>
      </div>
      {loading
        ? [...new Array(6)].map((value, i) => <MyLoader key={i} />)
        : test.map((value, ind) => (
            <div key={value._id} className="programms">
              <div className="container">
                <div className="titleinf">
                  <Link className="a" to={`/system_assistants/programm/${value._id}`}>
                    {data[0]}
                  </Link>
                  <div> {value.title}</div>
                </div>
                <div className="inftxt">
                  <Text label={data[1]} value={value.info} />
                </div>
                {activeIndex === value._id && prevind !== activeIndex ? (
                  <Disc Text={Text} disciplines={value.disciplines} />
                ) : (
                  <></>
                )}
                <div
                  onClick={() => {
                    dispatch(setActiveIndex(value._id));
                  }}
                  className="showbtn">
                  <ArrowDropDownCircle
                    onClick={() => dispatch(setTheme(value._id))}
                    className={activeIndex === value._id ? theme : prevTheme}
                  />
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

export default Programms;
