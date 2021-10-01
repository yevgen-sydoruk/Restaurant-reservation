import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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

    //allows to go back on the previous or specified page
    const history = useHistory();

    //submit handle to send data
    function handleSubmit(event) {
        event.preventDefault();
        history.push("/dashboard");
    }

    function handleCancel() {
        history.push("/");
    }

    function handleChange(event) {
        let value = event.target.value;
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    }

    return (
        //ask mentor
        <div className="container">
            <form onSubmit={(event) => handleSubmit(event)}>
                <h1>New Reservation</h1>
                <div className="form-group">
                    <label htmlFor="first_name">
                        First name:{" "}
                        <input
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={(event) => handleChange(event)}
                            required
                        />
                    </label>
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
