require('dotenv').config();

var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

var omdbkey = keys.Omdb.ApiKey;
var spotifyKey = keys.spotify;
var twitterKey = keys.twitter;

// var commands = process.argv[2];
action(process.argv[2], process.argv[3]);

function action(commands, input) {
  switch (commands) {
    case 'my-tweets':
      tweets();
      break;

    case 'spotify-this-song':
      spotify();
      break;

    case 'movie-this':
      movieThis();
      break;

    case 'do-what-it-says':
      doWhat();
      break;
  }
}

function tweets() {
  var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  client.get(
    'statuses/user_timeline',
    { screen_name: 'JohnDoe57866453', count: 20 },
    function(error, tweets, response) {
      if (error) throw error;
      for (var i = 0; i < tweets.length; i++) {
        console.log('Time Tweet was created: ' + tweets[i].created_at);
        console.log('Tweet: ' + tweets[i].text);
      }
    }
  );
}

function spotify() {
  // If no song is provided then your program will default to "The Sign" by Ace of Base.

  var Spotify = require('node-spotify-api');

  var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  });

  var nodeArgs = process.argv;
  var songName = '';

  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 2 && i < nodeArgs.length) {
      songName = songName + '+' + nodeArgs[i];
    } else {
      songName += nodeArgs[i];
    }
  }

  spotify
    .search({ type: 'track', query: songName, limit: 1 })
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

function movieThis() {
  // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  var request = require('request');

  var nodeArgs = process.argv;

  var movieName = '';

  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 2 && i < nodeArgs.length) {
      movieName = movieName + '+' + nodeArgs[i];
    } else {
      movieName += nodeArgs[i];
    }
  }

  console.log(movieName);

  var queryUrl =
    'http://www.omdbapi.com/?t=' +
    movieName +
    '&y=&plot=short&apikey=' +
    omdbkey +
    '';

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log('Title of Movie: ' + JSON.parse(body).Title);
      console.log('Release Year: ' + JSON.parse(body).Year);
      console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
      // console.log(
      //   'Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value
      // );
      console.log('Country Where Movie Produced: ' + JSON.parse(body).Country);
      console.log('Language of Movie: ' + JSON.parse(body).Language);
      console.log('Plot of Movie: ' + JSON.parse(body).Plot);
      console.log('Actors: ' + JSON.parse(body).Actors);
    }
  });
}

function doWhat() {
  // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt
  var fs = require('fs');

  fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    var output = data.split(',');
    var commands = output[0];
    var input = output[1];
    console.log(commands);
    console.log(input);
    // action(commands, input);
  });
}
