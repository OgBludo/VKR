import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    login: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    available_time: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Teacher', TeacherSchema);
