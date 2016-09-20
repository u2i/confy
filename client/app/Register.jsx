import ReactOnRails from 'react-on-rails';
import CalendarRoot from './components/calendar/ReactRoot';
import ConferenceRoomRoot from './components/conference_room/ReactRoot';
import moment from 'moment';
import './app.scss';

moment.updateLocale('en', { week: { dow: 1 } });

ReactOnRails.register({ CalendarRoot, ConferenceRoomRoot });
