import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/errorClasses.js';
import doctorService from '../services/doctor.service.js';

const getMe = catchAsync(async (req, res, next) => {
  const data = await doctorService.getByUserID(req.user.id);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  req.params.doctorId = data.id;
  next();
});

// for queue
const getAndSetDoctorIDFromUser = catchAsync(async (req, res, next) => {
  const data = await doctorService.getByUserID(req.user.id);

  if (!data) {
    return next(
      new AppError(
        'You do not have a doctor account corresponding to your user!',
        StatusCodes.NOT_FOUND,
      ),
    );
  }

  req.params.doctorId = data.id;
  next();
});

const getDoctorByID = catchAsync(async (req, res, next) => {
  const data = await doctorService.getByID(req.params.doctorId);

  if (!data) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      data: data,
    },
  });
});

const getAllDoctors = catchAsync(async (req, res, next) => {
  const doctors = await doctorService.getAll();

  if (doctors.length === 0) {
    return next(new AppError(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

export default {
  getMe,
  getAndSetDoctorIDFromUser,
  getDoctorByID,
  getAllDoctors,
};
