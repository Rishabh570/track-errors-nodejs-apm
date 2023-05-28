const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;

var Item = require('../models/Item');

describe('Testing Item model', () => {
  let sampleItemVal;

  beforeEach(() => {
    sampleItemVal = {
      name: 'sample item',
      price: 10,
      rating: '5',
      hash: 'hashGreaterThan10Chars',
    };
  });

  it('it should throw an error due to missing fields', (done) => {
    let item = new Item();
    item.validate().catch((err) => {
      expect(err.errors.name).to.exist;
      expect(err.errors.rating).to.exist;
      expect(err.errors.price).to.exist;
      expect(err.errors.hash).to.exist;

      done();
    });
  });

  it('it should throw an error due to incorrect hash length', (done) => {
    let item = new Item(sampleItemVal);
    item.validate().catch((err) => {
      expect(err).to.be.instanceOf(ValidationError);
      // this is expected, do not pass err to done()
      done();
    });
  });

  it('it should create the item successfully with correct parameters', (done) => {
    try {
      let item = new Item({
        ...sampleItemVal,
        hash: '1234567891',
      });
      item.validate();

      expect(item.hash).to.equal('1234567891');
      done();
    } catch (err) {
      const unexpectedFailureError = new Error('⚠️ Unexpected failure!');
      done(unexpectedFailureError);
    }
  });
});
