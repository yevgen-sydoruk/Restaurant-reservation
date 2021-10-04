import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
let moment = require("moment");

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(date);

    useEffect(loadDashboard, [selectedDate]);

    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ selectedDate }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        return () => abortController.abort();
    }

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
                        </tr>
                    </thead>
                    <tbody>{reservationRows}</tbody>
                </table>

                {JSON.stringify(reservations)}
            </div>
        </main>
    );
}

export default Dashboard;
