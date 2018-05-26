'use strict';

module.exports = (app, controllerObject) => {
    // Add contactsBook Routes
    require('./contacts-book')(app, controllerObject);

    // Add Common Routes
    require('./common')(app, controllerObject);
};
