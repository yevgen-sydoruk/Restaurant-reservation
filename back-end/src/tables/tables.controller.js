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

function hasTableName(req, res, next) {
    const tableName = req.body.data.table_name;
    if (tableName && tableName.length > 1) {
        return next();
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

module.exports = {
    create: [hasData, hasTableName, hasCapacity, asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
};
