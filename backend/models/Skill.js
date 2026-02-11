import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter skill name'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'advanced',
    },
    category: {
      type: String,
      default: 'general',
    },
    logo: {
      public_id: String,
      url: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;

