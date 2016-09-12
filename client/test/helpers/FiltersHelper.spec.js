import { expect } from 'chai';
import { Map } from 'immutable';
import * as FiltersHelper from 'helpers/FiltersHelper';
import * as LocalStorageHelper from 'helpers/LocalStorageHelper';
import sinon from 'sinon';

describe('FiltersHelper', () => {
  before(() => {
    sinon.stub(LocalStorageHelper, 'setItem');
  });

  after(() => {
    LocalStorageHelper.setItem.restore();
  });

  describe('#loadFilters()', () => {
    afterEach(() => LocalStorageHelper.getItem.restore());

    describe('when there are no saved filters', () => {
      before(() => sinon.stub(LocalStorageHelper, 'getItem').returns(undefined));

      it('returns empty map', () => {
        expect(FiltersHelper.loadFilters()).to.eq(new Map());
      });
    });
    describe('when there are saved filters', () => {
      const filters = new Map({ 1: true, 2: true, 3: false });
      const filtersStringified = JSON.stringify(filters);
      before(() => sinon.stub(LocalStorageHelper, 'getItem').returns(filtersStringified));

      it('returns Immutable set with parsed values', () => {
        expect(FiltersHelper.loadFilters()).to.eql(new Map(filters));
      });
    });
  });
});
