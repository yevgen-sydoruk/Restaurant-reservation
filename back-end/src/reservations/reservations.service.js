const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations").insert(newReservation, "*");
}

function list(query, mobile_number) {
    if (query) {
        const { selectedDate } = query;

        return knex("reservations")
            .select("*")
            .where({ reservation_date: query })
            .whereNot({ status: "cancelled" })
            .whereNot({ status: "finished" })
            .orderBy("reservation_time", "asc");
    }

    if (mobile_number) {
        return knex("reservations")
            .whereRaw(
                "translate(mobile_number, '() -', '') like ?",
                `%${mobile_number.replace(/\D/g, "")}%`
            )
            .orderBy("reservation_time", "asc");
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
