import { expect } from 'chai';
import { weekDays } from 'helpers/DateHelper';

describe('DateHelper', () => {
  describe('#weekDays', () => {
    const date = new Date(2016, 7, 3);
    const expectedDates = [new Date(2016, 7, 1), new Date(2016, 7, 2), new Date(2016, 7, 3)];

    const days = weekDays(date, 3);

    expect(days).to.deep.equal(expectedDates);
  });
});
