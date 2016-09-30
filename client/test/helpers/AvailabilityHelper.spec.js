import { expect } from 'chai';
import moment from 'moment';
import proxyquire from 'proxyquire';
import Event from '../factories/Event';
import ConferenceRoom from '../factories/ConferenceRoom';

describe('AvailabilityHelper', () => {
  const AvailabilityHelper = proxyquire('../../app/helpers/AvailabilityHelper', {
    './DateHelper': {
      durationFromNow: e => moment(e, 'minutes')
    }
  });

  const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AvailabilityHelper.AVAILABILITY;

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
    const defaultEvents = [currentEvent, followingEvent];
    const hasPropWithAvailability = (allProps, availability) => allProps.some(props => props.availability === availability);

    const defaultProps = AvailabilityHelper.buildAvailabilityProps(conferenceRooms, defaultEvents);
    it('returns list containing defaultProps for all day available conference room', () => {
      expect(defaultProps).to.satisfy(props => hasPropWithAvailability(props, ALL_DAY_AVAILABLE));
    });

    it('returns list containing defaultProps for currently busy conference room', () => {
      expect(defaultProps).to.satisfy(props => hasPropWithAvailability(props, CURRENTLY_BUSY));
    });

    it('returns list containing defaultProps for currently available conference room', () => {
      expect(defaultProps).to.satisfy(props => hasPropWithAvailability(props, CURRENTLY_AVAILABLE));
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

  describe('#sortAvailabilityProps', () => {
    const duration0 = moment.duration(0, 'minutes');
    const duration1 = moment.duration(1, 'minutes');
    const duration2 = moment.duration(2, 'minutes');
    const conferenceRoomA = ConferenceRoom.build({ title: 'a' });
    const conferenceRoomB = ConferenceRoom.build({ title: 'b' });
    const allDayAvailable = { availability: ALL_DAY_AVAILABLE, duration: duration0 };
    const currentlyAvailableShort1 = { conferenceRoom: conferenceRoomA, availability: CURRENTLY_AVAILABLE, duration: duration1 };
    const currentlyAvailableShort2 = { conferenceRoom: conferenceRoomB, availability: CURRENTLY_AVAILABLE, duration: duration1 };
    const currentlyAvailableLong = { availability: CURRENTLY_AVAILABLE, duration: duration2 };
    const currentlyBusyShort = { availability: CURRENTLY_BUSY, duration: duration1 };
    const currentlyBusyLong = { availability: CURRENTLY_BUSY, duration: duration2 };

    const shuffledProps = [
      currentlyBusyLong,
      currentlyAvailableLong,
      currentlyAvailableShort1,
      allDayAvailable,
      currentlyAvailableShort2,
      currentlyBusyShort
    ];

    const sortedProps = [
      allDayAvailable,
      currentlyAvailableLong,
      currentlyAvailableShort1,
      currentlyAvailableShort2,
      currentlyBusyShort,
      currentlyBusyLong
    ];

    it('sorts props by availability, duration and title', () => {
      AvailabilityHelper.sortAvailabilityProps(shuffledProps);
      expect(shuffledProps).to.eql(sortedProps);
    });
  });
});
