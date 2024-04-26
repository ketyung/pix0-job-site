// next.config.js
const withTM = require('next-transpile-modules')(['pix0-core-ui']); // pass the modules you would like to see transpiled

module.exports = withTM({

    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: '/**',
          },
        ],
    },

    serverRuntimeConfig: {
      // Will only be available on the server side
        IpCountryUrl:process.env.IP_TO_COUNTRY_URL,
        RestApiKey:process.env.REST_API_KEY,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
        RestApiKey:process.env.REST_API_KEY,
    },
  

});