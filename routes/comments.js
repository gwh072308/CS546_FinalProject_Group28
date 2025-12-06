// comments.js - comments routes placeholder

// routes/comments.js
// API routes for comment CRUD operations

import express from 'express';
import { ObjectId } from 'mongodb';
import * as commentsData from '../data/comments.js';
import { checkString } from '../helpers.js';

const router = express.Router();

const validateObjectId = (id, varName = 'ID') => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error(`${varName} must be a non-empty string`);
  }
  if (!ObjectId.isValid(id.trim())) {
    throw new Error(`${varName} is not a valid ObjectId`);
  }
  return id.trim();
};

// Get all comments for a specific arrest
router.route('/arrest/:id').get(async (req, res) => {
  try {
    const arrestId = validateObjectId(req.params.id, 'Arrest ID');
    const comments = await commentsData.getCommentsByArrestId(arrestId);
    return res.json({ comments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Create a new comment
router.route('/').post(async (req, res) => {
  try {
    let { arrestId, userId, content } = req.body;

    if (!arrestId || !userId || !content) {
      return res
        .status(400)
        .json({ error: 'arrestId, userId, and content are all required.' });
    }

    arrestId = validateObjectId(arrestId, 'Arrest ID');
    userId = validateObjectId(userId, 'User ID');
    content = checkString ? checkString(content, 'Comment content') : content.trim();

    const newComment = await commentsData.createComment(arrestId, userId, content);
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Update an existing comment (only owner can edit)
router.route('/:id').put(async (req, res) => {
  try {
    const commentId = validateObjectId(req.params.id, 'Comment ID');
    let { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'userId and content are required.' });
    }

    userId = validateObjectId(userId, 'User ID');
    content = checkString ? checkString(content, 'Comment content') : content.trim();

    const updatedComment = await commentsData.updateComment(commentId, userId, content);
    return res.json(updatedComment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete a comment (only owner can delete)
router.route('/:id').delete(async (req, res) => {
  try {
    const commentId = validateObjectId(req.params.id, 'Comment ID');
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required to delete comment.' });
    }

    const deleted = await commentsData.removeComment(commentId, userId);
    return res.json({ deleted: true, comment: deleted });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
