import { body } from 'express-validator';

export const registerValidator = [
  body('login', 'Некорректный логин').isEmail(),
  body('password', 'Некорректный пароль').isLength({ min: 5 }),
  body('secret', 'Неверно').isIn(['Test']),
  body('fullname', 'Некорректное имя').isLength({ min: 3 }),
];

export const registerUserValidator = [
  body('login', 'Некорректный логин').isEmail(),
  body('password', 'Некорректный пароль').isLength({ min: 5 }),
  body('fullname', 'Некорректное имя').isLength({ min: 3 }),
];

export const registerTeacherValidator = [
  body('login', 'Некорректный логин').isEmail(),
  body('password', 'Некорректный пароль').isLength({ min: 5 }),
  body('fullname', 'Некорректное имя').isLength({ min: 3 }),
  body('subjects', 'Введите предметы').not().isEmpty(),
  body('available_time', 'Время не может быть пустым').not().isIn([0]),
];

export const loginValidator = [
  body('login', 'Некорректный логин').isEmail(),
  body('password', 'Некорректный пароль').isLength({ min: 5 }),
];

export const programmCreateValidator = [
  body('title', 'Введите заголовок').isLength({ min: 3 }).isString(),
  body('info', 'Введите информацию').isLength({ min: 3 }).isString(),
];
