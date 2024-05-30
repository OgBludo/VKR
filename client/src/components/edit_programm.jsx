import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import '../scss/app.scss';

import axios from '../axios';
import { setPage } from '../redux/slices/page';

function EditProgramm() {
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dispatch(setPage("/system_assistants/:id"))
  const [data, setDisc] = React.useState([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      info: '',
      disciplines: [
        {
          index: '',
          title: '',
          hours: '',
          lessons: [
            {
              number: '',
              info: '',
              hours: '',
            },
          ],
        },
      ],
    },
  });

  const {
    fields: disciplineFields,
    append: appendDiscipline,
    remove: removeDiscipline,
  } = useFieldArray({
    control,
    name: 'disciplines',
  });
  React.useEffect(() => {
    axios.get(`/programms/${id}`).then((res) => {
      setDisc(res.data);
      console.log(data);
      setLoading(false);
      reset(data);
    });
  }, [loading, id, dispatch, reset]);

  const onSubmit = async (values) => {
    const hasEmptyFields = (obj) => {
      return Object.values(obj).some((value) => {
        if (typeof value === 'string' && value.trim() === '') {
          return true;
        }
        if (Array.isArray(value)) {
          return value.some((item) => hasEmptyFields(item));
        }
        return false;
      });
    };

    if (hasEmptyFields(values)) {
      alert('Заполните все поля формы.');
      return;
    }

    // Проверка суммы значений поля hours для каждой дисциплины
    const isValidHours = values.disciplines.every((discipline) => {
      const sumHours = discipline.lessons.reduce((acc, lesson) => acc + parseInt(lesson.hours), 0);
      return parseInt(discipline.hours) === sumHours;
    });

    if (!isValidHours) {
      alert('Сумма часов занятий не совпадает с общим количеством часов для каждой дисциплины.');
      return;
    }

    try {
      await axios
        .patch(`/programms/${id}`, values)
        .then((res) => alert(res.data.message))
        .catch((e) => e.respons.data.message);
      setLoading(true);
      reset();
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Ошибка при обновлении программы.');
    }
  };

  const handleDeleteProgramm = async () => {
    await axios.delete(`/programms/${id}`).then((res) => {
      alert('Программа удалена');
      navigate('/system_assistants');
      reset();
    });
  };

  return (
    <div className="editform">
      <div id="popup-overlay" className="popup-overlay">
        <div className="form-container">
          <div>Редактирование программы аспирантуры</div>
          <div id="popup" className="popup">
            <form className="inputs" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField label="Шифр и наименование научной специальности" {...field} fullWidth margin="normal" />
                )}
              />
              <Controller
                name="info"
                control={control}
                render={({ field }) => (
                  <TextField label="Информация" {...field} fullWidth margin="normal" />
                )}
              />
              {disciplineFields.map((discipline, index) => (
                <div key={discipline.id} className="discipline-block">
                  <Controller
                    name={`disciplines.${index}.index`}
                    control={control}
                    render={({ field }) => (
                      <TextField label="Индекс дисциплины" {...field} fullWidth margin="normal" />
                    )}
                  />
                  <Controller
                    name={`disciplines.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <TextField label="Название дисциплины" {...field} fullWidth margin="normal" />
                    )}
                  />
                  <Controller
                    name={`disciplines.${index}.hours`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        type="number"
                        label="Количество часов"
                        {...field}
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                  <LessonsArray control={control} nestIndex={index} />
                  <div className="btnfcont">
                    {disciplineFields.length - 1 === index ? (
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() =>
                          appendDiscipline({
                            title: '',
                            hours: '',
                            lessons: [{ number: '', info: '', hours: '' }],
                          })
                        }>
                        Добавить дисциплину
                      </Button>
                    ) : (
                      <></>
                    )}
                    {disciplineFields.length > 1 ? (
                      <Button
                        type="button"
                        variant="outlined"
                        color="secondary"
                        onClick={() => removeDiscipline(index)}>
                        Удалить дисциплину
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
              <div className="buttons">
                <Button type="submit" variant="contained" color="primary">
                  Сохранить изменения
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={handleDeleteProgramm}>
                  Удалить программу
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonsArray({ control, nestIndex }) {
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `disciplines.${nestIndex}.lessons`,
  });

  return (
    <div className="lesson-block">
      {lessonFields.map((lesson, lessonIndex) => (
        <div key={lesson.id}>
          <Controller
            name={`disciplines.${nestIndex}.lessons.${lessonIndex}.number`}
            control={control}
            render={({ field }) => (
              <TextField type="number" label="Номер занятия" {...field} fullWidth margin="normal" />
            )}
          />
          <Controller
            name={`disciplines.${nestIndex}.lessons.${lessonIndex}.info`}
            control={control}
            render={({ field }) => (
              <TextField label="Информация о занятии" {...field} fullWidth margin="normal" />
            )}
          />
          <Controller
            name={`disciplines.${nestIndex}.lessons.${lessonIndex}.hours`}
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                label="Количество часов"
                {...field}
                fullWidth
                margin="normal"
              />
            )}
          />
          <div className="btnfcont">
            {lessonIndex === lessonFields.length - 1 ? (
              <>
                {' '}
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() =>
                    appendLesson({
                      number: '',
                      info: '',
                      hours: '',
                    })
                  }>
                  Добавить занятие
                </Button>
              </>
            ) : (
              <></>
            )}
            {lessonFields.length > 1 ? (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={() => removeLesson(lessonIndex)}>
                Удалить занятие
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditProgramm;
