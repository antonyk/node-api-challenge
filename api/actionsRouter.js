// const projects = require('../data/helpers/projectModel');
const actions = require('../data/helpers/actionModel');
const router = require('express').Router();
const messages = require('../middleware').messageDictionary;

module.exports = router;

// Actions
// Field	Data Type	Metadata
// id	number	no need to provide it when creating posts, the database will automatically generate it.
// project_id	number	required, must be the id of an existing project.
// description	string	up to 128 characters long, required.
// notes	string	no size limit, required. Used to record additional notes or requirements to complete the action.
// completed	boolean	used to indicate if the action has been completed, not required


router.post('/', validateData, (req, res, next) => {
  // there should be some type of "formatting" prior to sending object to db!!!
  actions.insert(req.body)
  .then(result => {
    // check if there's an object first
    res.status(200).json(result);
  })
  .catch(err => {
    console.log({err});
    next(messages.dbCreateError)
  })
})

router.get('/', (req, res, next) => {
  actions.get()
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    console.log({err})
    next(messages.dbRetrieveError)
  })
})

router.get('/:id', validateId, (req, res, next) => {
  actions.get(req.params.id)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    console.log({err});
    next(messages.dbRetrieveError);
  })
})

router.put('/:id', validateId, validateData, (req, res, next) => {
  actions.update(req.params.id, req.body)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    next(messages.dbUpdateError);
  })
})

router.delete('/:id', validateId, (req, res, next) => {
  actions.remove(req.params.id)
  .then(result => {
    res.status(200).json({message: `deleted Action with ID: ${req.params.id}`})
  })
  .catch(err => {
    next(messages.dbDeleteError);
  })
})

function validateData(req, res, next) {
  console.log(req.body)
  if (!req.body || !req.body.project_id || !req.body.description || !req.body.notes) {
    next(messages.incompleteData);
  } else {
    next();
  }
}

function validateId(req, res, next) {
  if (!req.params || !req.params.id || !isIntAsString(req.params.id)) {
    next(messages.notAcceptableValue)
  } else {
    next();
  }
}

function isIntAsString(value) {
  return /^\d+$/.test(value);
}
