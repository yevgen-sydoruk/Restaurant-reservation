const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations").insert(newReservation, "*");
}

function list(query) {
    console.log(query);
    return knex("reservations")
        .select("*")
        .where({ reservation_date: query })
        .orderBy("reservation_time", "asc");
}

module.exports = {
    list,
    create,
};
