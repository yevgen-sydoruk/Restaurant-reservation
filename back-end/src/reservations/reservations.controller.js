/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res, next) {
    // console.log(req.body.data);
    const newReservation = await service.create(req.body.data);
    res.status(201).json({
        data: newReservation[0],
    });
}

async function list(req, res, next) {
    // console.log("reserv controller", req.query);
    const data = await service.list(req.query);
    // console.log(data);
    res.json({
        data,
    });
}

function hasData(req, res, next) {
    // console.log("data31231231", req.body);
    // console.log("data", req.body.data);
    const data = req.body.data;
    if (data) {
        return next();
    } else {
        next({
            status: 400,
            message: "Data is missing.",
        });
    }
}

function hasFirstName(req, res, next) {
    // console.log("data31231231", req.body);
    const firstName = req.body.data.first_name;
    // console.log("firstName", firstName);

    if (firstName) {
        return next();
    } else {
        next({
            status: 400,
            message: "first_name property is missing.",
        });
    }
}

function hasLastName(req, res, next) {
    const lastName = req.body.data.last_name;
    // console.log("lastName", lastName);

    if (lastName) {
        return next();
    } else {
        next({
            status: 400,
            message: "last_name property is missing.",
        });
    }
}

function hasMobileNumber(req, res, next) {
    const mobileNumber = req.body.data.mobile_number;
    // console.log("mobileNumber", mobileNumber);
    let validation =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!mobileNumber) {
        next({
            status: 400,
            message: "mobile_number property is missing.",
        });
    } else if (mobileNumber.match(validation)) {
        return next();
    } else {
        next({
            status: 400,
            message: "mobile_number format is incorrect",
        });
    }
}

function hasReservationDate(req, res, next) {
    const reservationDate = req.body.data.reservation_date;
    if (reservationDate) {
        if (validReservationDate(reservationDate)) {
            return next();
        }
        next({
            status: 400,
            message: `reservation_date is not a valid reservation date`,
        });
    }
    return next({
        status: 400,
        message: "data must have reservation_date property",
    });
}

function hasReservationTime(req, res, next) {
    const reservationTime = req.body.data.reservation_time;
    if (reservationTime) {
        if (validReservationTime(reservationTime)) {
            return next();
        }
        next({
            status: 400,
            message: `reservation_time is not a valid reservation time`,
        });
    } else {
        next({
            status: 400,
            message: "reservation_time property is missing.",
        });
    }
}

function hasPeople(req, res, next) {
    const people = req.body.data.people;
    if (people && people > 0 && Number.isInteger(people)) {
        return next();
    } else {
        next({
            status: 400,
            message: "people property is missing.",
        });
    }
}

function validReservationDate(reservationDate) {
    reservationDate = reservationDate.replace(/\D/g, "");
    return reservationDate.length === 8;
}

function validReservationTime(reservationTime) {
    reservationTime = reservationTime.replace(/\D/g, "");
    return reservationTime.length === 4;
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [
        hasData,
        hasFirstName,
        hasLastName,
        hasMobileNumber,
        hasReservationDate,
        hasReservationTime,
        hasPeople,
        asyncErrorBoundary(create),
    ],
};
