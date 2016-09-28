import { expect } from 'chai';
import Event from '../factories/Event';
import ConferenceRoom from '../factories/ConferenceRoom';
import { currentAndNextEvents } from 'helpers/EventHelper';
import moment from 'moment';
import proxyquire from 'proxyquire';

describe('AvailabilityHelper', () => {

  const AvailabilityHelper = proxyquire('../../app/helpers/AvailabilityHelper', {
    './DateHelper': {
      durationFromNow: (e) => e
    }
  });

  describe('#buildAvailabilityProps', () => {
    const conferenceRooms = ConferenceRoom.buildList(3);
    const currentEvent = Event.build({
      conference_room: conferenceRooms[0]
    }, {
      start_time: moment().toDate(),
      end_time: moment().add(1, 'hours').toDate()
    });
    const followingEvent = Event.build({
      conference_room: conferenceRooms[1]
    }, {
      start_time: moment().add(1, 'hours').toDate(),
      end_time: moment().add(2, 'hours').toDate()
    });
    const events = [currentEvent, followingEvent];
    const hasPropWithAvailability = (allProps, availability) => allProps.some(props => props.availability === availability);

    const props = AvailabilityHelper.buildAvailabilityProps(conferenceRooms, events);
    it('returns list containing props for all day available conference room', () => {
      expect(props).to.satisfy(props => hasPropWithAvailability(props, AvailabilityHelper.AVAILABILITY.ALL_DAY_AVAILABLE) );
    });

    it('returns list containing props for currently busy conference room', () => {
      expect(props).to.satisfy(props => hasPropWithAvailability(props, AvailabilityHelper.AVAILABILITY.CURRENTLY_BUSY) );
    });

    it('returns list containing props for currently available conference room', () => {
      expect(props).to.satisfy(props => hasPropWithAvailability(props, AvailabilityHelper.AVAILABILITY.CURRENTLY_AVAILABLE) );
    });

    context('given continuous sequence of events currently taking place in conference room', () => {
      const conferenceRoom = ConferenceRoom.build();
      const now = moment();
      const event1 = Event.build({
        conference_room: conferenceRoom
      }, {
        start_time: now.clone().subtract(1, 'hours').toDate(),
        end_time: now.clone().add(1, 'hours').toDate()
      });
      const event2 = Event.build({
        conference_room: conferenceRoom
      }, {
        start_time: now.clone().add(1, 'hours').toDate(),
        end_time: now.clone().add(2, 'hours').toDate()
      });
      const events = [event1, event2];

      const props = AvailabilityHelper.buildAvailabilityProps([conferenceRoom], events);
      it('returns props with duration till the end of the last event', () => {
        expect(props[0].duration.isSame(moment(event2.end.date_time))).to.eq(true);
      });
    });
  });

  describe('#sortByAvailability', () => {
    const allDayAvailable = { availability: AvailabilityHelper.AVAILABILITY.ALL_DAY_AVAILABLE, duration: 0 };
    const currentlyAvailableShort = { availability: AvailabilityHelper.AVAILABILITY.CURRENTLY_AVAILABLE, duration: 1 };
    const currentlyAvailableLong = { availability: AvailabilityHelper.AVAILABILITY.CURRENTLY_AVAILABLE, duration: 2 };
    const currentlyBusyShort = { availability: AvailabilityHelper.AVAILABILITY.CURRENTLY_BUSY, duration: 1 };
    const currentlyBusyLong = { availability: AvailabilityHelper.AVAILABILITY.CURRENTLY_BUSY, duration: 2 };

    const shuffledProps = [
      currentlyBusyLong,
      currentlyAvailableLong,
      allDayAvailable,
      currentlyAvailableShort,
      currentlyBusyShort
    ];

    const sortedProps = [
      allDayAvailable,
      currentlyAvailableLong,
      currentlyAvailableShort,
      currentlyBusyShort,
      currentlyBusyLong
    ];

    it('sorts props by availability and duration', () => {
      AvailabilityHelper.sortByAvailability(shuffledProps);
      expect(shuffledProps).to.eql(sortedProps);
    });
  })
});
