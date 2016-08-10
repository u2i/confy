import moment from 'moment';
import { expect } from 'chai';
import * as DateHelper from 'helpers/DateHelper';

describe('DateHelper', () => {
  context('given a date', () => {
    describe('#weekDays', () => {
      it('returns a list of days in that week', () => {
        const date = moment([2016, 7, 3]);
        const expectedDates = [moment([2016, 7, 1]), moment([2016, 7, 2]), moment([2016, 7, 3])];

        const days = DateHelper.weekDays(date, 3);

        expect(days).to.have.length(3);
        expectedDates.forEach(date =>
          expect(days.some(day => day.isSame(date))).to.be.true()
        );
      });
    });

    describe('#nextWeek', () => {
      it('returns a date in the following week', () => {
        const date = moment([2016, 7, 3]);
        const expectedDate = moment([2016, 7, 10]);

        expect(DateHelper.nextWeek(date).isSame(expectedDate)).to.be.true();
      });
    });

    describe('#previousWeek', () => {
      it('returns a date in the previous week', () => {
        const date = moment([2016, 7, 10]);
        const expectedDate = moment([2016, 7, 3]);

        expect(DateHelper.previousWeek(date).isSame(expectedDate)).to.be.true();
      });
    });

    describe('#dateParam', () => {
      it('returns a date formatted as query param', () => {
        const date = moment([2016, 7, 10]);
        const expectedString = '2016-08-10';

        expect(DateHelper.dateParam(date)).to.equal(expectedString);
      })
    })
  });
});
