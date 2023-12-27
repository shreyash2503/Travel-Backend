import db from "../services/firebase";
import { catchAsync } from "../utils/catchAsync";
require("firebase/storage");
import { Request, Response, NextFunction } from "express";
import multer from "multer";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFiles = upload.single("image");

const storage = db.storage().ref();
global.XMLHttpRequest = require("xhr2");

export const addImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;
    const timestamp = Date.now();
    console.log(image);
    console.log(image?.originalname as string);
    const name = image?.originalname.split(".")[0];
    const type = image?.originalname.split(".")[1];
    const fileName = `${name}_${timestamp}.${type}`;

    const imageRef = storage.child(fileName);
    const snapshot = await imageRef.put(image?.buffer as Buffer);
    const downloadURL = await snapshot.ref.getDownloadURL();
    req.body.image = downloadURL;
    next();
  }
);
