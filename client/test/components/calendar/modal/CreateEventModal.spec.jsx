import React from 'react';
import { Modal } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import CreateEventModal from 'components/calendar/modal/CreateEventModal';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import ModalHeader from 'components/calendar/modal/layout/ModalHeader';
import ModalBody from 'components/calendar/modal/layout/ModalBody';
import ModalFooter from 'components/calendar/modal/layout/ModalFooter';
import EventSource from 'sources/EventSource';
import Event from 'test/factories/Event';
import SuccessMessage from 'components/calendar/modal/SuccessMessage';

describe('<CreateEventModal />', () => {
  const props = {
    closeModal: () => {
    },
    refresh: () => {
    },
    showModal: true,
    onError: sinon.spy()
  };

  const wrapper = shallow(<CreateEventModal
    conferenceRooms={[ConferenceRoom.build()]} {...props} />);

  it('renders <Modal />', () => {
    expect(wrapper.find(Modal)).to.exist();
  });

  it('renders <ModalHeader />', () => {
    expect(wrapper.find(ModalHeader)).to.exist();
  });

  it('renders <ModalBody />', () => {
    expect(wrapper.find(ModalBody)).to.exist();
  });

  it('renders <ModalFooter />', () => {
    expect(wrapper.find(ModalFooter)).to.exist();
  });

  describe('creating events', () => {
    const event = Event.build({}, { with_html_link: true });
    const closeSpy = sinon.spy();
    const refreshSpy = sinon.spy();
    const successSpy = sinon.spy();
    const createWrapper = shallow(<CreateEventModal
      closeModal={closeSpy}
      showModal={sinon.spy()}
      conferenceRooms={[ConferenceRoom.build()]}
      refresh={refreshSpy}
      onError={sinon.spy()}
      onSuccess={successSpy} />);

    context('with successful request', () => {
      before(() => {
        sinon.stub(EventSource, 'create').resolves({ data: event });
        createWrapper.setState({
          conferenceRoomId: event.conference_room.id,
          start_time: event.start_time,
          end_time: event.end_time,
          availableRooms: [event.conference_room]
        });
        createWrapper.find(ModalFooter).simulate('save');
      });

      it('invokes onSuccess callback', () => {
        expect(successSpy).to.have.been.calledOnce();
        expect(successSpy).to.have.been.calledWithMatch(SuccessMessage);
      });
    });
  });
});
