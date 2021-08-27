//we create the short urls here in url.js

//bringing everything in
const express = require('express');
const router = express.Router();
const validUrl = require('valid-url'); //package checks if URL is valid
const shortid = require('shortid');
const config = require('config');

const Url = require('../models/Url');

//post request to endpoint /api/url/shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;  // getting url from the body(sent by user)
  const baseUrl = config.get('baseUrl');  //pulling base url from default.json file

  //check base url to see if its valid
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // creating a url code(the part added to the base url)
  const urlCode = shortid.generate();

  // check if the long url is valid
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) {
        res.json(url);  // if the url already exists in the database, we can directly return
      } else {
        const shortUrl = baseUrl + '/' + urlCode;  // if the url doesn't exist then we construct it

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date()
        });

        await url.save();  // save it to the database

        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});

module.exports = router;