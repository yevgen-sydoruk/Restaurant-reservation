/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
let moment = require("moment");

let weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

async function create(req, res, next) {
    // console.log(req.body.data);
    const newReservation = await service.create(req.body.data);
    res.status(201).json({
        data: newReservation[0],
    });
}

// async function list(req, res, next) {
//     // console.log("reserv controller", req.query);
//     const data = await service.list(req.query);

//     console.log(res.body);
//     console.log(req.query);
//     res.json({
//         data,
//     });
// }

async function list(req, res, next) {
    const query = req.query.date;
    // console.log(query);
    const data = await service.list(query);
    res.json({ data });
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
    let validation1 = /^([0-9]{3})[-. ]?([0-9]{4})$/im;
    let validation2 =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    // /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!mobileNumber) {
        next({
            status: 400,
            message: "mobile_number property is missing.",
        });
    } else if (
        mobileNumber.match(validation1) ||
        mobileNumber.match(validation2)
    ) {
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
            message: `reservation_date must be today or a future date and the restaurant is closed on Tuesday.`,
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
            message: `reservation_time must be after 9:30am and before 10:30pm.`,
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
    const convertedToday = moment().format().split("T")[0].replace(/\D/g, "");
    const convertedReservationDate = reservationDate.replace(/\D/g, ""); //regexed date from request
    const reservationDay = moment(reservationDate);
    const getDayOfWeek = weekDays[reservationDay.day() - 1];

    return (
        convertedReservationDate.length === 8 &&
        getDayOfWeek != "Tuesday" &&
        Number(convertedReservationDate) >= Number(convertedToday)
    );
}

function validReservationTime(reservationTime) {
    reservationTime = reservationTime.replace(/\D/g, "");
    let openHours = moment();
    openHours.set({ hour: 10, minute: 30, second: 0 });
    convertedOpenHours = openHours
        .format()
        .split("T")[1]
        .replace(/\D/g, "")
        .substring(0, 4);
    let closeHours = moment();
    closeHours.set({ hour: 21, minute: 30, second: 0 });
    convertedCloseHours = closeHours
        .format()
        .split("T")[1]
        .replace(/\D/g, "")
        .substring(0, 4);
    return (
        reservationTime.length === 4 &&
        Number(reservationTime) > Number(convertedOpenHours) &&
        Number(convertedCloseHours) > Number(reservationTime)
    );
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
