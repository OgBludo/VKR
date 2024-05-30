import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';

import TeacherModel from '../models/teacher.js';

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]['msg']);
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login: req.body.login,
      fullname: req.body.fullname,
      isAdmin: req.body.isAdmin,
      passwordHash: passHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'nevermore',
      { expiresIn: '1y' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка регистрации',
    });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]['msg']);
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const doc = new TeacherModel({
      login: req.body.login,
      fullname: req.body.fullname,
      subjects: req.body.subjects,
      available_time: req.body.available_time,
      passwordHash: passHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'nevermore',
      { expiresIn: '1y' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка регистрации',
    });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]['msg']);
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      login: req.body.login,
      fullname: req.body.fullname,
      isAdmin: req.body.isAdmin,
      passwordHash: passHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'nevermore',
      { expiresIn: '1y' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка регистрации',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ login: req.body.login });
    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'nevermore',
      { expiresIn: '1y' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка аутентификации',
    });
  }
};
export const getTeachers = async (req, res) => {
  try {
    const teachers = await TeacherModel.find();
    res.json(teachers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить преподавателей',
    });
  }
};

export const getme = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка аутентификации',
    });
  }
};

export const getTeacher = async (req, res) => {
  try {
    const user = await TeacherModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка аутентификации',
    });
  }
};
export const loginTeacher = async (req, res) => {
  try {
    const user = await TeacherModel.findOne({ login: req.body.login });
    if (!user) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'nevermore',
      { expiresIn: '1y' },
    );

    const { passwordHash, ...userData } = user._doc;

    return res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка аутентификации',
    });
  }
};
