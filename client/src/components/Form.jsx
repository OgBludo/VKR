import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { TextField, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import '../scss/app.scss';

function PopupForm() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      info: '',
      disciplines: [
        {
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

  const handleButtonClick = () => setPopupOpen(true);
  const handleCloseClick = () => {
    setPopupOpen(false);
    reset();
  };
  const handleOutsideClick = (e) => {
    if (e.target.id === 'popup-overlay') {
      handleCloseClick();
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    // Dispatch your data here
    setPopupOpen(false);
    reset();
  };

  return (
    <div className="editform">
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        {window.location.pathname === '/system_assistants'
          ? 'Добавить новый элемент'
          : 'Редактировать'}
      </Button>
      {isPopupOpen && (
        <div id="popup-overlay" onClick={handleOutsideClick} className="popup-overlay">
          <div className="form-container">
            <div id="popup" className="popup">
              <form className="inputs" onSubmit={handleSubmit(onSubmit)}>
                {window.location.pathname === '/system_assistants' && (
                  <>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField label="Название" {...field} fullWidth margin="normal" />
                      )}
                    />
                    <Controller
                      name="info"
                      control={control}
                      render={({ field }) => (
                        <TextField label="Информация" {...field} fullWidth margin="normal" />
                      )}
                    />
                  </>
                )}
                {disciplineFields.map((discipline, index) => (
                  <div key={discipline.id} className="discipline-block">
                    <Controller
                      name={`disciplines.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label="Название дисциплины"
                          {...field}
                          fullWidth
                          margin="normal"
                        />
                      )}
                    />
                    <Controller
                      name={`disciplines.${index}.hours`}
                      control={control}
                      render={({ field }) => (
                        <TextField label="Количество часов" {...field} fullWidth margin="normal" />
                      )}
                    />
                    <LessonsArray control={control} nestIndex={index} />
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
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeDiscipline(index)}>
                      Удалить дисциплину
                    </Button>
                  </div>
                ))}
                <div className="buttons">
                  <Button type="submit" variant="contained" color="primary">
                    Сохранить изменения
                  </Button>
                </div>
              </form>
              <IconButton id="close-button" onClick={handleCloseClick}>
                <Close />
              </IconButton>
            </div>
          </div>
        </div>
      )}
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
              <TextField label="Номер занятия" {...field} fullWidth margin="normal" />
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
              <TextField label="Количество часов" {...field} fullWidth margin="normal" />
            )}
          />
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
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => removeLesson(lessonIndex)}>
            Удалить занятие
          </Button>
        </div>
      ))}
    </div>
  );
}

export default PopupForm;
