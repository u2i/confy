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
        expectedDates.forEach(expected =>
          expect(days.some(day => day.isSame(expected))).to.be.true()
        );
      });
    });

    describe('#nextWeek', () => {
      const originalDate = moment([2016, 7, 3]);
      const date = originalDate.clone();
      const expectedDate = moment([2016, 7, 10]);

      const nextWeek = DateHelper.nextWeek(date);

      it('returns a date in the following week', () => {
        expect(nextWeek.isSame(expectedDate)).to.be.true();
      });

      it('does not modify the original date', () => {
        expect(date.isSame(originalDate)).to.be.true();
      });
    });

    describe('#previousWeek', () => {
      const originalDate = moment([2016, 7, 10]);
      const date = originalDate.clone();
      const expectedDate = moment([2016, 7, 3]);

      const previousWeek = DateHelper.previousWeek(date);

      it('returns a date in the previous week', () => {
        expect(previousWeek.isSame(expectedDate)).to.be.true();
      });

      it('does not modify the original date', () => {
        expect(date.isSame(originalDate)).to.be.true();
      });
    });

    describe('#dateParam', () => {
      it('returns a date formatted as query param', () => {
        const date = moment([2016, 7, 10]);
        const expectedString = '2016-08-10';

        expect(DateHelper.dateParam(date)).to.equal(expectedString);
      });
    });

    describe('#isToday', () => {
      context('today given', () => {
        it('returns true', () => {
          expect(DateHelper.isToday(moment())).to.be.true();
        });
      });

      context('other day given', () => {
        it('returns false', () => {
          expect(DateHelper.isToday(moment().add(1, 'days'))).to.be.false();
        });
      });
    });

    describe('#minutesFromMidnight', () => {
      it('returns difference from midnight in minutes', () => {
        expect(DateHelper.minutesFromMidnight(moment().startOf('day').add(1, 'hour'))).to.equal(60);
        expect(DateHelper.minutesFromMidnight(moment().startOf('day').add(39, 'minutes'))).to.equal(39);
        expect(DateHelper.minutesFromMidnight(moment().startOf('day').add(3, 'hour'))).to.equal(180);
      });
    });
  });
});
