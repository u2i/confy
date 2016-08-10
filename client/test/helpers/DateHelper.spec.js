import { expect } from 'chai';
import { weekDays, nextWeek, previousWeek } from 'helpers/DateHelper';

describe('DateHelper', () => {
  context('given a date', () => {
    describe('#weekDays', () => {
      it('returns a list of days in that week', () => {
        const date = new Date(2016, 7, 3);
        const expectedDates = [new Date(2016, 7, 1), new Date(2016, 7, 2), new Date(2016, 7, 3)];

        const days = weekDays(date, 3);

        expect(days).to.deep.equal(expectedDates);
      });
    });

    describe('#nextWeek', () => {
      it('returns a date in the following week', () => {
        const date = new Date(2016, 7, 3);
        const expectedDate = new Date(2016, 7, 10);

        expect(nextWeek(date)).to.be.sameMoment(expectedDate);
      });
    });

    describe('#previousWeek', () => {
      it('returns a date in the previous week', () => {
        const date = new Date(2016, 7, 10);
        const expectedDate = new Date(2016, 7, 3);

        expect(previousWeek(date)).to.be.sameMoment(expectedDate);
      });
    });
  });
});
