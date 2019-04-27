import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weather: null,
      lat: null,
      long: null,
      city: null,
    }
  }

  componentDidMount() {
    this.fetchUserLocation()
  }

  fetchUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      this.setState({
        lat: latitude,
        long: longitude,
      })
      this.convertCoordinatesToCity()
    })
  }

  convertCoordinatesToCity() {
    fetch(
      "/.netlify/functions/reverse-geocode?lat=" +
        this.state.lat +
        "&long=" +
        this.state.long
    )
      .then(response => response.json())
      .then(json => {
        this.setState({ city: json.city })
        this.fetchWeatherInCity()
      })
  }

  fetchWeatherInCity() {
    fetch("/.netlify/functions/weather-data?location=" + this.state.city)
      .then(response => response.json())
      .then(json => {
        this.setState({
          weather: json.msg,
        })
      })
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Home"
          keywords={[
            `Cooper Kunz`,
            `example application`,
            `local weather data`,
            'serverless',
            'lambda', 
            'GatsbyJS'
          ]}
        />
        <p>Your latitude: {this.state.lat}</p>
        <p>Your longitude: {this.state.long}</p>
        <p>Gives us your city: {this.state.city}</p>
        <p>Where it is currently: {this.state.weather}</p>
      </Layout>
    )
  }
}

export default IndexPage