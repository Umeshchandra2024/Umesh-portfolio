import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter title'],
    },
    company: String,
    location: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false,
    },
    description: String,
    type: {
      type: String,
      enum: ['education', 'experience', 'other'],
      default: 'experience',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Timeline = mongoose.model('Timeline', timelineSchema);

export default Timeline;

