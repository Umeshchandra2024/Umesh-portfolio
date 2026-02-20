import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
  },
  { timestamps: true },
);

// Single document - use findOne
const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
