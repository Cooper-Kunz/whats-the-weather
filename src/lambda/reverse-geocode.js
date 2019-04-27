require("dotenv").config({
  path: `.env.production`,
})

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
      console.log("error:", error)
    } else {
      let bodyData = JSON.parse(body)
      displayNameRes = bodyData.display_name
      cityRes = bodyData.address.city
      if (cityRes === undefined) {
        /* 
          If the user isn't in a city, 
          they may be in a "village" 
          e.g. I was in Positano, Italy when I wrote this :) 
        */
        cityRes = bodyData.address.village
      }
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
