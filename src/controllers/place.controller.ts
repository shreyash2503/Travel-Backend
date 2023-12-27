import {
  createOne,
  getAll,
  getOne,
  updateOne,
} from "../services/handleFactory";
import { Place } from "../models/place.model";

export const createPlace = createOne(Place);

export const getPlace = getOne(Place, { path: "reviews" });

export const getPlaces = getAll(Place);

export const updatePlace = updateOne(Place);
