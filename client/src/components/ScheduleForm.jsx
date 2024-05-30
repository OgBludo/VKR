import React, { useEffect } from 'react';
import axios from '../axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, TextField, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DayForm from './Day';
import { Link } from 'react-router-dom';
import { setPage } from '../redux/slices/page';

function ScheduleForm() {
  let TeachersData = [];

  let disciplinesData = [];

  const { register, handleSubmit, control, setValue, watch, getValues, reset } = useForm({
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
  let dates = [];
  const onSubmit = (data) => {
    const hasEmptyFields = Object.values(data.schedule).some((day) =>
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
      .post('/schedule', data)
      .then((response) => {
        alert(response.data.message);
        dates = [];
        reset();
      })
      .catch((e) => {
        alert(e.response.data.message);
        reset(data);
        dates = [];
      });
  };

  const [progs, setProgs] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);

  useEffect(() => {
    axios.get('/programms').then((response) => setProgs(response.data));
    axios.get('/teachers').then((response) => setTeachers(response.data));
  }, []);

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

  let antestdata = [];
  let testData = [];
  if (teachers) {
    teachers.map((value) => {
      const newdata = {
        id: value._id,
        name: value.fullname,
        maxHoursPerDay: value.available_time,
        disciplines: value.subjects,
      };
      testData.push(newdata);
    });
  }
  if (progs) {
    progs.map((value) =>
      value.disciplines.map((value) => {
        const less = [];
        value.lessons.map((les) => {
          const lesson = {
            id: les._id,
            duration: les.hours,
            info: les.info,
          };
          less.push(lesson);
        });
        const newdata = {
          id: value._id,
          name: value.index,
          lessons: less,
        };
        antestdata.push(newdata);
      }),
    );
  }
  TeachersData = testData;
  disciplinesData = antestdata;
  console.log(disciplinesData);

  return (
    <div className="editform">
      <div className="new_prog">
        <Link className="tol" to="/system_assistants/schedule">
          Просмотр календаря
        </Link>
      </div>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        {scheduleFields.map((item, index) => (
          <div className="popup" key={index}>
            <div className="dateBtn">
              <TextField
                className="textField"
                label="Выберите дату"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register(`schedule[${index}].date`)}
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
            {/* Дополнительные поля для уроков можно добавить здесь */}
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

export default ScheduleForm;
