const uuid = require("uuid");
const {validationResult} = require('express-validator')

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "Famous sky scapper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/it/thumb/6/62/Mario_Rossi_%28direttore_d%27orchestra%29.jpg/1024px-Mario_Rossi_%28direttore_d%27orchestra%29.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire state building",
    description: "Famous sky scapper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/it/thumb/6/62/Mario_Rossi_%28direttore_d%27orchestra%29.jpg/1024px-Mario_Rossi_%28direttore_d%27orchestra%29.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: "u2",
  },
];

const getPlacesById = (req, res, next) => {
  const placeId = req.params.pid;
  const findPlaces = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!findPlaces || findPlaces.length === 0) {
    // // return res.status(404).json({ message: "Id not found!" });
    throw new HttpError("Could not find a place for the place Id", 404);
  }
  res.json({ findPlaces }); //Otherwise known as{place} => {place: place}
};

const getPlaceByUserById = (req, res, next) => {
  const userId = req.params.uid;
  const findUserPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  if (!findUserPlaces) {
    // return res.status(404).json({ message: "id not found!" });
    return next(new HttpError("Could not find a user for the user id", 404));
  }
  res.json({ findUserPlaces });
};

const createPlace = (req, res, next) => {
const errors = validationResult(req)
if (!errors.isEmpty()) {
  throw new HttpError('Invalid inputs passed, please check you data', 422)
}
  
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid.v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace }); //201 successfully created on the server
};

const updatePlace = (req, res, next) => {

  const errors = validationResult(req)
if (!errors.isEmpty()) {
  throw new HttpError('Invalid inputs passed, please check you data', 422)
}
  const pid = req.params.pid;
  const { title, description } = req.body;

  const updatePlace = {...DUMMY_PLACES.find(place=>place.id ===pid)};
  const placeIndex = DUMMY_PLACES.findIndex(place=> place.id === pid);
  updatePlace.title = title
  updatePlace.description = description

  DUMMY_PLACES[placeIndex] = updatePlace;
  res.status(200).json({place: updatePlace})

};

const deletePlace = (req, res, next) => {
  const pid = req.params.pid;
  if (!DUMMY_PLACES.filter((place) => place.id !== pid)) {
    throw new HttpError('Coulnt not find place for that ID')
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== pid);
  res.status(200).json({message:'Place Deleted'})
};
exports.getPlacesById = getPlacesById;
exports.getPlaceByUserById = getPlaceByUserById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
