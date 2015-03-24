/*jshint node:true */
'use strict';

var q = require('q');
var r = require('rethinkdb');

r.connections = [];
r.getNewConnection = function () {
  return r.connect({
    'host': 'localhost',
    'port': 28015,
    'db': 'realtime_photo_sharing'
  })
    .then(function (conn) {
      conn.use('realtime_photo_sharing');
      r.connections.push(conn);
      return conn;
    });
};

r.connect({
  'host': 'localhost',
  'port': 28015,
  'db': 'realtime_photo_sharing'
})
  .then(function (conn) {
    r.conn = conn;
    r.connections.push(conn);
    return r.dbCreate('realtime_photo_sharing').run(r.conn)
      .then(function () {})
      .catch(function () {})
      .then(function () {
        r.conn.use('realtime_photo_sharing');
        // Create Tables
        return r.tableList().run(r.conn)
          .then(function (tableList) {
            return q()
              .then(function() {
                if (tableList.indexOf('photos') === -1) {
                  return r.tableCreate('photos').run(r.conn);
                }
              })
              .then(function () {
                if (tableList.indexOf('users') === -1) {
                  return r.tableCreate('users').run(r.conn);
                }
              })
              .then(function () {
                return r.table('users').indexList().run(r.conn)
                  .then(function (indexList) {
                    if (indexList.indexOf('login') === -1) {
                      return r.table('users').indexCreate('login').run(r.conn);
                    }
                  });
              });
          });
      });
  });

module.exports = r;
