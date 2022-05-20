const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  test('Create an issue with every field: POST request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test_title',
        issue_text: 'test_text',
        created_by: 'John',
        assigned_to: 'John',
        status_text: 'test_status',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, 'Response status should be 200');
        assert.equal(res.body.issue_title, 'test_title');
        assert.equal(res.body.issue_text, 'test_text');
        // assert.equal(res.body.created_on, new Date().toISOString());
        // assert.equal(res.body.updated_on, new Date().toISOString());
        assert.equal(res.body.created_by, 'John');
        assert.equal(res.body.assigned_to, 'John');
        assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, 'test_status');
        done();
      });
  });
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test_title',
        issue_text: 'test_text',
        created_by: 'John',
        assigned_to: '',
        status_text: '',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, 'Response status should be 200');
        assert.equal(res.body.issue_title, 'test_title');
        assert.equal(res.body.issue_text, 'test_text');
        // assert.equal(res.body.created_on, new Date());
        // assert.equal(res.body.updated_on, new Date());
        assert.equal(res.body.created_by, 'John');
        assert.equal(res.body.assigned_to, '');
        // assert.equal(res.body.open, true);
        assert.equal(res.body.status_text, '');
        done();
      });
  });
  test('Create an issue with missing required fields: POST request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test_title',
        issue_text: 'test_text',
        created_by: '',
        assigned_to: '',
        status_text: '',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200, 'Response status should be 200');
        assert.equal(res.body, { error: 'required field(s) missing' });
        done();
      });
  });
  test('View issues on a project: GET request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200, 'Response status should be 200');
        assert.isArray(res.body, 'Response is an array');

        done();
      });
  });
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest?open=true')
      .end((err, res) => {
        assert.equal(res.status, 200, 'Response status should be 200');
        assert.deepEqual(res.body, { open: true });
        done();
      });
  });
  // test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {});
  // test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {});
  // test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {});
  // test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {});
  // test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {});
  // test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {});
  // test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {});
  // test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {});
  // test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {});
});
