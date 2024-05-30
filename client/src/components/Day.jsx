import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const DayForm = ({
  length,
  getValues,
  number,
  index,
  register,
  setValue,
  teachers,
  disciplines,
}) => {
  const isTimeConflict = (startTime, duration) => {
    // Helper function to convert "HH:MM" to minutes from start of the day
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStartTimeInMinutes = convertToMinutes(startTime);
    const newEndTimeInMinutes = newStartTimeInMinutes + duration * 60;
    let lessons = getValues(`schedule[${index}].lessons`);

    if (lessons.length > 1) {
      console.log(lessons);
      for (const lesson of lessons) {
        if (disciplines.find((obj) => obj.id === lesson.disciplineId)) {
          if (lesson.teacherId === selectedTeacher.id && lesson.lessonId !== selectedLesson.id) {
            const existingStartTimeInMinutes = convertToMinutes(lesson.startTime);
            const existingEndTimeInMinutes =
              existingStartTimeInMinutes +
              disciplines
                .find((obj) => obj.id === lesson.disciplineId)
                .lessons.find((obj) => obj.id === lesson.lessonId).duration *
                60;

            if (
              (newStartTimeInMinutes <= existingEndTimeInMinutes &&
                newEndTimeInMinutes >= existingStartTimeInMinutes) ||
              (existingStartTimeInMinutes <= newEndTimeInMinutes &&
                existingEndTimeInMinutes >= newStartTimeInMinutes)
            ) {
              return true; // Conflict detected
            }
          }
        }
      }
    }
    return false; // No conflict
  };
  function checkTime() {
    const data = getValues(`schedule[${index}].lessons`);
    let avg_time = 0;
    let teacherTime = 0;
    teachers.find((obj) => {
      if (selectedTeacher.id === obj.id) teacherTime = obj.maxHoursPerDay;
    });
    data.map((value) => {
      if (value.teacherId === selectedTeacher.id) {
        let discipline = disciplines.find((obj) => obj.id === value.disciplineId);
        discipline.lessons.map((val) => {
          if (val.id === value.lessonId) {
            avg_time += val.duration;
          }
        });
      }
    });
    return teacherTime - avg_time;
  }

  const [selectedTeacher, setSelectedTeacher] = React.useState();
  const [selectedDiscipline, setSelectedDiscipline] = React.useState();
  const [isselectedLesson, setIsSelectedLesson] = React.useState(false);
  const [selectedLesson, setSelectedLesson] = React.useState(false);
  return (
    <div>
      <TextField
        className="textField"
        label="Выберите преподавателя"
        select
        fullWidth
        {...register(`schedule[${index}].lessons[${number}].teacherId`)}
        onChange={(e) => {
          setValue(`schedule[${index}].lessons[${number}].teacherId`, e.target.value);
          setSelectedTeacher(
            teachers.find((obj) => {
              return obj.id === e.target.value;
            }),
          );
          setSelectedDiscipline(undefined);
          setIsSelectedLesson(false);
        }}>
        {teachers.map((teacher) => (
          <MenuItem number={teacher.id} value={teacher.id}>
            {teacher.name}
          </MenuItem>
        ))}
      </TextField>

      {selectedTeacher ? (
        <TextField
          className="textField"
          label="Выберите дисциплину"
          select
          fullWidth
          {...register(`schedule[${index}].lessons[${number}].disciplineId`)}
          onChange={(e) => {
            setValue(`schedule[${index}].lessons[${number}].disciplineId`, e.target.value);
            setSelectedDiscipline(
              disciplines.find((obj) => {
                return obj.id === e.target.value;
              }),
            );
            setIsSelectedLesson(false);
          }}>
          {disciplines
            .filter((discipline) => selectedTeacher.disciplines.includes(discipline.name))
            .map((discipline) => (
              <MenuItem number={discipline.id} value={discipline.id}>
                {discipline.name}
              </MenuItem>
            ))}
        </TextField>
      ) : (
        <></>
      )}

      {selectedDiscipline ? (
        <TextField
          className="textField"
          label="Выберите занятие"
          select
          fullWidth
          {...register(`schedule[${index}].lessons[${number}].lessonId`)}
          onChange={(e) => {
            setValue(`schedule[${index}].lessons[${number}].lessonId`, e.target.value);
            setIsSelectedLesson(true);
            setSelectedLesson(
              selectedDiscipline.lessons.find((obj) => {
                return obj.id === e.target.value;
              }),
            );
          }}>
          {selectedDiscipline.lessons.map((lesson) => (
            <MenuItem number={lesson.id} value={lesson.id}>
              {lesson.info} Время занятия: {lesson.duration}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <></>
      )}

      {isselectedLesson && checkTime() >= 0 ? (
        <>
          {length === number ? (
            <div>Оставшееся время преподавателя: {checkTime(selectedTeacher.id.index)}</div>
          ) : (
            <></>
          )}
          <TextField
            className="textField"
            label="Выберите время занятия"
            type="time"
            InputLabelProps={{ shrink: true }}
            {...register(`schedule[${index}].lessons[${number}].startTime`)}
            onChange={(e) => {
              const startTime = e.target.value;

              if (isTimeConflict(startTime, selectedLesson.duration)) {
                alert('На это время уже есть занятие');
                setValue(`schedule[${index}].lessons[${number}].startTime`, '');
              } else {
                setValue(`schedule[${index}].lessons[${number}].startTime`, startTime);
              }
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DayForm;
