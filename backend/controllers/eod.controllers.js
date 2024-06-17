import asyncHandler from "../config/asyncHandler.js";
import Receipt, { OldReceipt } from "../models/receipt.model.js";
import EodModel from "../models/eod.model.js";
import Order from "../models/order.model.js";
import generateEodVariables from "../utils/generateEodVariables.js";

/* 
@desc   Calculate and generate End of Day report
@route  POST /eod
@access Private (Only accessible to admin or manager)
*/
const generateEodReport = asyncHandler(async (req, res) => {
  // Retrieve all receipts
  const receipts = await Receipt.find({}).populate("orderId");

  const eodVariables = generateEodVariables(receipts);

  // Create EoD report document
  const eodReport = await EodModel.create(eodVariables);

  // Save old receipts in the oldreceipts collection and Reset all of Receipt/Orders
  await OldReceipt.insertMany(receipts);
  await Receipt.deleteMany({});
  await Order.deleteMany({});

  res
    .status(200)
    .json({ message: "End of Day report generated", data: eodReport });
});

/* 
@desc   View all End of Day reports
@route  GET /eod
@access Private (Only accessible to admin or manager)
*/
const viewEodReport = asyncHandler(async (req, res) => {
  const eodReports = await EodModel.find();
  if (!eodReports) {
    res.status(404);
    throw new Error("No EoD reports found");
  }
  res.status(200).json({ message: "All EoD reports", data: eodReports });
});

/* 
@desc   View End of Day report for a specific date
@route  GET /eod/:date
@access Private (Only accessible to admin or manager)
*/
const viewEodReportByDate = asyncHandler(async (req, res) => {
  const { day, month, year } = req.query;
  const date = `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;

  // Construct start and end timestamps for the entire day
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

  // Query EoD report within the date range
  const eodReport = await EodModel.findOne({
    timestamp: { $gte: startDate, $lte: endDate },
  });

  if (!eodReport) {
    res.status(404);
    throw new Error("No EoD report found for the given date");
  }

  res.status(200).json({ message: "EoD report", data: eodReport });
});

const getReceiptsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error("Please provide both startDate and endDate");
  }

  const receipts = await Receipt.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  }).populate({
    path: "orderId",
    populate: {
      path: "userId drinks.drinkItem starter.dishItem main.dishItem side.dishItem dessert.dishItem",
    },
  });

  if (!receipts || receipts.length === 0) {
    res.status(404);
    throw new Error("No receipts found in the given date range");
  }

  res.status(200).json({
    message: "Receipts within the date range",
    numberOfReceipts: receipts.length,
    data: receipts,
  });
});
export { generateEodReport, viewEodReport, viewEodReportByDate, getReceiptsByDateRange };
