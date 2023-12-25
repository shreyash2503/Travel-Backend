import mongoose from "mongoose";
import { createOne } from "../services/handleFactory";
import { Place } from "../models/place.model";

export const createPlace = createOne(Place);
