# Whats the weather here? 

A basic example website that uses [GatsbyJS](https://www.gatsbyjs.org/) with [Netlify Functions](https://www.netlify.com/docs/functions/)

A demo is currently available at [whats-the-local-weather.netlify.com](https://whats-the-local-weather.netlify.com/)

### Description

This is a basic website that uses the web's [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation) to get a user's current location, then uses [AWS Lambda](https://aws.amazon.com/lambda/) via [Netlify Functions](https://www.netlify.com/docs/functions/) to [reverse geocode](https://en.wikipedia.org/wiki/Reverse_geocoding) their coordinates and determine what city the user is in. Then it again uses [AWS Lambda](https://aws.amazon.com/lambda/) via [Netlify Functions](https://www.netlify.com/docs/functions/) to fetch the current weather in the user's city derived from the previous step and displays it to the user.

### Technologies used

- [GatsbyJS](https://www.gatsbyjs.org/)
  - [React](https://reactjs.org/)
- [Netlify](https://www.netlify.com/)
  - [Netlify Functions](https://www.netlify.com/docs/functions/)
    - [AWS Lambda](https://aws.amazon.com/lambda/)

### 3rd Party APIs Used 

- [LocationIQ](https://locationiq.com/) to handle reverse geocoding
- [OpenWeatherMap](https://openweathermap.org/api) to get local weather data

## Installation

You can install the project's dependencies via yarn. After cloning the respository, simply run:

```
yarn
```

## Defining environment variables 

### Step 1
Get free API keys from [LocationIQ](https://locationiq.com/) which does quick reverse geocoding

### Step 2
Get free API keys from a [OpenWeatherMap](https://openweathermap.org/api) to get a location's weather data

### Step 3
Create a `.env.production` file in the root of the repository. 

Copy & paste the `example.env.production` file into this new file, populating with your API keys

```
WEATHER_DATA_API_KEY="your-api-key-here"
REVERSE_GEOCODE_API_KEY="your-api-key-here"
```

## Running the website locally

Now your dependencies and environment are set up, you can run the project locally simply by running: 

```
npm run start
```

## Deploying via Netlify

All you have to do is connect your GitHub repository to [Netlify](https://www.netlify.com/), and add the following deploy command:

```
npm run build
```

And select it to serve from the `public/` folder (if it doesn't automagically)

Next, add your environment variables via Netlify, by going to `Settings > Build & Deploy > Environment`

Here you can match the key-value formatting of our .env.production file, adding the two values in Netlify:

```
WEATHER_DATA_API_KEY="your-api-key-here"
REVERSE_GEOCODE_API_KEY="your-api-key-here"
```

## Contributing
Any improvements or tips are very much welcomed. Feel free to submit a PR or open an issue!

## License
[MIT](/license) which you can learn more about [here](https://tldrlegal.com/license/mit-license)

## Credits and references

[Shawn Wang](https://www.swyx.io/) for the great tutorial - "[Turning the Static Dynamic](https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/)"

[Kyle Matthews](https://twitter.com/kylemathews) the creator of Gatsby for making web development fun again :)

[Netlify](https://www.netlify.com/) for making it so easy to use [AWS Lambda](https://aws.amazon.com/lambda/), and in general being such a great service


## How it works 

### Step 1
In [/src/pages/index.js](/src/pages/index.js) we request for a user's geocordinates through the web's [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation) 

```
navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords
  // use coordinates
})
```

### Step 2 
In [/src/pages/index.js](/src/pages/index.js) we'll do a reverse geocode using [LocationIQ](https://locationiq.com/) to determine what city the user is in

We call a [Netlify Function](https://www.netlify.com/docs/functions/)
```
fetch(
  "/.netlify/functions/reverse-geocode?lat=" +
    this.state.lat +
    "&long=" +
    this.state.long
)
  .then( 
    // use response
  )
```

In [/src/lambda/reverse-geocode.js](/src/lambda/reverse-geocode.js) we'll use a [Netlify Function](https://www.netlify.com/docs/functions/) to seamlessly create an [AWS Lambda](https://aws.amazon.com/lambda/) function that I defined, which looks like the following:
```
export function handler(event, context, callback) {
  let request = require("request")
  let key = process.env.REVERSE_GEOCODE_API_KEY
  let latSearch = event.queryStringParameters.lat
  let longSearch = event.queryStringParameters.long
  let url = `https://us1.locationiq.com/v1/reverse.php?key=${key}&lat=${latSearch}&lon=${longSearch}&format=json`
  var displayNameRes = ""
  var cityRes = ""
  request(url, function(err, response, body) {
    if (err) {
      console.log("error", err)
    } else {
      let bodyData = JSON.parse(body)
      displayNameRes = bodyData.display_name
      cityRes = bodyData.address.city
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        displayName: displayNameRes,
        city: cityRes,
      }),
    })
  })
}
```

### Step 3
Use [OpenWeatherMap](https://openweathermap.org/api) to fetch the weather in the given city from step 2

We'll call another [Netlify Function](https://www.netlify.com/docs/functions/)
```
fetch("/.netlify/functions/weather-data?location=" + this.state.city)
  .then(
    // use response
  )
```

In [/src/lambda/weather-data.js](/src/lambda/weather-data.js) Netlify handles as another [AWS Lambda](https://aws.amazon.com/lambda/) function I defined, which looks like:
```
export function handler(event, context, callback) {
  let request = require("request")
  let key = process.env.WEATHER_DATA_API_KEY
  let city = event.queryStringParameters.location
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`
  var res = ""
  request(url, function(err, response, body) {
    if (err) {
      console.log("error:", error)
    } else {
      let weatherData = JSON.parse(body)
      res = `it's ${weatherData.main.temp} degrees fahrenheit`
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        msg: res,
      }),
    })
  })
}
```