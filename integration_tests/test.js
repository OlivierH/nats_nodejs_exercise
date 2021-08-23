const chai = require('chai');
const should = chai.should()
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Echo', () => {
  it('should echo the parameter', (done) => {
    chai.request("gateway:3000")
      .get('/echo/abcde')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        res.should.have.status(200);
        res.text.should.be.eql("abcde");
        done();
      });
  });
});

describe('Math', () => {
  describe('Substract', () => {
    it('should execute a substraction', (done) => {
      chai.request("gateway:3000")
        .get('/math/substract/4/2')
        .end((err, res) => {
          chai.expect(err).to.be.null;
          res.should.have.status(200);
          res.text.should.be.eql("2");
          done();
        });
    });
    it('should throw an error for non-numeric parameters', (done) => {
      chai.request("gateway:3000")
        .get('/math/substract/4/a')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('Substract', () => {
    it('should execute a division', (done) => {
      chai.request("gateway:3000")
        .get('/math/divide/10/2')
        .end((err, res) => {
          chai.expect(err).to.be.null;
          res.should.have.status(200);
          res.text.should.be.eql("5");
          done();
        });
    });
    it('should execute a division where zero is the numerator', (done) => {
      chai.request("gateway:3000")
        .get('/math/divide/0/2')
        .end((err, res) => {
          chai.expect(err).to.be.null;
          res.should.have.status(200);
          res.text.should.be.eql("0");
          done();
        });
    });
    it('should throw an error for non-numeric parameters', (done) => {
      chai.request("gateway:3000")
        .get('/math/divide/a/4')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('should throw an error for division by zero', (done) => {
      chai.request("gateway:3000")
        .get('/math/divide/4/0')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
