// comments.js - comments data layer placeholder

const exportedMethods = {
  async addComment(userId, arrestId, text) {
    return { userId, arrestId, text };
  },

  async getCommentsByArrestId(arrestId) {
    return [];
  }
};

export default exportedMethods;
