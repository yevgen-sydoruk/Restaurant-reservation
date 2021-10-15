import React, { useState } from "react";
import { listReservations } from "../utils/api";

function Search() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const abortController = new AbortController();

        setError(null);

        listReservations(
            { mobile_number: mobileNumber },
            abortController.signal
        )
            .then(setReservations)
            .catch(setError);
        console.error(error);
        return () => abortController.abort();
    }

    function handleChange(event) {
        let value = event.target.value;
        value = formatMobileNumber(value);
        setMobileNumber(value);
    }

    function formatMobileNumber(value) {
        value = value.replace(/[^\d]/g, "");
        if (value.length < 5) return value;
        if (value.length < 8) {
            return `${value.slice(0, 3)}-${value.slice(3)}`;
        }
        return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(
            6,
            10
        )}`;
    }

    const searchResult = reservations.map((reservation) => {
        return (
            <tr key={reservation.reservation_id}>
                <th>{reservation.reservation_id}</th>
                <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.reservation_time}</td>
                <td>{reservation.people}</td>
                <td>{reservation.status}</td>
            </tr>
        );
    });
    return (
        <div className="container">
            <form onClick={(event) => handleSubmit(event)}>
                <h2>Search</h2>
                <div className="form-group">
                    <label htmlFor="mobile_number">Mobile Number:</label>
                    <input
                        id="mobile_number"
                        name="mobile_number"
                        className="form-control"
                        type="text"
                        value={mobileNumber}
                        onChange={(event) => handleChange(event)}
                        placeholder="Enter a customer's phone number"
                        required
                    />
                </div>

                <button className="btn btn-primary" type="submit">
                    Find
                </button>
            </form>
            {reservations.length <= 0 ? (
                <h3>"No reservations found"</h3>
            ) : (
                <table className="table table-hover m-1">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">People</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>

                    <tbody>{searchResult}</tbody>
                </table>
            )}
        </div>
    );
}

export default Search;
