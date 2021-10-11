const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations").insert(newReservation, "*");
}

function list(date, mobile_number) {
    if (date) {
        const { selectedDate } = date;
        return knex("reservations")
            .select("*")
            .where({ reservation_date: query })
            .whereNot({ status: "finished" })
            .orderBy("reservation_time", "asc");
    }

    if (mobile_number) {
        return knex("reservations")
            .select("*")
            .where("mobile_number", "like", `${mobile_number}%`);
    }

    return knex(tableName).select("*");
}

function search(reservationId) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId });
}

function edit(data) {
    return knex("reservations")
        .where({ reservation_id: data.reservation_id })
        .update(
            {
                first_name: data.first_name,
                last_name: data.last_name,
                mobile_number: data.mobile_number,
                reservation_date: data.reservation_date,
                reservation_time: data.reservation_time,
                people: data.people,
            },
            "*"
        );
}

function updateStatus(reservationId, status) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .update({ status: status }, "*");
}

module.exports = {
    list,
    create,
    search,
    edit,
    updateStatus,
};
