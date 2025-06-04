// models/counterModel.ts
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

export default mongoose.models.Counter || mongoose.model("Counter", counterSchema);
