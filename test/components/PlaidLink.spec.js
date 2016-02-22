'use strict';
/* globals describe, it */

const assert = require('assert');
const sinon = require('sinon');

const React = require('react');
const shallow = require('enzyme').shallow;

const channel = require('../../../src/channel');
const util = require('../../../src/util');

const ExitButton = require('../../../src/views/partials/ExitButton');
const InstitutionOption = require('../../../src/views/partials/InstitutionOption');
const InstitutionSearch = require('../../../src/views/partials/InstitutionSearch');
const InstitutionSelect = require('../../../src/views/InstitutionSelect');

const eq = assert.strictEqual;


describe('InstitutionSelect', () => {

  it('should load all basic components on creation', () => {
    var props = {
      product: 'connect',
      apiUrl: 'https://api-testing.plaid.com',
      isMobile: false,
      longtail: false
    };
    var wrapper = shallow(<InstitutionSelect {...props} />);
    eq(wrapper.find(InstitutionOption).length, 8,
     'InstitutionSelect loads the default 8 banks');
    eq(wrapper.find(ExitButton).length, 1,
     'ExitButton loads successfully');
  });

  it('should load the search option when longtail is provided', () => {
    var props = {
      product: 'connect',
      apiUrl: 'https://api-testing.plaid.com',
      isMobile: false,
      longtail: true
    };
    var wrapper = shallow(<InstitutionSelect {...props} />);
    wrapper.setState({currentPage: 1});
    eq((wrapper.find(InstitutionSearch).length), 1,
     'InstitutionSearch loads when longtail is enabled');
  });

  it('should propagate clicking from an InstitutionOption', () => {
    var props = {
      product: 'connect',
      apiUrl: 'https://api-testing.plaid.com',
      isMobile: false,
      longtail: false
    };
    //TODO: Refactor Broadcast changes away from UI components
    sinon.stub(channel, 'broadcast');
    var wrapper = shallow(<InstitutionSelect {...props} />);
    wrapper.find(InstitutionOption).first().simulate('click');
    eq((channel.broadcast.calledWith('select-institution')), true,
      'InstitutionOption called InstitutionSelect.select');
    channel.broadcast.restore();
  });

  it('should change the state when footer is clicked', () => {
    var props = {
      product: 'connect',
      apiUrl: 'https://api-testing.plaid.com',
      isMobile: false,
      longtail: false
    };
    //TODO: Refactor UI changes from InstitutionSelect
    sinon.stub(util, 'removeClassName');
    var wrapper = shallow(<InstitutionSelect {...props} />);
    wrapper.find('.footer').simulate('click');
    eq((wrapper.state('currentPage')), 1,
      'Footer click switches the currentPage to 1');
    wrapper.find('.footer').simulate('click');
    eq((wrapper.state('currentPage')), 0,
      'Footer second click switches the currentPage to 0');
  });

  it('should trigger a broadcast when clicked on the exit button', () => {
    var props = {
      product: 'connect',
      apiUrl: 'https://api-testing.plaid.com',
      isMobile: false,
      longtail: false
    };
    //TODO: Refactor Broadcast changes away from UI components
    sinon.stub(channel, 'broadcast');
    var wrapper = shallow(<InstitutionSelect {...props} />);
    wrapper.find(ExitButton).simulate('click');
    eq((channel.broadcast.calledWith('exit')), true,
      'Clicking on exit button successfully broadcasts exit signal');
    channel.broadcast.restore();
  });

});
