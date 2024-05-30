import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {
  loginValidator,
  programmCreateValidator,
  registerValidator,
  registerUserValidator,
  registerTeacherValidator,
} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';

import * as userController from './controllers/UserController.js';
import * as programmController from './controllers/ProgrammsController.js';

mongoose
  .connect('mongodb+srv://admin:qwerty123@mongoserver.bcb7ltp.mongodb.net/server')
  .then(() => console.log('Connected to db'))
  .catch(() => console.log('db connection error', err));

//создаем express приложение
const app = express();
//для чтения json формата
app.use(express.json());
app.use(cors());
//пример запроса на основной путь, предполагает req - то что отправлено клиентом res - сервером
app.get('/', (req, res) => {
  res.send(' 1111 Hello World!');
});

app.get('/me', checkAuth, userController.getme);
app.get('/teacherMe', checkAuth, userController.getTeacher);
app.post('/login', loginValidator, userController.login);
app.post('/login/teacher', loginValidator, userController.loginTeacher);
//registerValidator проверит что есть то что в нем написано
app.post('/register', registerValidator, userController.register);
app.post('/register/user', checkAuth, registerUserValidator, userController.registerUser);
app.get('/teachers', userController.getTeachers);
app.post('/register/teacher', checkAuth, registerTeacherValidator, userController.registerTeacher);
app.post('/programms', checkAuth, programmCreateValidator, programmController.create);
app.get('/programms', programmController.getall);
app.get('/programms/:id', programmController.getone);
app.delete('/programms/:id', checkAuth, programmController.remove);
app.patch('/programms/:id', checkAuth, programmController.updateprog);
app.post('/schedule', programmController.addSchedule);
app.get('/schedule', programmController.getAllSchedules);
app.get('/detailedSchedule', programmController.getAllSchedulesWithDetails);
app.patch('/updateSchedule', programmController.updateOrInsertRecords);

//прикрепляем порт для сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
