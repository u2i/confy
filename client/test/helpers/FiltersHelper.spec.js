import { expect } from 'chai';
import { Set } from 'immutable';
import * as FiltersHelper from 'helpers/FiltersHelper';
import * as LocalStorageHelper from 'helpers/LocalStorageHelper';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('FiltersHelper', () => {
  before(() => {
    sinon.stub(LocalStorageHelper, 'setItem');
    proxyquire('../../app/helpers/LocalStorageHelper', LocalStorageHelper);
  });

  after(() => {
    LocalStorageHelper.setItem.restore();
  });

  describe('#loadFilters()', () => {
    afterEach(() => LocalStorageHelper.getItem.restore());

    describe('when there are no saved filters', () => {
      before(() => sinon.stub(LocalStorageHelper, 'getItem').returns(undefined));

      it('returns empty set', () => {
        expect(FiltersHelper.loadFilters()).to.eq(new Set());
      });
    });
    describe('when there are saved filters', () => {
      const filters = [1, 2, 3];
      const filtersStringified = JSON.stringify(filters);
      before(() => sinon.stub(LocalStorageHelper, 'getItem').returns(filtersStringified));

      it('returns Immutable set with parsed values', () => {
        expect(FiltersHelper.loadFilters()).to.eql(new Set(filters));
      });
    });
  });
});
