import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
    // console.log(date);
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
        const currentDate = new Date(selectedDate);
        let previousDate = new Date(
            currentDate.setDate(currentDate.getDate() - 1)
        );
        previousDate = previousDate.toISOString().split("T")[0];
        setSelectedDate(previousDate);
    }
    function handleCurrentBtn() {
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split("T")[0];
        setSelectedDate(currentDateString);
    }
    function handleNextBtn() {
        const currentDate = new Date(selectedDate);
        let nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        nextDate = nextDate.toISOString().split("T")[0];
        setSelectedDate(nextDate);
    }

    const reservationRows = reservations.map((reservation) => {
        return (
            <tr key={reservation.reservation_id}>
                <th>{reservation.id}</th>
                <th>{reservation.first_name}</th>
                <th>{reservation.last_name}</th>
                <th>{reservation.mobile_number}</th>
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
                    <h4 className="mb-0">Reservations for date</h4>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
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
