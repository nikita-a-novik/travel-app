# Weather-Journal App Project

## Overview
The purpose of this application is to allow you to store information of your future trips. (**destination** and **date of departure**)

**To run project:** `npm run build` and `npm run start`

It consists of two sections:

1. Input section
2. Saved trips section

### Input section

First input is for the destination.

Second input is for the departure date.

**When clicking on the button, the trip information is:**

1. Captured from the inputs
2. Sent to the server
3. Data about weather is retrieved via interaction with two web services (`GEOData` and `DarkSky`)
4. Image is fetched from `Pixabay`
5. This data is aggregated and stored on the server
5. All the data stored on the server is sent back to the client
6. Refreshes the section with data

### Saved trips section

Saved trips section displays the data stored on the server.

It consists of:

1. Destination (City, Country)
2. Departure date
3. Button that allows to remove the trip
4. Days left until the trip
5. Weather summary, temperature high and low

## Endpoints

- `/trip GET` - Gets array of trip data
- `/trip POST` - Saves trip data to array
- `/trip DELETE` - Removes trip data from array
- `/weather?location={}&date={} GET` - Gets weather information based on a specific location and date
- `/image?location={} GET` - Gets image for a location

## Dependencies

### Server

- `body parser` - allows to access body of a request
- `express` - HTTP server framework
- `node` - javascript execution environment and runtime
- `node-fetch` - fetch API for node

### Client

No dependencies

### Build & Misc

- `webpack` - tool that allows to bundle assets
- `webpack-cli` - cli tool that allows to interact with webpack via command line
- `webpack-dev-server` - tool that allows to run a webpack project in a development mode
- `html-webpack-plugin` - webpack plugin that lets to generate output html files with bundles injected
- `workbox-webpack-plugin` - webpack plugin that allows to add service-workers
- `mini-css-extraction-plugin` - webpack plugin that allows to generate css files instead of injecting them into javascript
- `style-loader` - webpack loader that injects css into DOM
- `sass-loader` - webpack loder that translates sass to css
- `css-loader` - webpack loader that parses CSS
- `jest` - test runner
