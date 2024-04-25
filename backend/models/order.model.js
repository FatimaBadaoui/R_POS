import { Schema, model } from "mongoose";

// Sub-schemas for nested objects
const starterSchema = new Schema({
  quantity: { type: Number, required: true },
  dishItem: { type: Schema.Types.ObjectId, ref: "food" },
});

const mainSchema = new Schema({
  quantity: { type: Number, required: true },
  dishItem: { type: Schema.Types.ObjectId, ref: "food" },
});

const sideSchema = new Schema({
  quantity: { type: Number, required: true },
  dishItem: { type: Schema.Types.ObjectId, ref: "food" },
});

const desertSchema = new Schema({
  quantity: { type: Number, required: true },
  dishItem: { type: Schema.Types.ObjectId, ref: "food" },
});

const drinkSchema = new Schema({
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  drinkItem: { type: Schema.Types.ObjectId, ref: "beverage" },
});

// Define the main schema for the order
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  tableNumber: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  drinks: [drinkSchema],
  starter: [starterSchema],
  main: [mainSchema],
  side: [sideSchema],
  dessert: [desertSchema],
  extras: [{ type: Schema.Types.ObjectId, ref: "extra" }],
});

// Create and export the Mongoose model
const Order = model("order", orderSchema);

export default Order;
