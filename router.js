const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

function blogWords() {
  return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod ' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  ' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  ' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  ' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod  ' +
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod. '
}

BlogPosts.create(
  'It is getting rather chilly in here', blogWords(), 'Steve Carrel');
BlogPosts.create(
  'There is a snake in my boot', blogWords(), 'Jack Bower');
BlogPosts.create(
  'Tiny Tim is no friend to the cat', blogWords(), 'Tinier Tim');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'words', 'writer'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
  	req.body.title, req.body.words, req.body.writer);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = [
  	'id', 'title', 'words', 'writer', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    words: req.body.words,
    writer: req.body.writer,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post with id \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;