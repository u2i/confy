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

describe('<CreateEventModal />', () => {
  const props = {
    closeModal: () => {},
    refresh: () => {},
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
});