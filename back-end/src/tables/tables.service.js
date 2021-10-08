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

module.exports = {
    list,
    create,
    update,
    find,
    findReservationId,
};
