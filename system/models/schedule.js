import mongoose from 'mongoose';
const { Schema } = mongoose;

// Схема для расписания
const lessonsSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  lessons: [
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
      },
      disciplineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
    },
  ],
});

// Модель для расписания
export default mongoose.model('Lessons', lessonsSchema);
