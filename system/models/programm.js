import mongoose from 'mongoose';

const ProgrammSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    disciplines: [
      {
        index: {
          type: String,
        },
        title: {
          type: String,
        },
        hours: {
          type: Number,
        },
        lessons: [
          {
            number: {
              type: Number,
            },
            info: {
              type: String,
            },
            hours: {
              type: Number,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('Programm', ProgrammSchema);
