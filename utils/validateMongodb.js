const mongoose = require('mongoose');

const validateMongodbId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new Error('User id must be  valid or not found');
  }
};

module.exports = validateMongodbId;
