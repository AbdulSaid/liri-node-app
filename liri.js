require('dotenv').config();

var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var omdbkey = keys.Omdb.ApiKey;
var commandline = process.argv;
var action = commandline[2];

var output = '';
for (var i = 3; i < commandline.length; i++) {
  if (i > 2 && i < commandline.length) {
    output += commandline[i] + '+';
  } else {
    output += commandline[i];
  }
}

switch (action) {
  case 'my-tweets':
    tweets(output);
    break;

  case 'spotify-this-song':
    spotify(output);
    break;

  case 'movie-this':
    movieThis(output);
    break;

  case 'do-what-it-says':
    doWhat();
    break;
}

function tweets(output) {
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var output = process.argv[3];
  var params = { screen_name: output, count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets) {
    if (error) console.log('this is the error', error);
    for (var i = 0; i < tweets.length; i++) {
      console.log('Time Tweet was created: ' + tweets[i].created_at);
      console.log('Tweet: ' + tweets[i].text);
    }
  });
}

function spotify(output) {
  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  console.log('with the for: ' + output.slice(0, -1));
  if (!output) {
    output = 'The Sign';
  }

  spotify
    .search({ type: 'track', query: output, limit: 1 })
    .then(function(response) {
      console.log('Artists: ' + response.tracks.items[0].artists[0].name);
      console.log('Name of Song: ' + response.tracks.items[0].name);
      console.log(
        'Song on Spotify: ' +
          response.tracks.items[0].album.external_urls.spotify
      );

      console.log('Album: ' + response.tracks.items[0].album.name);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function movieThis(output) {
  var queryUrl =
    'http://www.omdbapi.com/?t=' +
    output +
    '&y=&plot=short&apikey=' +
    omdbkey +
    '';

  request(queryUrl, function(error, response, body) {
    if (!output) {
      output = 'Mr. Nobody';
    }
    if (!error && response.statusCode === 200) {
      console.log('Title of Movie: ' + JSON.parse(body).Title);
      console.log('Release Year: ' + JSON.parse(body).Year);
      console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
      // some movies don't have rotten Tomates Rating
      console.log(
        'Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value
      );
      console.log('Country Where Movie Produced: ' + JSON.parse(body).Country);
      console.log('Language of Movie: ' + JSON.parse(body).Language);
      console.log('Plot of Movie: ' + JSON.parse(body).Plot);
      console.log('Actors: ' + JSON.parse(body).Actors);
    }
  });
}

function doWhat() {
  var fs = require('fs');

  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var output = data.split(',');
    console.log('output:', output);

    if (output[0] === 'spotify-this-song') {
      var songcheck = output[1].slice(1, -1);
      console.log('songCheck:', songcheck);
      spotify(songcheck);
    } else if (output[0] === 'my-tweets') {
      var tweetname = output[1].slice(1, -1);
      twitter(tweetname);
    } else if (output[0] === 'movie-this') {
      var movie_name = output[1].slice(1, -1);
      console.log('THIS', movie_name);
      movieThis(movie_name);
    }
  });
}
