const { nanoid } = require('nanoid');

const Item = require('../models/Item');
const { AppError } = require('../lib');
const { HTTP_STATUS_CODES, ERROR_MESSAGES } = require('../../constants');

// Private function
function getUniqueHash(item) {
  if (!item) return null;
  const currentHash = item.hash;
  let newHash = nanoid(10);

  while (newHash === currentHash) {
    newHash = nanoid(10);
  }
  return newHash;
}

module.exports = {
  createItem: async function (itemObj) {
    if (!itemObj || !itemObj.name || !itemObj.rating || !itemObj.price || !itemObj.hash) {
      throw new AppError(ERROR_MESSAGES.INVALID_ARGS, HTTP_STATUS_CODES.BAD_REQUEST);
    }
    const { name, rating, price, hash } = itemObj;

    let item = new Item({ name, rating, price, hash });
    return await item.save();
  },
  updateItemHash: async function (hash) {
    if (!hash) {
      throw new AppError(ERROR_MESSAGES.HASH_NOT_PRESENT, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    let item = await Item.findOne({ hash });
    item.hash = getUniqueHash(item);

    return await item.save();
  },
  readItem: async function (hash) {
    if (!hash) {
      throw new AppError(ERROR_MESSAGES.HASH_NOT_PRESENT, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    return await Item.findOne({ hash });
  },
};
