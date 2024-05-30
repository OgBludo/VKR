import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button, TextField, IconButton, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DayForm from './EditDay';

function EditSchedule() {
  let dates = [];
  const { register, handleSubmit, control, setValue, watch, reset, getValues } = useForm({
    defaultValues: {
      schedule: [],
    },
  });

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: 'schedule',
  });

  const [progs, setProgs] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch programs and teachers
    axios.get('/programms').then((response) => setProgs(response.data));
    axios.get('/teachers').then((response) => setTeachers(response.data));

    // Fetch schedule and set it in the form
    axios.get('/schedule').then((response) => {
      const data = response.data.map((item) => ({
        ...item,
        date: item.date.split('T')[0], // Convert ISO date to YYYY-MM-DD
        lessons: item.lessons.map((lesson) => ({
          teacherId: lesson.teacherId,
          disciplineId: lesson.disciplineId,
          lessonId: lesson.lessonId,
          startTime: lesson.startTime,
        })),
      }));
      console.log(data);
      reset({ schedule: data });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = (data) => {
    const hasEmptyFields = data.schedule.some((day) =>
      day.lessons.some((lesson) => Object.values(lesson).some((value) => value === '')),
    );
    if (hasEmptyFields) {
      alert('Пожалуйста, заполните все поля перед отправкой');
      return;
    }
    for (const val of data.schedule) {
      if (dates.includes(val.date)) {
        console.log(val.date);
        alert(' Две одинаковые даты: ' + val.date);
        return;
      } else dates.push(val.date);
    }

    axios
      .patch('/updateSchedule', data)
      .then((response) => {
        alert(response.data.message);
        dates = [];
        reset(data);
      })
      .catch((e) => {
        alert(e.response.data.message);
        reset(data);
        dates = [];
      });
  };

  const handleAddLesson = (index) => {
    appendSchedule([]);

    const lessons = [...scheduleFields[index].lessons];

    const newLesson = { teacherId: '', disciplineId: '', lessonId: '', startTime: '' };
    lessons.push(newLesson);
    scheduleFields[index].lessons = lessons;
    setValue(`schedule[${index}].lessons`, lessons);

    appendSchedule([]);
  };

  const handleRemoveLesson = (index, lessonIndex) => {
    appendSchedule([]);
    const updatedLessons = scheduleFields[index].lessons;

    updatedLessons.splice(lessonIndex, 1);

    scheduleFields[index].lessons = updatedLessons;

    setValue(`schedule[${index}].lessons`, updatedLessons);

    appendSchedule([]);
  };
  const disciplinesData = progs.flatMap((prog) =>
    prog.disciplines.map((discipline) => ({
      id: discipline._id,
      name: discipline.index,
      lessons: discipline.lessons.map((lesson) => ({
        id: lesson._id,
        duration: lesson.hours,
        info: lesson.info,
      })),
    })),
  );

  const TeachersData = teachers.map((teacher) => ({
    id: teacher._id,
    name: teacher.fullname,
    maxHoursPerDay: teacher.available_time,
    disciplines: teacher.subjects,
  }));

  console.log(TeachersData);
  if (loading) return <div>Loading...</div>;

  return (
    <div className="editform">
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        {scheduleFields.map((item, index) => (
          <div className="popup" key={item.id}>
            <div className="dateBtn">
              <Controller
                name={`schedule[${index}].date`}
                control={control}
                render={({ field }) => (
                  <TextField
                    className="textField"
                    label="Выберите дату"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                )}
              />
              <IconButton className="btndate" onClick={() => removeSchedule(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </div>
            {watch(`schedule[${index}].date`) && (
              <>
                {!scheduleFields[index].lessons ? (
                  <IconButton onClick={() => handleAddLesson(index)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                ) : (
                  <>
                    {scheduleFields[index].lessons.map((lesson, ind) => (
                      <React.Fragment key={ind}>
                        <DayForm
                          key={ind}
                          number={ind}
                          teachers={TeachersData}
                          index={index}
                          disciplines={disciplinesData}
                          register={register}
                          setValue={setValue}
                          getValues={getValues}
                          length={scheduleFields[index].lessons.length - 1}
                        />
                        <div className="daybtn">
                          {scheduleFields[index].lessons.length - 1 === ind ? (
                            <IconButton className="btnday" onClick={() => handleAddLesson(index)}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                          ) : (
                            <></>
                          )}
                          {ind !== 0 ? (
                            <IconButton
                              className="btnday"
                              onClick={() => handleRemoveLesson(index, ind)}>
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          ) : (
                            <></>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        ))}
        <div className="subbtn">
          <Button
            className="addbtn"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() =>
              appendSchedule({
                date: '',
                lessons: [{ teacherId: '', disciplineId: '', lessonId: '', startTime: '' }],
              })
            }>
            Добавить день
          </Button>

          {scheduleFields.length > 0 && (
            <Button className="btnsub" type="submit" variant="contained">
              Отправить
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditSchedule;
