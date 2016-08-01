import React from 'react';
import { Checkbox } from 'react-bootstrap';
import { mount, shallow } from 'enzyme';
import Filter from '../../app/components/calendar/filters/Filter';
import chai from 'chai';
import sinon from 'sinon';

const expect = chai.expect;

describe('<Filter />', () => {
  const color = '#000000';
  const title = 'sample_title';
  const id = 1;
  const capacity = 1;
  const conferenceRoom = {
    id,
    title,
    color,
    capacity
  };
  const defaultProps = {
    conferenceRoom,
    onEnabled: () => {
    },
    onDisabled: () => {
    },
    enabled: false
  };
  const defaultWrapper = shallow(<Filter {...defaultProps} />);

  it('renders <Checbkox />', () => {
    expect(defaultWrapper.find(Checkbox)).to.have.length(1);
  });

  it('sets .filter-box backgroundColor', () => {
    expect(defaultWrapper.find('.filter-box').props().style.backgroundColor).to.eq(color);
  });

  it('puts conference room title inside Checkbox component', () => {
    expect(defaultWrapper.find(Checkbox).children().text()).to.eq(title);
  });

  it("triggers appropriate handler based on 'enabled' prop", () => {
    const onEnabled = sinon.spy();
    const onDisabled = sinon.spy();
    const props = {
      conferenceRoom,
      onEnabled,
      onDisabled,
      enabled: false
    };
    const wrapper = mount(<Filter {...props} />);

    wrapper.find('input').simulate('change');
    expect(onDisabled).to.have.property('callCount', 1);
    expect(onDisabled.calledWith(id)).to.eq(true);

    wrapper.setProps({ enabled: true });

    wrapper.find('input').simulate('change');
    expect(onEnabled).to.have.property('callCount', 1);
    expect(onEnabled.calledWith(id)).to.eq(true);
  });
});
