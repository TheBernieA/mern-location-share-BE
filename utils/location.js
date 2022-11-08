const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyBgjyvQN5pR7on13T7hcZ1RkbHapQnAupc";

const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("Could not find location for the address", 422);
    throw error;
  }
  console.log(data)
  const coordinates = data.results[0].geometry.location;
  return coordinates
};

//get rid of special character or white space (encodeURIComponent)


module.exports = getCoordsForAddress