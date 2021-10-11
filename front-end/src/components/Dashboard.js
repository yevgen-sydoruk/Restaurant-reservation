import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { listReservations, listTables, finishTable } from "../utils/api";
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
                // setError(null);
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
                    className="btn"
                >
                    Seat
                </Link>
            );
        }
        return null;
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
        }
    }

    function showFinishButton(table, reservationId) {
        if (reservationId) {
            return (
                <button
                    className="btn"
                    data-table-id-finish={table.table_id}
                    onClick={() => handleFinish(table)}
                >
                    Finish
                </button>
            );
        }
        return (
            <button
                className="btn"
                data-table-id-finish={table.table_id}
                disabled
            >
                Empty
            </button>
        );
    }

    const reservationRows = reservations.map((reservation) => {
        return (
            <tr key={reservation.reservation_id}>
                <th>{reservation.reservation_id}</th>
                <th>{reservation.first_name}</th>
                <th>{reservation.last_name}</th>
                <th>{reservation.mobile_number}</th>
                <th>{reservation.reservation_time}</th>
                <th>{reservation.reservation_date}</th>
                <th>{reservation.people}</th>
                <td
                    className="d-none d-md-table-cell"
                    data-reservation-id-status={`${reservation.reservation_id}`}
                >
                    {reservation.status}
                </td>
                <th>{showSeatButton(reservation)}</th>
            </tr>
        );
    });

    const tableRows = tables.map((table) => {
        return (
            <tr key={table.table_id}>
                <th>{table.table_id}</th>
                <th>{table.table_name}</th>
                <th>{table.capacity}</th>
                <th data-table-id-status={table.table_id}>
                    {table.reservation_id ? "Occupied" : "Free"}
                </th>
                <td>{showFinishButton(table, table.reservation_id)}</td>
            </tr>
        );
    });

    return (
        //errorAlert ask mentor
        <main>
            <div className="container">
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
                <div className="btn-group">
                    <button type="button" onClick={() => handlePreviousBtn()}>
                        Previous Date
                    </button>
                    <button type="button" onClick={() => handleCurrentBtn()}>
                        Current Date
                    </button>
                    <button type="button" onClick={() => handleNextBtn()}>
                        Next Date
                    </button>
                </div>
                <div className="d-md-flex mb-3">
                    <h4 className="mb-0">
                        Reservations for date {selectedDate}
                    </h4>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Mobile Number</th>
                            <th>Reservation Time</th>
                            <th>Reservation date</th>
                            <th>People</th>
                            <th>Status</th>
                            <th>Seat</th>
                        </tr>
                    </thead>
                    <tbody>{reservationRows}</tbody>
                </table>
                <h3>Tables</h3>
                <ErrorAlert error={error} />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Table Location</th>
                            <th>Capacity</th>
                            <th>Availability</th>
                            <th>Finish</th>
                        </tr>
                    </thead>
                    <tbody>{tableRows}</tbody>
                </table>
            </div>
        </main>
    );
}

export default Dashboard;
