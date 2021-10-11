const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// let moment = require("moment");

async function list(req, res, next) {
    // console.log(req.body.data);
    const newTableList = await service.list();
    return res.json({
        data: newTableList,
    });
}

async function create(req, res, next) {
    // console.log(req.body.data);
    const newTable = await service.create(req.body.data);
    return res.status(201).json({
        data: newTable[0],
    });
}

async function update(req, res, next) {
    const data = req.body.data;
    const table = res.locals.table;
    const response = await service.update(data, table);
    const status = res.locals.reservation.status;
    // console.log(status);
    if (status === "booked") {
        await service.updateStatus(response[0], "seated");
    }
    if (status === "seated") {
        next({
            status: 400,
            message: "status cannot be updated from seated",
        });
    }
    return res.json({
        data: response[0],
    });
}

async function remove(req, res, next) {
    const tableId = req.params.table_id;
    const response = await service.remove(tableId);
    await service.updateStatus(res.locals.table, "finished");
    return res.status(200).json({
        data: response[0],
    });
}

function hasData(req, res, next) {
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

function hasTableName(req, res, next) {
    const tableName = req.body.data.table_name;
    // console.log(tableName, tableName.length !== 1);
    if (tableName) {
        if (tableName.length > 1) {
            return next();
        } else {
            next({
                status: 400,
                message: `${tableName} is not a valid table_name`,
            });
        }
    } else {
        next({
            status: 400,
            message: "table_name property is missing",
        });
    }
}

function hasCapacity(req, res, next) {
    const capacity = req.body.data.capacity;
    if (capacity && capacity > 0 && Number.isInteger(capacity)) {
        return next();
    } else {
        next({
            status: 400,
            message: "capacity property is missing.",
        });
    }
}

function hasReservationId(req, res, next) {
    const reservationId = req.body.data.reservation_id;
    if (reservationId) {
        res.locals.reservationId = reservationId;
        return next();
    } else {
        next({
            status: 400,
            message: "reservation_id property is missing",
        });
    }
}
async function hasTableId(req, res, next) {
    const table = await service.find(req.params.table_id);
    if (table) {
        res.locals.table = table;
        return next();
    } else {
        next({
            status: 404,
            message: `${req.params.table_id} table_id property is missing`,
        });
    }
}

async function reservationExists(req, res, next) {
    const reservation = await service.findReservationId(
        res.locals.reservationId
    );
    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    } else {
        next({
            status: 404,
            message: `${res.locals.reservationId} does not exist`,
        });
    }
}
async function hasEnoughtCapacity(req, res, next) {
    const table = await service.find(req.params.table_id);
    if (table) {
        res.locals.table = table;
        if (Number(table.capacity) >= Number(res.locals.reservation.people)) {
            return next();
        } else {
            next({
                status: 400,
                message: `table does not have capacity for reservation`,
            });
        }
    } else {
        next({
            status: 400,
            message: `table does not have sufficient data`,
        });
    }
}
function tableOccupied(req, res, next) {
    if (res.locals.table.reservation_id) {
        next({
            status: 400,
            message: `table is occupied`,
        });
    } else {
        return next();
    }
}

function tableIsNotOccupied(req, res, next) {
    // console.log("here id", res.locals.table.reservation_id);
    if (res.locals.table.reservation_id) {
        return next();
    } else {
        next({
            status: 400,
            message: `table is not occupied`,
        });
    }
}

module.exports = {
    create: [hasData, hasTableName, hasCapacity, asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
    update: [
        hasData,
        hasReservationId,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(hasEnoughtCapacity),
        tableOccupied,
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(hasTableId),
        tableIsNotOccupied,
        asyncErrorBoundary(remove),
    ],
};
