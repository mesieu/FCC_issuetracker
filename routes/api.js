'use strict';
const { json } = require('express/lib/response');
const mongoose = require('mongoose');
const mongoURI = process.env['MONGO_URI'];
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const MongooseQueryParser =
  require('mongoose-query-parser').MongooseQueryParser;
const parser = new MongooseQueryParser();

const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: Date,
  updated_on: Date,
  created_by: { type: String, required: true },
  assigned_to: String,
  open: { type: Boolean, default: true },
  status_text: String,
});

const projectSchema = new mongoose.Schema({
  projectName: String,
  issues: [issueSchema],
});

let Issue = mongoose.model('Issue', issueSchema);
let Project = mongoose.model('Project', projectSchema);

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    // Get issues from a project with or without filters
    .get(function (req, res, next) {
      let project = req.params.project;
      let query = req.query;
      console.log(query);
      // let queryString = require('url').parse(req.url).query;
      // let queryStringParsed = {};
      // if(queryString !== null) {
      //   queryStringParsed = parser.parse(queryString);
      //   console.log(queryStringParsed)
      // }
      Project.findOne(
        {
          projectName: project,
          issues: { '$elemMatch': { issue_text: 'Test_1' } },
        },
        (err, data) => {
          if (err) return next(err);
          res.json(data);
        }
      );
    })

    // Create a new issue
    .post(function (req, res, next) {
      let project = req.params.project;
      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      });
      if (
        newIssue.issue_title === '' ||
        newIssue.issue_text === '' ||
        newIssue.created_by === ''
      ) {
        return res.json({ error: 'required field(s) missing' });
      }
      Project.findOne({ projectName: project }, (err, data) => {
        if (err) return next(err);
        if (!data) {
          Project.create({ projectName: project }, (err, data) => {
            if (err) return next(err);
            data.issues.push(newIssue);
            data.save((err, data) => {
              if (err) return next(err);
              res.json(newIssue);
            });
          });
        } else {
          data.issues.push(newIssue);
          data.save((err, data) => {
            if (err) return next(err);
            res.json(newIssue);
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
