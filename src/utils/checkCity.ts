import { Request, Response, NextFunction } from "express";
import { catchAsync } from "./catchAsync";
import { PlaceDocument } from "../models/place.model";
import config from "config";
import { UserDocument } from "../models/user.model";

const checkCity = catchAsync(
  async (
    req: Request<{}, {}, PlaceDocument>,
    res: Response,
    next: NextFunction
  ) => {
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${req.body.name}&max=1`;
    const data = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.get<string>("CITY_API_TOKEN")}`,
      },
    });
    if (data.status !== 200) {
      return next(new Error("City is not found"));
    }
    const result = await data.json();
    console.log(result);
    if (result.meta.count === 0) {
      return next(new Error("City is not found"));
    }
    req.body.location = {
      type: "Point",
      coordinates: [
        result.data[0].geoCode.longitude as number,
        result.data[0].geoCode.latitude as number,
      ],
      address: result.data[0].address,
      iatCode: result.data[0].iataCode,
    };

    next();
  }
);

export default checkCity;
