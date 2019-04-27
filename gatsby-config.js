var proxy = require("http-proxy-middleware")

require("dotenv").config({
  path: `.env.production`,
})

module.exports = {
  siteMetadata: {
    title: `What's the weather here?`,
    description: `A basic example of checking weather data based on reverse geocoding.`,
    author: `@cooper-kunz`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    //'gatsby-plugin-offline',
  ],
  // netlify middlewear example from: https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/
  // for avoiding CORS while developing using Netlify Lambda Functions
  // read more: https://www.gatsbyjs.org/docs/api-proxy/#advanced-proxying
  developMiddleware: app => {
    app.use(
      "/.netlify/functions/",
      proxy({
        target: "http://localhost:9000",
        pathRewrite: {
          "/.netlify/functions/": "",
        },
      })
    )
  },
}
