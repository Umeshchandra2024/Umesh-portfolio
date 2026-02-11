import mongoose from 'mongoose';

const softwareApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter application name'],
    },
    category: {
      type: String,
      default: 'tool',
    },
    logo: {
      public_id: String,
      url: String,
    },
    description: String,
    url: String,
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const SoftwareApplication = mongoose.model('SoftwareApplication', softwareApplicationSchema);

export default SoftwareApplication;

