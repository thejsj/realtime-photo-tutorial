/*jshint node:true */
'use strict';
var _ = require('lodash');
var r = require('./db');

var connectedUsers = {};

var socketHandler = function (io, socket) {

  // On user connect
  socket.on('User:connect', function () {
    r
      .table('photos')
      .run(r.conn)
      .then(function (cursor) {
       return cursor.toArray();
      })
      .then(function (photos) {
        // Push all photos through the socket connection
        photos.forEach(function (photo) {
          socket.emit('Photo:update', photo);
        });
      });
  });

  r.getNewConnection()
    .then(function (conn) {
      // Listen to changes in the photos tables
      r
        .table('photos')
        .changes()
        .run(conn)
        .then(function (cursor) {
          cursor.each(function (err, result) {
            // Push images through the socket connection
            if (result.new_val === null) {
              io.emit('Photo:delete', result.old_val.id);
            } else {
              io.emit('Photo:update', result.new_val);
            }
          });
        });
     });
};

module.exports = socketHandler;
