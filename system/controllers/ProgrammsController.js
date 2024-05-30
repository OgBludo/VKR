import ProgrammModel from '../models/programm.js';
import { validationResult } from 'express-validator';
import lessonsSchema from '../models/schedule.js';

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]['msg']);
    }

    const doc = new ProgrammModel({
      title: req.body.title,
      info: req.body.info,
      disciplines: req.body.disciplines,
    });

    if (
      !(await ProgrammModel.findOne({
        title: doc.title,
      }))
    ) {
      await doc.save();
      res.status(200).json({
        message: 'Программа успешно добавлена',
      });
    } else {
      console.log('ono');
      res.status(400).json({
        message: 'Такая программа уже существует',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать программу аспирантуры',
    });
  }
};
export const getall = async (req, res) => {
  try {
    const programms = await ProgrammModel.find();
    res.json(programms);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить программы',
    });
  }
};
export const getone = async (req, res) => {
  try {
    const programmId = req.params.id;
    const programm = await ProgrammModel.findOne({
      _id: programmId,
    });
    res.json(programm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить программы',
    });
  }
};
export const remove = async (req, res) => {
  try {
    const programmId = req.params.id;
    const programm = await ProgrammModel.findOneAndDelete({
      _id: programmId,
    });
    res.json(programm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить программы',
    });
  }
};

export const updateprog = async (req, res) => {
  try {
    const programmId = req.params.id;
    const updatedProgramm = await ProgrammModel.findOneAndUpdate(
      { _id: programmId },
      { $set: req.body },
      { new: true },
    );
    if (!updatedProgramm) {
      return res.status(404).json({
        message: 'Программа не найдена',
      });
    }
    return res.status(200).json({
      message: 'Программа успешно обновлена',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить программу',
    });
  }
};

export const updatedisc = async (req, res) => {
  try {
    const programmId = req.params.id;
    const programm = await ProgrammModel.findOneAndUpdate(
      {
        _id: programmId,
      }, // Находим нужный объект в массиве disciplines по значению index
      {
        $push: { disciplines: req.body.disciplines },
      },
      { new: true },
    );
    return res.json(programm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить дисциплину',
    });
  }
};
export const updateles = async (req, res) => {
  try {
    const programmId = req.params.id;
    const programm = await ProgrammModel.findOneAndUpdate(
      {
        _id: programmId,
        'disciplines.index': req.body.disciplines.index,
      }, // Находим нужный объект в массиве disciplines по значению index
      {
        $push: { 'disciplines.$.lessons': req.body.disciplines.lessons },
      },
      { new: true },
    );
    return res.json(programm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить занятие',
    });
  }
};

export const addSchedule = async (req, res) => {
  try {
    console.log(req.body.schedule);
    // Получение данных из запроса
    const schedulesData = req.body.schedule;

    // Для каждого расписания в массиве
    for (const scheduleData of schedulesData) {
      // Проверить, существует ли расписание с указанной датой
      const existingSchedule = await lessonsSchema.findOne({ date: scheduleData.date });

      // Если расписание существует, вернуть ошибку
      if (existingSchedule) {
        return res.status(400).json({
          message: `Расписание для даты ${scheduleData.date} уже существует`,
        });
      }

      // Создать новое расписание
      const newSchedule = await lessonsSchema.create(scheduleData);
    }

    // Отправка успешного ответа
    res.status(201).json({
      message: 'Расписания успешно добавлены',
    });
  } catch (error) {
    console.error(error);
    // Отправка ошибки клиенту
    res.status(500).json({
      message: 'Не удалось добавить расписания',
      error: error.message,
    });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await lessonsSchema.find(); // Получаем все расписания из базы данных
    res.status(200).json(schedules); // Отправляем полученные расписания в ответ
  } catch (err) {
    console.error(err); // Выводим ошибку в консоль
    res.status(500).json({ message: 'Не удалось получить расписания' }); // Отправляем ошибку клиенту
  }
};
export const getAllSchedulesWithDetails = async (req, res) => {
  try {
    // Получаем все расписания с уроками
    const schedulesData = await lessonsSchema.find().populate({
      path: 'lessons',
      populate: {
        path: 'teacherId',
        model: 'Teacher',
      },
    });

    // Собираем данные о дисциплинах и уроках
    const programms = await ProgrammModel.find();
    const disciplinesData = {};
    const lessonsData = {};
    for (const programm of programms) {
      for (const discipline of programm.disciplines) {
        disciplinesData[discipline._id.toString()] = {
          index: discipline.index,
          title: discipline.title,
          hours: discipline.hours,
          lessons: discipline.lessons.map((lesson) => ({
            number: lesson.number,
            info: lesson.info,
            hours: lesson.hours,
          })),
        };
        for (const les of discipline.lessons) {
          lessonsData[les._id.toString()] = {
            number: les.number,
            info: les.info,
            hours: les.hours,
          };
        }
      }
    }

    // Формируем новый документ с данными о расписаниях и деталях
    const schedulesWithDetails = schedulesData.map((schedule) => {
      const scheduleData = JSON.parse(JSON.stringify(schedule)); // Глубокое копирование объекта
      scheduleData.lessons = scheduleData.lessons.map((lesson) => {
        const lessonData = JSON.parse(JSON.stringify(lesson)); // Глубокое копирование объекта
        lessonData.teacherInfo = lessonData.teacherId;
        lessonData.disciplineInfo = disciplinesData[lessonData.disciplineId.toString()];
        lessonData.lessonInfo = lessonsData[lessonData.lessonId.toString()];
        delete lessonData.teacherId;
        delete lessonData.disciplineId;
        delete lessonData.lessonId;
        return lessonData;
      });
      return scheduleData;
    });

    res.status(200).json(schedulesWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не удалось получить расписания с деталями' });
  }
};

export const updateOrInsertRecords = async (req, res) => {
  const recordsToUpdate = req.body.schedule; // Получаем данные из запроса

  try {
    const updatedRecords = [];

    for (const record of recordsToUpdate) {
      const existingRecord = await lessonsSchema.findOne({ date: record.date }); // Проверяем существует ли запись с такой датой

      if (existingRecord) {
        // Если запись существует, обновляем её
        const updatedRecord = await lessonsSchema.findOneAndUpdate(
          { _id: existingRecord._id },
          record,
          { new: true },
        );
        updatedRecords.push(updatedRecord);
      } else {
        // Если запись не существует, создаем новую
        const newRecord = new lessonsSchema(record);
        const savedRecord = await newRecord.save();
        updatedRecords.push(savedRecord);
      }
    }

    // Находим все записи в базе данных, которые не были обновлены или добавлены в запросе
    const allRecords = await lessonsSchema.find({});
    const recordsToDelete = allRecords.filter(
      (record) => !updatedRecords.find((r) => r._id.equals(record._id)),
    );

    // Удаляем записи из базы данных, которых нет в теле запроса
    for (const record of recordsToDelete) {
      await lessonsSchema.findOneAndDelete({ _id: record._id });
    }

    return res.status(200).json({
      message: 'Данные успешно обновлены',
      updatedRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Произошла ошибка при обновлении данных',
      error: error.message,
    });
  }
};
