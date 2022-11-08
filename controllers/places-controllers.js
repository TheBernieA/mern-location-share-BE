const uuid = require("uuid");
const { validationResult } = require("express-validator");

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const findPlace = await prisma.place.findFirst({
    where: { id : placeId }
  })
  if(findPlace === null){
    throw new HttpError("Could not find a place for the place Id", 404);
  }
  res.json({ findPlace }); //Otherwise known as{place} => {place: place}
};

const getPlaceByUserById = async (req, res, next) => {
  const userId = parseInt(req.params.uid);

  const findUserPlaces = await prisma.place.findMany({
    where: {
      creatorId: userId
    }
  })
  if (findUserPlaces === null) {
    return next(new HttpError("Could not find a user for the user id", 404));
  }
  res.json({ findUserPlaces });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passed, please check you data", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  
  const dataPlace = {
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creatorId: parseInt(creator),
  };
  const createdPlace = await prisma.place.create({
    data: dataPlace
  })
  res.status(201).json({ place: createdPlace }); //201 successfully created on the server
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check you data", 422);
  }
  const pid = parseInt(req.params.pid);
  const { title, description } = req.body;

  const placeToUpd = await prisma.place.findFirst({
    where: { id : pid }
  })
  if (placeToUpd === null) {
    return next(new HttpError("Could not find a place for this id", 404));
  }

  const updatePlace = await prisma.place.update({
    where: { id: pid },
    data: { 
      title: title,
      description: description
    },
  })
  res.status(200).json({ place: updatePlace });
};

const deletePlace = async (req, res, next) => {
  const pid = parseInt(req.params.pid);
  const placeToDelete = await prisma.place.findFirst({
    where: { id : pid }
  })
  if (placeToDelete === null) {
    return next(new HttpError("Could not find a place for this id", 404));
  }
  const deletePlace = await prisma.place.delete({
    where: { id: pid }
  })
  res.status(200).json({ message: "Place Deleted" });
};
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserById = getPlaceByUserById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
