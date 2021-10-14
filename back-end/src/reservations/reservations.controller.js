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

async function list(req, res, next) {
    const date = req.query.date;
    const mobile_number = req.query.mobile_number;
    console.log(date, mobile_number);
    const data = await service.list(date, mobile_number);
    console.log("data", data);
    res.json({ data });
}

async function search(req, res, next) {
    const searchedReservation = await service.search(req.params.reservation_id);
    if (searchedReservation[0]) {
        return res.json({ data: searchedReservation[0] });
    } else {
        next({
            status: 404,
            message: `${req.params.reservation_id} does not exists`,
        });
    }
}

async function edit(req, res, next) {
    const editedReservation = await service.edit(req.body.data);
    res.json({
        data: editedReservation[0],
    });
}

async function hasReservationId(req, res, next) {
    const reservationId = await service.search(req.params.reservation_id);
    if (reservationId.length > 0) {
        return next();
    }
    next({
        status: 404,
        message: `${req.params.reservation_id} reservation_id not found`,
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

function hasValidStatus(req, res, next) {
    const status = req.body.data.status;
    if (status === "booked" || !status) {
        return next();
    }
    next({
        status: 400,
        message: "status cannot be seated or finished",
    });
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

async function updateStatus(req, res, next) {
    const reservationId = req.params.reservation_id;
    const status = req.body.data.status;
    const updatedReservation = await service.updateStatus(
        reservationId,
        status
    );

    res.json({
        data: updatedReservation[0],
    });
}

async function validateStatus(req, res, next) {
    const reservationId = await service.search(req.params.reservation_id);
    // console.log("before", req.body.data.status);
    const status = req.body.data.status;
    if (status != "unknown") {
        if (
            reservationId[0].status === "booked" ||
            reservationId[0].status === "seated"
        ) {
            // console.log("after", req.body.data.status);
            return next();
        }
        next({
            status: 400,
            message: `status ${reservationId[0].status} cannot be updated`,
        });
    }
    next({
        status: 400,
        message: `status ${status} is invalid`,
    });
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
        hasValidStatus,
        asyncErrorBoundary(create),
    ],
    search: [asyncErrorBoundary(search)],
    edit: [
        asyncErrorBoundary(hasReservationId),
        hasData,
        hasFirstName,
        hasLastName,
        hasMobileNumber,
        hasReservationDate,
        hasReservationTime,
        hasPeople,
        hasValidStatus,
        asyncErrorBoundary(edit),
    ],
    update: [
        asyncErrorBoundary(hasReservationId),
        asyncErrorBoundary(validateStatus),
        asyncErrorBoundary(updateStatus),
    ],
};
