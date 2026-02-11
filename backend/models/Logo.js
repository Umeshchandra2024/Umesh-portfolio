import mongoose from 'mongoose';

const logoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['skill', 'app'], required: true },
  svg: {
    public_id: { type: String },
    url: { type: String, required: true },
  },
});

export default mongoose.model('Logo', logoSchema);
