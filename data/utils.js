// utils.js - basic validation helpers

import { ObjectId } from "mongodb";

// validate MongoDB ObjectId
export const checkId = (id, varName = "id") => {
  if (!id) throw `Error: ${varName} is required`;
  if (typeof id !== "string") throw `Error: ${varName} must be a string`;
  id = id.trim();
  if (id.length === 0) throw `Error: ${varName} cannot be empty`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} is not a valid ObjectId`;
  return id;
};

// validate non-empty string
export const checkString = (str, varName = "input") => {
  if (str === undefined || str === null)
    throw `Error: ${varName} is required`;
  if (typeof str !== "string")
    throw `Error: ${varName} must be a string`;
  str = str.trim();
  if (str.length === 0)
    throw `Error: ${varName} cannot be empty`;
  return str;
};

// validate number
export const checkNumber = (num, varName = "number") => {
  if (num === undefined || num === null)
    throw `Error: ${varName} is required`;
  if (typeof num !== "number" || isNaN(num))
    throw `Error: ${varName} must be a valid number`;
  return num;
};

// validate positive integer
export const checkPositiveInt = (num, varName = "number") => {
  num = checkNumber(num, varName);
  if (!Number.isInteger(num) || num <= 0)
    throw `Error: ${varName} must be a positive integer`;
  return num;
};

// validate date string in YYYY-MM-DD format and ensure it is a real date
export const checkDate = (dateStr, varName = "date") => {
  dateStr = checkString(dateStr, varName);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr))
    throw `Error: ${varName} must be in YYYY-MM-DD format`;

  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  // ensure JS did not auto-correct invalid dates
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== day
  ) {
    throw `Error: ${varName} is not a valid date`;
  }

  return dateStr;
};
