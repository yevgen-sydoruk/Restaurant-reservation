const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations").insert(newReservation, "*");
}

function list(query) {
    // console.log(query);
    const { selectedDate } = query;
    // console.log(selectedDate);
    return knex("reservations")
        .select("*")
        .where({ reservation_date: selectedDate })
        .orderBy("reservation_time", "asc");
}

module.exports = {
    list,
    create,
};
