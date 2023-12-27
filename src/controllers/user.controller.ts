import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import firebase from "../services/firebase";
import "firebase/storage";
import { User } from "../models/user.model";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { CustomRequest } from "../utils/deserializeUser";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadFiles = upload.single("image");

export const resizeImage =
  (size: number) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   console.log("Hello");
      if (!req.file) return next();
      //   console.log(req.file);
      req.file.buffer = await sharp(req.file.buffer)
        .resize(size, size)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      next();
    } catch (err: any) {
      next(err);
    }
  };

const db = getStorage(firebase);
global.XMLHttpRequest = require("xhr2");

export const addImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const image = req.file;
    const timestamp = Date.now();
    console.log(image);
    // console.log(image?.originalname as string);
    const type = image?.originalname.split(".")[1];
    const fileName = `user_${res.locals.user._id}_${timestamp}.${type}`;
    const storage = ref(db, "images/user/" + fileName);
    if (req.file) {
      req.file.filename = fileName;
    }
    console.log(req.file);
    const imageRef = await uploadBytes(storage, req.file?.buffer as Buffer);
    console.log(imageRef);
    const downloadURL = await getDownloadURL(
      ref(db, "images/user/" + fileName)
    );
    // console.log(downloadURL);
    req.body.photo = downloadURL;

    // const snapshot = await imageRef.put(image?.buffer as Buffer);
    // const downloadURL = await snapshot.ref.getDownloadURL();
    // req.body.image = downloadURL;
    next();
  }
);

export const updateUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log(req.body);
    const data = await User.findByIdAndUpdate({ _id: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  }
);
