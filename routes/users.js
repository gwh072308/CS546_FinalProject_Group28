// users.js - user authentication and profile routes

import { Router } from "express";
import usersData from "../data/users.js";
import { requireAuth, requireGuest } from "../middleware/auth.js";
import { checkString, checkId } from "../data/utils.js";

const router = Router();

// GET /users/login - Display login page
router.get("/login", requireGuest, (req, res) => {
  res.render("login", { title: "Login" });
});

// POST /users/login - Handle user login
router.post("/login", requireGuest, async (req, res) => {
  try {
    let { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).render("login", { 
        error: "Username and password are required",
        title: "Login"
      });
    }

    username = checkString(username, "username");
    
    // Validate password without trimming (security: preserve user intent)
    if (typeof password !== "string" || password.length === 0) {
      throw "Invalid password";
    }

    // Verify user credentials
    const user = await usersData.verifyUser(username, password);

    // Set session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    return res.redirect("/");
  } catch (e) {
    return res.status(401).render("login", { 
      error: e,
      title: "Login"
    });
  }
});

// GET /users/register - Display registration page
router.get("/register", requireGuest, (req, res) => {
  res.render("register", { title: "Register" });
});

// POST /users/register - Handle user registration
router.post("/register", requireGuest, async (req, res) => {
  try {
    let { username, password, passwordConfirm, email } = req.body;

    // Validate input
    if (!username || !password || !passwordConfirm || !email) {
      return res.status(400).render("register", { 
        error: "All fields are required",
        title: "Register"
      });
    }

    // Validate password match (before validation/trimming)
    if (password !== passwordConfirm) {
      return res.status(400).render("register", { 
        error: "Passwords do not match",
        title: "Register"
      });
    }

    // Validate username and email using checkString
    username = checkString(username, "username");
    email = checkString(email, "email");

    // Validate password without trimming (security: preserve user intent)
    if (typeof password !== "string" || password.length === 0) {
      throw "Invalid password";
    }

    // Create user
    const newUser = await usersData.createUser({
      username: username,
      password: password,
      email: email
    });

    // Automatically log in the new user
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };

    return res.redirect("/");
  } catch (e) {
    return res.status(400).render("register", { 
      error: e,
      title: "Register"
    });
  }
});

// GET /users/profile/:id - Display user profile
router.get("/profile/:id", async (req, res) => {
  try {
    const userId = checkId(req.params.id, "User ID");
    const user = await usersData.getUserById(userId);

    return res.render("userProfile", { 
      user,
      title: "User Profile"
    });
  } catch (e) {
    return res.status(404).render("error", { 
      error: "User not found",
      statusCode: 404,
      title: "Error"
    });
  }
});

// GET /users/logout - Logout user
router.get("/logout", requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/?error=logout_failed");
    }
    return res.redirect("/");
  });
});

export default router;
