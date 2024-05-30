import React, { useEffect, useState } from 'react';
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
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [isLessonSelected, setIsLessonSelected] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [teacherId, setTeacherId] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [start, setStart] = useState('');

  useEffect(() => {
    const lessonData = getValues(`schedule[${index}].lessons[${number}]`);
    if (lessonData) {
      setTeacherId(lessonData.teacherId);
      setDisciplineId(lessonData.disciplineId);
      setLessonId(lessonData.lessonId);
      setStart(lessonData.startTime);
    }
  }, [selectedTeacher, selectedDiscipline, selectedLesson, start]);

  useEffect(() => {
    const lessonData = getValues(`schedule[${index}].lessons[${number}]`);
    if (lessonData) {
      const teacher = teachers.find((t) => t.id === lessonData.teacherId);
      const discipline = disciplines.find((d) => d.id === lessonData.disciplineId);
      const lesson = discipline?.lessons.find((l) => l.id === lessonData.lessonId);

      setSelectedTeacher(teacher);
      setSelectedDiscipline(discipline);
      setSelectedLesson(lesson);
      setIsLessonSelected(!!lesson);
    }
  }, [number, index, getValues, teachers, disciplines]);

  const isTimeConflict = (startTime, duration) => {
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStartTimeInMinutes = convertToMinutes(startTime);
    const newEndTimeInMinutes = newStartTimeInMinutes + duration * 60;
    let lessons = getValues(`schedule[${index}].lessons`);

    if (lessons.length > 1) {
      for (const lesson of lessons) {
        const lessonDiscipline = disciplines.find((obj) => obj.id === lesson.disciplineId);
        const lessonDuration =
          lessonDiscipline?.lessons.find((obj) => obj.id === lesson.lessonId)?.duration || 0;

        if (lesson.teacherId === selectedTeacher?.id && lesson.lessonId !== selectedLesson?.id) {
          const existingStartTimeInMinutes = convertToMinutes(lesson.startTime);
          const existingEndTimeInMinutes = existingStartTimeInMinutes + lessonDuration * 60;

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
    return false; // No conflict
  };

  const checkTime = () => {
    const data = getValues(`schedule[${index}].lessons`);
    let avg_time = 0;
    let teacherTime = selectedTeacher?.maxHoursPerDay || 0;

    data.forEach((value) => {
      if (value.teacherId === selectedTeacher?.id) {
        let discipline = disciplines.find((obj) => obj.id === value.disciplineId);
        discipline.lessons.forEach((val) => {
          if (val.id === value.lessonId) {
            avg_time += val.duration;
          }
        });
      }
    });

    return teacherTime - avg_time;
  };

  return (
    <div>
      <TextField
        className="textField"
        label="Выберите преподавателя"
        select
        fullWidth
        value={teacherId}
        {...register(`schedule[${index}].lessons[${number}].teacherId`)}
        onChange={(e) => {
          setValue(`schedule[${index}].lessons[${number}].teacherId`, e.target.value);
          setTeacherId(e.target.value);
          const teacher = teachers.find((obj) => obj.id === e.target.value);
          setSelectedTeacher(teacher);
          setSelectedDiscipline(null);
          setIsLessonSelected(false);
        }}>
        {teachers.map((teacher) => (
          <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.name}
          </MenuItem>
        ))}
      </TextField>

      {selectedTeacher && (
        <TextField
          className="textField"
          label="Выберите дисциплину"
          select
          fullWidth
          value={disciplineId}
          {...register(`schedule[${index}].lessons[${number}].disciplineId`, {
            value: selectedDiscipline?.id || '',
          })}
          onChange={(e) => {
            setValue(`schedule[${index}].lessons[${number}].disciplineId`, e.target.value);
            const discipline = disciplines.find((obj) => obj.id === e.target.value);
            setSelectedDiscipline(discipline);
            setIsLessonSelected(false);
          }}>
          {disciplines
            .filter((discipline) => selectedTeacher.disciplines.includes(discipline.name))
            .map((discipline) => (
              <MenuItem key={discipline.id} value={discipline.id}>
                {discipline.name}
              </MenuItem>
            ))}
        </TextField>
      )}

      {selectedDiscipline && (
        <TextField
          className="textField"
          label="Выберите занятие"
          select
          fullWidth
          value={lessonId}
          {...register(`schedule[${index}].lessons[${number}].lessonId`, {
            value: selectedLesson?.id || '',
          })}
          onChange={(e) => {
            setValue(`schedule[${index}].lessons[${number}].lessonId`, e.target.value);
            const lesson = selectedDiscipline.lessons.find((obj) => obj.id === e.target.value);
            setIsLessonSelected(true);
            setSelectedLesson(lesson);
          }}>
          {selectedDiscipline.lessons.map((lesson) => (
            <MenuItem key={lesson.id} value={lesson.id}>
              {lesson.info} Время занятия: {lesson.duration}
            </MenuItem>
          ))}
        </TextField>
      )}

      {isLessonSelected && checkTime() >= 0 && (
        <>
          {length === number && <div>Оставшееся время преподавателя: {checkTime()}</div>}
          <TextField
            className="textField"
            label="Выберите время занятия"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={start}
            {...register(`schedule[${index}].lessons[${number}].startTime`, {
              value: selectedLesson?.startTime || '',
            })}
            onChange={(e) => {
              const startTime = e.target.value;

              if (isTimeConflict(startTime, selectedLesson.duration)) {
                alert('На это время уже есть занятие');
                setValue(`schedule[${index}].lessons[${number}].startTime`, '');
              } else {
                setValue(`schedule[${index}].lessons[${number}].startTime`, startTime);
                setStart(e.target.value);
              }
            }}
          />
        </>
      )}
    </div>
  );
};

export default DayForm;
