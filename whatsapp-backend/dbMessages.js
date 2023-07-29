import mongoose from "mongoose";

const whatsappSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: {
    type: String,
    default: new Date().toLocaleString(),
  },
  received: Boolean,
});

export default mongoose.model("messageContent", whatsappSchema);
