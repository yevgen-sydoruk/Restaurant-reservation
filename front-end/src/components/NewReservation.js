import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
//

function NewReservation() {
    //form boilerplate
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };

    const [formData, setFormData] = useState(initialFormState); //useState to create a new set of data
    const [error, setError] = useState(null);

    //allows to go back on the previous or specified page
    const history = useHistory();

    //submit handle to send data
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const abortController = new AbortController();
            // console.log("here", formData);
            const response = await createReservation(
                { ...formData },
                abortController.signal
            );
            console.log(`/dashboard?date=${formData.reservation_date}`);
            history.push(`/dashboard?date=${formData.reservation_date}`);
            return response;
        } catch (error) {
            setError(error);
            console.error(error);
        }
    }

    function handleCancel() {
        history.push("/");
    }

    function handleChange(event) {
        let value = event.target.value;
        if (event.target.name === "people") {
            value = Number(value);
        }
        if (event.target.name === "mobile_number") {
            value = formatMobileNumber(value);
        }
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    }
    // validation for 10digit number
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

    // function formatMobileNumber(value) {
    //     value = value.replace(/[^\d]/g, "");
    //     if (value.length < 5) return value;
    //     if (value.length < 7) {
    //         return `${value.slice(0, 3)}-${value.slice(3)}`;
    //     }
    //     return `${value.slice(0, 3)}-${value.slice(3, 7)}`;
    // }

    return (
        <div className="container">
            <form onSubmit={(event) => handleSubmit(event)}>
                <h1>New Reservation</h1>
                <ErrorAlert error={error} />
                <div className="form-group">
                    <label htmlFor="first_name">First name: </label>
                    <input
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={(event) => handleChange(event)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last name: </label>
                    <input
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={(event) => handleChange(event)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mobile_number">Mobile number: </label>
                    <input
                        className="form-control"
                        id="mobile_number"
                        name="mobile_number"
                        type="text"
                        value={formData.mobile_number}
                        onChange={(event) => handleChange(event)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reservation_date">
                        Date of reservation:{" "}
                    </label>
                    <input
                        className="form-control"
                        id="reservation_date"
                        name="reservation_date"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        pattern="\d{4}-\d{2}-\d{2}"
                        value={formData.reservation_date}
                        onChange={(event) => handleChange(event)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reservation_time">
                        Time of reservation:{" "}
                    </label>
                    <input
                        className="form-control"
                        id="reservation_time"
                        name="reservation_time"
                        type="time"
                        placeholder="HH:MM"
                        pattern="[0-9]{2}:[0-9]{2}"
                        value={formData.reservation_time}
                        onChange={(event) => handleChange(event)}
                        step="300"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="people">Number of people: </label>
                    <input
                        className="form-control"
                        id="people"
                        name="people"
                        type="number"
                        min="1"
                        value={formData.people}
                        onChange={(event) => handleChange(event)}
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    Submit
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => handleCancel()}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default NewReservation;
