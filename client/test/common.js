
require('sinon');
require('sinon-as-promised');

import chai from 'chai';

chai.use(require('chai-enzyme')());
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('dirty-chai'));
chai.use(require('chai-moment'));

chai.config.showDiff = true;
chai.config.truncateThreshold = 0;
