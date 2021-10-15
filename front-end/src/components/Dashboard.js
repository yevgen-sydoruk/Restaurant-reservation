import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
    listReservations,
    listTables,
    finishTable,
    updateReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
let moment = require("moment");

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ todayDate }) {
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search);
    const queryDate = query.get("date");

    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        queryDate ? queryDate : todayDate
    );
    useEffect(() => {
        const abortController = new AbortController();
        setReservationsError(null);
        async function loadDashboard() {
            try {
                const date = selectedDate; //for test pass
                const response = await listReservations(
                    { date },
                    abortController.signal
                );
                setReservations(response);
            } catch (error) {
                setReservationsError(error);
                console.error(error);
            }
            try {
                setError(null);
                const response = await listTables(abortController.signal);
                setTables(response);
            } catch (error) {
                setError(error);
                console.error(error);
            }
        }
        loadDashboard();
        return () => {
            abortController.abort();
        };
    }, [selectedDate]);

    function handleChange(event) {
        const date = event.target.value;
        setSelectedDate(date);
    }

    function handlePreviousBtn() {
        const previousDate = moment(selectedDate)
            .add(-1, "days")
            .format()
            .split("T")[0];
        setSelectedDate(previousDate);
    }
    function handleCurrentBtn() {
        const today = moment().format().split("T")[0];
        setSelectedDate(today);
    }
    function handleNextBtn() {
        const nextDate = moment(selectedDate)
            .add(1, "days")
            .format()
            .split("T")[0];
        setSelectedDate(nextDate);
    }

    function showSeatButton(reservation) {
        if (reservation.status === "booked") {
            return (
                <Link
                    to={{
                        pathname: `/reservations/${reservation.reservation_id}/seat`,
                        state: {
                            tables: tables,
                        },
                    }}
                    type="button"
                    className="btn btn-warning btn-md"
                >
                    Seat
                </Link>
            );
        }
        return (
            <button
                to={{
                    pathname: `/reservations/${reservation.reservation_id}/seat`,
                    state: {
                        tables: tables,
                    },
                }}
                type="button"
                className="btn btn-warning btn-md"
                disabled
            >
                Seat
            </button>
        );
    }
    async function handleFinish(table) {
        const abortController = new AbortController();
        try {
            if (
                window.confirm(
                    `Is this table ready to seat new guests? This cannot be undone.`
                )
            ) {
                const response = await finishTable(
                    table,
                    abortController.signal
                );
                history.go(0);
                return response;
            }
        } catch (error) {
            setError(error);
            console.error(error);
        }
    }

    function showFinishButton(table, reservationId) {
        if (reservationId) {
            return (
                <button
                    className="btn btn-warning btn-md"
                    data-table-id-finish={table.table_id}
                    onClick={() => handleFinish(table)}
                >
                    Finish
                </button>
            );
        }
        return (
            <button
                className="btn btn-warning btn-md"
                data-table-id-finish={table.table_id}
                disabled
            >
                Empty
            </button>
        );
    }
    function editReservation(reservation) {
        if (reservation.status === "booked") {
            return (
                <Link
                    to={{
                        pathname: `/reservations/${reservation.reservation_id}/edit`,
                        state: {
                            date: reservation.reservation_date,
                        },
                    }}
                    type="button"
                    className="btn btn-warning btn-md"
                >
                    Edit
                </Link>
            );
        }
        return (
            <button
                to={{
                    pathname: `/reservations/${reservation.reservation_id}/edit`,
                    state: {
                        date: reservation.reservation_date,
                    },
                }}
                type="button"
                className="btn btn-warning btn-md"
                disabled
            >
                Edit
            </button>
        );
    }

    function cancelButton(reservation) {
        if (reservation.status === "booked") {
            return (
                <button
                    className="btn btn-danger"
                    onClick={() => cancelReservation(reservation)}
                >
                    Cancel
                </button>
            );
        } else {
            return (
                <button className="btn danger" disabled>
                    Cancel
                </button>
            );
        }
    }

    async function cancelReservation(reservation) {
        try {
            if (
                window.confirm(
                    `Do you want to cancel this reservation? This cannot be undone.`
                )
            ) {
                const abortController = new AbortController();
                const response = await updateReservation(
                    reservation,
                    "cancelled",
                    abortController.signal
                );
                history.go(0);
                return response;
            }
        } catch (error) {
            setError(error);
            console.error(error);
        }
    }
    const reservationRows = reservations.map((reservation) => {
        return (
            <tr
                className="text-center"
                style={{ height: "48px" }}
                key={reservation.reservation_id}
            >
                <th className="d-none d-lg-table-cell">
                    {reservation.reservation_id}
                </th>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td className="d-none d-lg-table-cell">
                    {reservation.mobile_number}
                </td>
                <td>{reservation.reservation_time}</td>
                <td className="d-none d-lg-table-cell">
                    {reservation.reservation_date}
                </td>
                <td className="d-none d-lg-table-cell">{reservation.people}</td>
                <td
                    data-reservation-id-status={`${reservation.reservation_id}`}
                >
                    {reservation.status}
                </td>

                <td>{showSeatButton(reservation)}</td>
                <td>{editReservation(reservation)}</td>
                <td data-reservation-id-cancel={reservation.reservation_id}>
                    {cancelButton(reservation)}
                </td>
            </tr>
        );
    });

    const tableRows = tables.map((table) => {
        return (
            <tr key={table.table_id}>
                <th>{table.table_id}</th>
                <td>{table.table_name}</td>
                <td>{table.capacity}</td>
                <td data-table-id-status={table.table_id}>
                    {table.reservation_id ? "Occupied" : "Free"}
                </td>
                <td>{showFinishButton(table, table.reservation_id)}</td>
            </tr>
        );
    });

    return (
        <main>
            <div className="container">
                <div className="d-grid gap-2 mb-2">
                    <h1>Dashboard</h1>
                    <ErrorAlert error={reservationsError} />
                    <h3>Reservation</h3>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            name="date"
                            className="form-control"
                            type="date"
                            value={selectedDate}
                            onChange={(event) => {
                                handleChange(event);
                            }}
                            required
                        />
                    </div>
                    <div className="btn-group mb-3">
                        <button
                            type="button"
                            className="form-control btn btn-primary mr-2 rounded-start btn-lg text-nowrap"
                            onClick={() => handlePreviousBtn()}
                        >
                            Previous Date
                        </button>
                        <button
                            type="button"
                            className="form-control btn btn-primary mr-2 btn-lg text-nowrap"
                            onClick={() => handleCurrentBtn()}
                        >
                            Current Date
                        </button>
                        <button
                            type="button"
                            className="form-control btn btn-primary mr-2 rounded-end btn-lg text-nowrap"
                            onClick={() => handleNextBtn()}
                        >
                            Next Date
                        </button>
                    </div>
                    <div className="d-md-flex mb-3">
                        <h4 className="mb-0">
                            Reservations for date {selectedDate}
                        </h4>
                    </div>

                    <table
                        className="table table-striped table-hover table-bordered"
                        id="reservations"
                    >
                        <thead>
                            <tr>
                                <th
                                    className="d-none d-lg-table-cell"
                                    scope="col"
                                >
                                    #
                                </th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th className="d-none d-lg-table-cell">
                                    Mobile №
                                </th>
                                <th>Reservation Time</th>
                                <th className="d-none d-lg-table-cell">
                                    Reservation date
                                </th>
                                <th className="d-none d-lg-table-cell">
                                    People
                                </th>
                                <th>Status</th>
                                <th>Seat</th>
                                <th>Edit</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>{reservationRows}</tbody>
                    </table>
                    <h3>Tables</h3>
                    <ErrorAlert error={error} />
                    <table
                        className="table table-striped table-hover table-bordered"
                        id="tables"
                    >
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Table Location</th>
                                <th>Capacity</th>
                                <th>Availability</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>{tableRows}</tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
