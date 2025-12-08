// comments.js - comments data layer placeholder

import dbConnection from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

const collectionName = 'comments';

const exportedMethods = {
  // Create a new comment linked to specific arrest record and user
  async addComment(
    userId,
    arrestId, 
    text
  ) {
    // Validate required parameters
    if (!userId || !arrestId || !text) {
      throw new Error('all parameters must be provided');
    }

    // Ensure comment text is valid non-empty string
    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('comment text must be a non-empty string');
    }

    // Validate MongoDB ObjectId format
    if (!ObjectId.isValid(userId)) {
      throw new Error('invalid user id');
    }
    if (!ObjectId.isValid(arrestId)) {
      throw new Error('invalid arrest id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    // Construct new comment document with timestamps
    const newComment = {
      userId: ObjectId(userId),
      arrestId: ObjectId(arrestId),
      text: text.trim(),
      createdAt: new Date(),  // Track when comment was created
      updatedAt: new Date()   // Track last update time
    };

    const insertInfo = await commentsCollection.insertOne(newComment);
    
    // Verify successful insertion
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error('could not add comment');
    }

    // Return complete comment data by fetching newly created document
    const createdComment = await this.getCommentById(insertInfo.insertedId.toString());
    return createdComment;
  },

  // Retrieve single comment by ID with full document details
  async getCommentById(id) {
    if (!id) {
      throw new Error('id must be provided');
    }

    if (!ObjectId.isValid(id)) {
      throw new Error('invalid comment id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    const comment = await commentsCollection.findOne({ 
      _id: ObjectId(id) 
    });

    if (!comment) {
      throw new Error('comment not found');
    }

    // Convert ObjectId to strings for client-side consumption
    comment._id = comment._id.toString();
    comment.userId = comment.userId.toString();
    comment.arrestId = comment.arrestId.toString();
    
    return comment;
  },

  // Get all comments for a specific arrest record, sorted by newest first
  async getCommentsByArrestId(arrestId) {
    if (!arrestId) {
      throw new Error('arrest id must be provided');
    }

    if (!ObjectId.isValid(arrestId)) {
      throw new Error('invalid arrest id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    // Fetch comments sorted by creation date (newest first)
    const comments = await commentsCollection
      .find({ arrestId: ObjectId(arrestId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Format all IDs as strings for consistent API response
    const formattedComments = comments.map(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
      comment.arrestId = comment.arrestId.toString();
      return comment;
    });

    return formattedComments;
  },

  // Retrieve all comments made by a specific user
  async getCommentsByUserId(userId) {
    if (!userId) {
      throw new Error('user id must be provided');
    }

    if (!ObjectId.isValid(userId)) {
      throw new Error('invalid user id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    const comments = await commentsCollection
      .find({ userId: ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedComments = comments.map(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
      comment.arrestId = comment.arrestId.toString();
      return comment;
    });

    return formattedComments;
  },

  // Update existing comment text - users can only update their own comments
  async updateComment(
    commentId,
    userId,
    text
  ) {
    if (!commentId || !userId || !text) {
      throw new Error('all parameters must be provided');
    }

    if (typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('comment text must be a non-empty string');
    }

    if (!ObjectId.isValid(commentId)) {
      throw new Error('invalid comment id');
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error('invalid user id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    // Update only if user owns the comment (security check)
    const updateInfo = await commentsCollection.updateOne(
      { 
        _id: ObjectId(commentId), 
        userId: ObjectId(userId)  // Ensures user can only update their own comments
      },
      { 
        $set: { 
          text: text.trim(),
          updatedAt: new Date()  // Track when comment was last modified
        } 
      }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error('could not update comment');
    }

    const updatedComment = await this.getCommentById(commentId);
    return updatedComment;
  },

  // Delete comment - users can only delete their own comments
  async deleteComment(
    commentId,
    userId
  ) {
    if (!commentId || !userId) {
      throw new Error('all parameters must be provided');
    }

    if (!ObjectId.isValid(commentId)) {
      throw new Error('invalid comment id');
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error('invalid user id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    // Delete only if user owns the comment
    const deletionInfo = await commentsCollection.deleteOne({
      _id: ObjectId(commentId),
      userId: ObjectId(userId)
    });

    if (deletionInfo.deletedCount === 0) {
      throw new Error('could not delete comment');
    }

    return {
      deleted: true
    };
  },

  // Administrative function: get all comments in the system
  async getAllComments() {
    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    const comments = await commentsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedComments = comments.map(comment => {
      comment._id = comment._id.toString();
      comment.userId = comment.userId.toString();
      comment.arrestId = comment.arrestId.toString();
      return comment;
    });

    return formattedComments;
  },

  // Cleanup function: remove all comments for a specific arrest record
  async deleteCommentsByArrestId(arrestId) {
    if (!arrestId) {
      throw new Error('arrest id must be provided');
    }

    if (!ObjectId.isValid(arrestId)) {
      throw new Error('invalid arrest id');
    }

    const db = await dbConnection();
    const commentsCollection = db.collection(collectionName);

    const deletionInfo = await commentsCollection.deleteMany({
      arrestId: ObjectId(arrestId)
    });

    return { 
      deletedCount: deletionInfo.deletedCount,
      deleted: true
    };
  }
};

export default exportedMethods;