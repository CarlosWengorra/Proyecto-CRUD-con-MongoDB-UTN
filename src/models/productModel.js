import mongoose from "mongoose";

const statusEnum = ["AVAILABLE", "NOT AVAILABLE", "DISCONTINUED"];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    minLength: 3,
    unique: true,
    lowercase: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price field is required"],
    min: [0, "Price field has to be a number"],
    get: function (value) {
      return value * 1.21;
    },
  },

  description: String,
  quantity: Number,
  status: {
    type: String,
    validate: {
      validator: function (v) {
        return statusEnum.includes(v);
      },
      message: (props) => `${props.value} is not a valid state`,
    },
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  destacado: Boolean,
});

productSchema.set("toJSON", { getters: true, setters: true });
export default mongoose.model("product", productSchema);
