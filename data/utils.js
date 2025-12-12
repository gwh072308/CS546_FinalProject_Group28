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
//validate password
export const validatePassword = (password) => {
  if (typeof password !== "string") throw "password must be a string";
  if (password.length === 0) throw "password must be supplied";

  if (password.length < 8)
    throw "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password))
    throw "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    throw "Password must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password))
    throw "Password must contain at least one special character";
  return password;
}
// Validate username
export const validateUsername = (username) => {
  if (typeof username !== "string") 
    throw "Username must be a string";
  
  username = username.trim();
  
  if (username.length === 0) 
    throw "Username cannot be empty";
  
  if (username.length < 3) 
    throw "Username must be at least 3 characters long";
  
  if (username.length > 20) 
    throw "Username must be at most 20 characters long";
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) 
    throw "Username can only contain letters, numbers, and underscores";
  
  return username.toLowerCase();
};

// Validate email
export const validateEmail = (email) => {
  if (typeof email !== "string") 
    throw "Email must be a string";
  
  email = email.trim();
  
  if (email.length === 0) 
    throw "Email cannot be empty";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) 
    throw "Email must be a valid email address";
  
  return email.toLowerCase();
};
