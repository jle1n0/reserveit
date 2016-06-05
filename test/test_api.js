"use strict";

let should = require('chai').should()
let expect = require('chai').expect;
let supertest = require('supertest');

let server = require('../src/resvit.js');

let api = supertest('http://localhost:8080');

let resources = {
  'res0': {
    'validTime': {
      'start': Date('T10:00'),
      'end': Date('T22:00')
    },
    'validDateRange': {
      'start': Date('2016-06-01'),
      'end': Date('2016-08-01')
    },
    'concurrentReservations': 1,
    'description': 'Tenniskenttä',
    'locat': 'Viherlaaksonranta 10'
  },
  'res1': {
    'validTime': {
      'start': Date('T12:00'),
      'end': Date('T13:00')
    },
    'description': 'luuta',
    'locat': 'talon takana'
  }
};

describe('api /resvit/v1 with no resources.', function() {

  before('server', function() {
    server.listen(8080, {});
  });

  it('should return a 200 response', function(done) {
    api.get('/resvit/v1')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should return pointer to resources', function(done) {
    api.get('/resvit/v1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('services')
          .equal('resources');
        done();
      });
  });

  it('should return the resources', function(done) {
    api.get('/resvit/v1/resources')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('services')
          .length(0);
        done();
      });
  });

}); 

describe('api with set resources', function() {

  before('server', function() {
    server.listen(8080, resources);
  });

  it('should return the resources', function(done) {
    api.get('/resvit/v1/resources')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('services')
          .length(2)
          .eql(['res0', 'res1']);
        done();
      });
  });

});

describe('resource information', function() {

  before('server', function() {
    server.listen(8080, resources);
  });

  it('get res0', function(done) {
    api.get('/resvit/v1/res0')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('description')
          .equal('Tenniskenttä');
        expect(res.body).to.have.property('locat')
          .equal('Viherlaaksonranta 10');
        done();
      });
  });

  it('get res1', function(done) {
    api.get('/resvit/v1/res1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('description')
          .equal('luuta');
        expect(res.body).to.have.property('locat')
          .equal('talon takana');
        done();
      });
  });
});
