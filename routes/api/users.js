const express = require('express');
const router = express.Router();

const User = require('../../models/User');


/**
 * @route GET /api/user/all
 * @description GET all users
 * @access Public
 */
router.post('/all/:total_users', (req, res) => {
    const errors = {};
    let total_users = parseInt(req.params.total_users);

    // Query Params
    let queryParams = {};

    let ids = [];
    if(req.body.userIds && req.body.userIds != "") {
        ids = req.body.userIds.split(",");
        queryParams._id = { $in: ids };
    }
    if(req.body.startDate && req.body.endDate) {
        queryParams.date = { $gt: req.body.startDate, $lt: req.body.endDate };
    }

    // User query
    let userQuery = User.find(queryParams);

    userQuery
      .skip(0).limit(total_users)
      .select(['name', 'email', 'avatar', 'date'])
      .then(users => {
        if(!users || users.length === 0) {
          errors.noprofile = 'There are no users.';
          return res.status(404).json(errors);
        }
        res.json(users);
      })
      .catch(err => 
        res.status(400).json({ users: 'There are no users.'}) 
      )
  });

 /**
 * @route GET /api/user/search_by_name
 * @description Search users by name
 * @access Public
 */
router.get('/search_by_name/:search_string', (req, res) => {
    const errors = {}

    User.find().where('name').regex(new RegExp(req.params.search_string, 'i'))
        .select(['name', 'email', 'avatar', 'date'])
        .then(users => {
            if(!users) {
                errors.noprofile = 'There are no users.';
                return res.status(404).json(errors);
            }
            res.json(users);
        })
        .catch(err => 
            res.status(400).json({ users: 'There are no users.' })
        )
});
 
module.exports = router;