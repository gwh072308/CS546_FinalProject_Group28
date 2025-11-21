// utils.js - shared helper functions placeholder

import { ObjectId } from 'mongodb';

export const checkId = (id) => {
  if (!id) throw "Error: id is required";
  if (typeof id !== "string") throw "Error: id must be a string";
  id = id.trim();
  if (id.length === 0) throw "Error: id cannot be an empty string";
  if (!ObjectId.isValid(id)) throw "Error: invalid ObjectId";
  return id;
};

export const checkString = (str, varName = "input") => {
  if (!str) throw `Error: ${varName} is required`;
  if (typeof str !== "string") throw `Error: ${varName} must be a string`;
  str = str.trim();
  if (str.length === 0) throw `Error: ${varName} cannot be empty`;
  return str;
};

export const checkNumber = (num, varName = "number") => {
  if (num === undefined || num === null)
    throw `Error: ${varName} is required`;

  if (typeof num !== "number")
    throw `Error: ${varName} must be a number`;

  if (isNaN(num))
    throw `Error: ${varName} must be valid numeric`;

  return num;
};

export const checkPositiveInt = (num, varName = "number") => {
  num = checkNumber(num, varName);
  if (!Number.isInteger(num) || num <= 0)
    throw `Error: ${varName} must be a positive integer`;
  return num;
};

export const checkDate = (dateStr, varName = "date") => {
  dateStr = checkString(dateStr, varName);
  const d = new Date(dateStr);
  if (isNaN(d.getTime()))
    throw `Error: ${varName} is not a valid date`;
  return d;
};

