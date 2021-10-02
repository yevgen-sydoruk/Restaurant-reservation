/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res, next) {
    const NewReservation = await service.create(req.body.data);
    res.status(201).json({
        data: NewReservation[0],
    });
}

async function list(req, res, next) {
    const data = await service.list(req.query);
    res.json({
        data,
    });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: asyncErrorBoundary(create),
};
