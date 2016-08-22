import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import GuestsField from 'components/modal/layout/body/GuestsField';
import Typeahead from 'react-bootstrap-typeahead';
import ContactSource from 'sources/ContactSource';

describe('<GuestsField />', () => {
  const onChangeSpy = sinon.spy();

  before(() => {
    sinon.stub(ContactSource, 'fetch').resolves([]);
  });

  after(() => {
    ContactSource.fetch.restore();
  });

  afterEach(() => {
    ContactSource.fetch.reset();
  });

  let wrapper;

  beforeEach(() => {
    wrapper = mount(<GuestsField onChange={onChangeSpy} addNotification={sinon.spy()} />);
  });

  it('renders guests <Typeahead /> field', () => {
    expect(wrapper.find(Typeahead)).to.exist();
  });

  it('fetches contacts', () => {
    expect(ContactSource.fetch).to.have.been.calledOnce();
  });
});
