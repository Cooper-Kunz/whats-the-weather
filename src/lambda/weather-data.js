require("dotenv").config({
  path: `.env.production`,
})

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
