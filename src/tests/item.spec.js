const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const expect = chai.expect;

const mongoose = require('mongoose');
const { AppError } = require('../lib');
const { ERROR_MESSAGES } = require('../../constants');

const sandbox = sinon.createSandbox();

let itemController = rewire('../controllers/item');

describe('Testing /item endpoint', () => {
  let sampleItemVal;
  let findOneStub;
  const sampleUniqueHash = '1234567891';

  beforeEach(() => {
    sampleItemVal = {
      name: 'sample item',
      price: 10,
      rating: '5',
      hash: sampleUniqueHash,
    };

    findOneStub = sandbox.stub(mongoose.Model, 'findOne').resolves(sampleItemVal);
  });

  afterEach(() => {
    itemController = rewire('../controllers/item');
    sandbox.restore();
  });

  describe('GET /:hash', () => {
    it('should return error when called without hash', async () => {
      itemController
        .readItem()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch((err) => {
          expect(err).to.be.instanceOf(AppError);
          expect(err.message).to.equal(ERROR_MESSAGES.HASH_NOT_PRESENT);
        });
    });

    it('should succeed when called with hash', async () => {
      itemController
        .readItem('someRandomHash')
        .then((item) => {
          expect(item).to.equal(sampleItemVal);
        })
        .catch((err) => {
          throw new Error('⚠️ Unexpected failure!');
        });
    });
  });

  describe('PUT /', () => {
    let getUniqueHashStub, saveStub, result, sampleUpdatedItemVal;
    const sampleUpdatedHash = '9876543219';

    beforeEach(async () => {
      // forcefully restore sandbox to allow re-write of findOneStub
      sandbox.restore();

      // Stub to mock getUniqueHash's Functionality
      getUniqueHashStub = sandbox.stub().returns(sampleUpdatedHash);

      sampleUpdatedItemVal = {
        ...sampleItemVal,
        hash: sampleUpdatedHash,
      };
      // save stub to return updated item
      saveStub = sandbox.stub().returns(sampleUpdatedItemVal);

      // make findOneStub return save() method in addition to sampleItemVal
      findOneStub = sandbox.stub(mongoose.Model, 'findOne').resolves({
        ...sampleItemVal,
        save: saveStub,
      });

      // Use rewire to modify itemController's private method getUniqueHash
      itemController.__set__('getUniqueHash', getUniqueHashStub);
    });

    it('should throw invalid argument error', () => {
      itemController
        .updateItemHash()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch((err) => {
          expect(err).to.be.instanceOf(AppError);
          expect(err.message).to.equal(ERROR_MESSAGES.HASH_NOT_PRESENT);
        });
    });

    it('should update item hash successfully', async () => {
      result = await itemController.updateItemHash(sampleUniqueHash);
      expect(findOneStub).to.have.been.calledWith({
        hash: sampleUniqueHash,
      });
      expect(findOneStub).to.have.been.calledOnce;
      expect(saveStub).to.have.been.calledOnce;
      expect(result).to.equal(sampleUpdatedItemVal);
    });
  });

  describe('POST /', () => {
    let itemModelStub, saveStub, result;

    beforeEach(async () => {
      saveStub = sandbox.stub().returns(sampleItemVal);
      itemModelStub = sandbox.stub().returns({
        save: saveStub,
      });

      itemController.__set__('Item', itemModelStub);
    });

    it('should throw invalid argument error', () => {
      itemController
        .createItem()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch((err) => {
          expect(err).to.be.instanceOf(AppError);
          expect(err.message).to.equal(ERROR_MESSAGES.INVALID_ARGS);
        });
    });

    it('should create item successfully', async () => {
      result = await itemController.createItem(sampleItemVal);
      expect(itemModelStub).to.have.been.calledWithNew;
      expect(itemModelStub).to.have.been.calledWith(sampleItemVal);
      expect(saveStub).to.have.been.called;
      expect(result).to.equal(sampleItemVal);
    });
  });
});
