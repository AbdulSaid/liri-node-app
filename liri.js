require('dotenv').config();

var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

var omdbkey = keys.Omdb.ApiKey;
var spotifyKey = keys.spotify;
var twitterKey = keys.twitter;

//
var action = process.argv[2];

// var omdbAction = process.argv[2]
// var twitterAction = process.argv[3];
// var spotifyAction = process.argv[4];
// var doWhatAction = process.argv[5];

// var titleMovie = process.argv[3];
// console.log(title);

switch (action) {
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
  //Artist(s)
  // The song's name
  // A preview link of the song from Spotify
  // The album that the song is from
  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  //
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi({
    clientId: 'fcecfc72172e4cd267473117a17cbd4d',
    clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7'
  });
  var spotifySearch = process.argv[3];
  console.log(spotifySearch);

  // Search tracks whose name, album or artist contains 'Love'
  spotifyApi.searchTracks(spotifySearch).then(
    function(data) {
      console.log('Search by "Love"', data.body);
    },
    function(err) {
      console.error(err);
    }
  );
}

function movieThis() {
  // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  var request = require('request');

  // Grab the movieName which will always be the third node argument.
  var movieName = process.argv[3];
  console.log(movieName);

  // Then run a request to the OMDB API with the movie specified
  var queryUrl =
    'http://www.omdbapi.com/?t=' +
    movieName +
    '&y=&plot=short&apikey=' +
    omdbkey +
    '';

  // 'http://www.omdbapi.com/?t=' +
  //     titleMovie +
  //     '&y=&plot=short&apikey=' +
  //     omdbkey +
  //     '',

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      // console.log(body);
      console.log('Title of Movie: ' + JSON.parse(body).Title);
      console.log('Release Year: ' + JSON.parse(body).Year);
      console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
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
  // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt
}

// request(
//   'http://www.omdbapi.com/?t=' +
//     titleMovie +
//     '&y=&plot=short&apikey=' +
//     omdbkey +
//     '',

//   function(error, response, body) {
//     // If the request is successful (i.e. if the response status code is 200)
//     if (!error && response.statusCode === 200) {
//       // Parse the body of the site and recover just the imdbRating
//       // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//       console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
//     }
//   }
