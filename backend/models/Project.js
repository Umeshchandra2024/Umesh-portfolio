import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter project title'],
    },
    description: {
      type: String,
      required: [true, 'Please enter project description'],
    },
    techStack: [String],
    githubUrl: String,
    liveUrl: String,
    image: {
      public_id: String,
      url: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;

