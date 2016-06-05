"use strict";

let restify = require('restify');
let _ = require('underscore');

let resources;
let server = restify.createServer({
  name: 'resvit',
  version: '0.0.1'
});

server.get('/resvit/v1', function(req, res, nxt) {
  res.send({'services': 'resources'});
});

server.get('/resvit/v1/resources', function(req, res, nxt) {
  res.send({'services': Object.keys(resources)});
});

server.get('/resvit/v1/:resource', function(req, res, nxt) {
  res.send({
    'description': resources[req.params.resource].description,
    'locat': resources[req.params.resource].locat
  });
});

exports.listen = function(port, injectedResources) {
  resources = injectedResources;
  server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
};

