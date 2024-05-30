import axios from '../axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { setPage } from '../redux/slices/page';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function CalendarComponent({ teacherID }) {
  const dispatch = useDispatch();
  const [lessonsData, setLessonsData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exportVisible, setExportVisible] = useState(true); // Для отображения/скрытия кнопки экспорта

  useEffect(() => {
    dispatch(setPage(window.location.pathname));
    async function fetchData() {
      try {
        const response = await axios.get('/detailedSchedule');
        setLessonsData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }
    fetchData();
  }, []);
  console.log(teacherID);

  const formatTime = (time) => {
    if (!time) return ''; // Проверка, если время не определено
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const renderLessonsForDate = (date) => {
    if (!lessonsData) {
      return null;
    }

    const lessonsForDate = lessonsData.find(
      (day) => new Date(day.date).toDateString() === new Date(date).toDateString(),
    );

    if (!lessonsForDate || !lessonsForDate.lessons) {
      return null;
    }

    return lessonsForDate.lessons.map((lesson, index) => {
      // Проверка, соответствует ли занятие преподавателю, если он указан
      if (teacherID && (!lesson.teacherInfo || lesson.teacherInfo._id !== teacherID)) {
        return null;
      }
      return (
        <div key={index} className="lesson">
          <div>Время начала: {formatTime(lesson.startTime)}</div>
          {lesson.teacherInfo && <div>Преподаватель: {lesson.teacherInfo.fullname}</div>}
          {lesson.disciplineInfo && <div>Дисциплина: {lesson.disciplineInfo.title}</div>}
          {lesson.lessonInfo && typeof lesson.lessonInfo.info === 'string' && (
            <div>Информация о занятии: {lesson.lessonInfo.info}</div>
          )}
        </div>
      );
    });
  };

  const goToPreviousWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
  };

  const goToNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
  };

  const generateCalendarDays = () => {
    const daysArray = [];
    const weekArray = [];

    let startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.getTime() + i * 86400000);
      if (day.getDay() === 0) continue; // Пропускаем воскресенье
      const dayComponent = (
        <td key={day.toISOString()} className={getClassNames(day)}>
          <div className="day">{renderLessonsForDate(day)}</div>
        </td>
      );
      weekArray.push(dayComponent);
    }
    daysArray.push(<tr key={startDate.toISOString()}>{weekArray}</tr>);

    return daysArray;
  };

  const generateCalendarHeader = () => {
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);
    return (
      <tr>
        {daysOfWeek.map((day, index) => {
          const dayDate = new Date(firstDayOfWeek);
          dayDate.setDate(dayDate.getDate() + index);
          return (
            <th key={index}>
              <div>{day}</div>
              <div>{dayDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>
            </th>
          );
        })}
      </tr>
    );
  };

  const getClassNames = (day) => {
    let classNames = 'calendar-day';
    if (day.getMonth() !== currentDate.getMonth()) {
      classNames += ' other-month';
    }
    return classNames;
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Если задан teacherID, скрываем кнопку экспорта
    if (teacherID) {
      setExportVisible(false);
    }

    // Перебираем все доступные дни
    lessonsData.forEach((dayData) => {
      const day = new Date(dayData.date);
      const lessons = dayData.lessons;

      // Проверяем, есть ли занятия в этот день и соответствуют ли они указанному преподавателю
      if (
        lessons &&
        lessons.length > 0 &&
        (!teacherID ||
          lessons.some((lesson) => lesson.teacherInfo && lesson.teacherInfo.id === teacherID))
      ) {
        const wsData = [
          ['День', 'Месяц', 'Время начала', 'Преподаватель', 'Дисциплина', 'Информация о занятии'],
        ];

        // Добавляем каждое занятие в лист данных
        lessons.forEach((lesson) => {
          const dayOfMonth = day.getDate();
          const month = day.toLocaleDateString('ru-RU', { month: 'long' });
          const startTime = lesson.startTime;
          const teacher = lesson.teacherInfo ? lesson.teacherInfo.fullname : '';
          const discipline = lesson.disciplineInfo ? lesson.disciplineInfo.title : '';
          const lessonInfo =
            lesson.lessonInfo && typeof lesson.lessonInfo.info === 'string'
              ? lesson.lessonInfo.info
              : '';

          const rowData = [dayOfMonth, month, startTime, teacher, discipline, lessonInfo];
          wsData.push(rowData);
        });

        // Добавляем лист с занятиями в книгу Excel
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(
          wb,
          ws,
          `${day.toLocaleDateString('ru-RU', { day: 'numeric', month: 'numeric' })}`,
        );
      }
    });

    // Сохраняем книгу Excel
    XLSX.writeFile(wb, 'schedule.xlsx');
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="navigation-buttons">
          <button onClick={goToPreviousWeek}>Предыдущая неделя</button>
          <button onClick={goToNextWeek}>Следующая неделя</button>
        </div>
        <h2>
          Неделя с{' '}
          {new Date(
            currentDate.getTime() - (currentDate.getDay() - 1) * 86400000,
          ).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}{' '}
          по{' '}
          {new Date(
            currentDate.getTime() + (6 - currentDate.getDay()) * 86400000,
          ).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
          })}
        </h2>
        {window.location.pathname === '/system_assistants/schedule' && ( // Отображение кнопки экспорта, если visible === true
          <>
          <div className="export-button navigation-buttons">
            <button onClick={exportToExcel}>Выгрузить в Excel</button> 
            <button> <Link className="navigation-buttons" to="/system_assistants/schedule/edit">Изменить расписание</Link></button>
          </div>
          
          </>
        )}
        <table>
          <thead>{generateCalendarHeader()}</thead>
          <tbody>{generateCalendarDays()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default CalendarComponent;
