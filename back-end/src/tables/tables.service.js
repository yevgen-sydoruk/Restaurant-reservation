const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
    return knex("tables").insert(newTable, "*");
}
function update(data, table) {
    return knex("tables")
        .where({ table_id: table.table_id })
        .update({ reservation_id: data.reservation_id }, "*");
}
function find(tableId) {
    return knex("tables").select("*").where({ table_id: tableId }).first();
}
function findReservationId(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
}
function remove(tableId) {
    return knex("tables")
        .where({ table_id: tableId })
        .update({ reservation_id: null });
}

function updateStatus(table, status) {
    return knex("reservations")
        .where({ reservation_id: table.reservation_id })
        .update({ status: status });
}

module.exports = {
    list,
    create,
    update,
    find,
    findReservationId,
    remove,
    updateStatus,
};
