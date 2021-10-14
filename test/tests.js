//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.SQL_LOGGING = false;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/app');
let should = chai.should();

const { seed } = require('../scripts/seedDb')

chai.use(chaiHttp);

describe('Contracts', function () {
  beforeEach(async function () {
    //Before each test we empty the database
    await seed();
    return
  });
  
  describe('/GET contracts no profile_id', function () {
      it('it should return 401 Unauthorized status code', function (done) {
        chai.request(server)
            .get('/contracts')
            .end((err, res) => {
                  res.should.have.status(401);
              done();
            });
      });
  });
  describe('/GET contracts', function () {
      it('it should GET all the user contracts', function (done) {
        chai.request(server)
            .get('/contracts')
            .set('profile_id', '1')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.have.property('data');
                  res.body.data.should.be.a('array');
                  res.body.data.length.should.not.be.eql(0);
              done();
            });
      });
  });
  describe('/GET /contracts/1', function () {
    it('it should return 401 Unauthorized status code', function (done) {
      chai.request(server)
        .get('/contracts/1')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/GET /contracts/1', function () {
    it('it should return a contract object', function (done) {
      chai.request(server)
        .get('/contracts/1')
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.not.be.a('array');
          res.body.data.id.should.be.gt(0);
          done();
        });
    });
  });
  describe('/GET /contracts/3', function () {
    it('it should return 404 Not found status code', function (done) {
      chai.request(server)
        .get('/contracts/3')
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});



describe('Admin', function () {
  beforeEach(async function () {
    //Before each test we empty the database
    await seed();
    return
  });
  
  describe('/GET /admin/best-profession', function () {
    it('it should return "Programmer"', function (done) {
      chai.request(server)
        .get('/admin/best-profession')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('string');
          res.body.data.should.be.eql('Programmer');
          done();
        });
    });
  });
  describe('/GET /admin/best-profession?start=2020-08-01&end=2020-08-14', function () {
    it('it should return "Musician"', function (done) {
    chai.request(server)
      .get('/admin/best-profession?start=2020-08-01&end=2020-08-14')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.be.a('string');
        res.body.data.should.be.eql('Musician');
        done();
      });
    });
  });

  describe('/GET /admin/best-clients', function () {
    it('it should return 2 elements', function (done) {
      chai.request(server)
        .get('/admin/best-clients')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(2);
          res.body.data[0].id.should.be.eql(4);
          res.body.data[0].fullName.should.be.eql('Ash Kethcum');
          res.body.data[0].paid.should.be.eql(2020);
          done();
        });
    });
  });
  describe('/GET /admin/best-clients?start=2020-08-01&end=2020-08-14&limit=1', function () {
    it('it should return 1 element', function (done) {
    chai.request(server)
      .get('/admin/best-clients?start=2020-08-01&end=2020-08-14')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.eql(1);
        res.body.data[0].id.should.be.eql(1);
        res.body.data[0].fullName.should.be.eql('Harry Potter');
        res.body.data[0].paid.should.be.eql(21);
        done();
      });
    });
  });
});

describe('Jobs', function () {
  beforeEach(async function () {
    //Before each test we empty the database
    await seed();
    return
  });
  
  describe('/GET /jobs', function () {
    it('it should return 401 Unauthorized status code', function (done) {
      chai.request(server)
        .get('/jobs')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/GET /jobs', function () {
    it('it should return 6 jobs', function (done) {
      chai.request(server)
        .get('/jobs')
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(6);
          done();
        });
    });
  });
  describe('/GET /jobs/unpaid', function () {
    it('it should return 1 job', function (done) {
      chai.request(server)
        .get('/jobs/unpaid')
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(1);
          done();
        });
    });
  });
});

describe('Balances', function () {
  beforeEach(async function () {
    //Before each test we empty the database
    await seed();
    return
  });
  
  describe('/POST /balances/deposit/1', function () {
    it('it should return 401 Unathorized status code', function (done) {
      chai.request(server)
        .post('/balances/deposit/1')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/POST /balances/deposit/1', function () {
    it('it should return 422 Unprocessable entity code', function (done) {
      chai.request(server)
        .post('/balances/deposit/1')
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('data');
          res.body.data.should.be.a('string');
          res.body.data.should.be.eql('No amount specified.');
          done();
        });
    });
  });
  describe('/POST /balances/deposit/1', function () {
    it('it should return 422 Unprocessable entity status code', function (done) {
      chai.request(server)
        .post('/balances/deposit/1')
        .send({ amount: 100 })
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('data');
          res.body.data.should.be.a('string');
          res.body.data.should.be.eql('You can only deposit at most 25% of the unpaid jobs prices sum at the deposit moment.');
          done();
        });
    });
  });
  describe('/POST /balances/deposit/1', function () {
    it('it should return old and new balances', function (done) {
      chai.request(server)
        .post('/balances/deposit/1')
        .send({ amount: 50 })
        .set('profile_id', '1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.oldBalance.should.be.eql(1150);
          res.body.data.newBalance.should.be.eql(1200);
          done();
        });
    });
  });
});