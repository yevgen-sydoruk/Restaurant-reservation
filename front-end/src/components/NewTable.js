import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
    const history = useHistory();

    const initialFormData = {
        table_name: "",
        capacity: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);

    function handleChange(event) {
        let value = event.target.value;
        if (event.target.name === "capacity") {
            value = Number(value);
        }
        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event);
        try {
            const abortController = new AbortController();
            const response = await createTable(
                { ...formData },
                abortController.signal
            );
            history.push(`/`);
            console.log(response);
            return response;
        } catch (error) {
            setError(error);
        }
    }

    function handleCancel() {
        history.goBack();
    }

    return (
        <div className="container">
            <form onSubmit={(event) => handleSubmit(event)}>
                <h1>New Table</h1>
                <ErrorAlert error={error} />
                <div className="form-group">
                    <label htmlFor="table_name">Table name:</label>
                    <input
                        className="form-control"
                        id="table_name"
                        name="table_name"
                        type="text"
                        value={formData.table_name}
                        onChange={(event) => handleChange(event)}
                        min="2"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="capacity">Capacity:</label>
                    <input
                        className="form-control"
                        id="capacity"
                        name="capacity"
                        type="text"
                        value={formData.capacity}
                        onChange={(event) => handleChange(event)}
                        min="1"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleCancel()}
                >
                    Cancel
                </button>
            </form>
            {/* have the following required and not-nullable fields:
Table name: <input name="table_name" />, which must be at least 2 characters long.
Capacity: <input name="capacity" />, this is the number of people that can be seated at the table, which must be at least 1 person.
display a Submit button that, when clicked, saves the new table then displays the /dashboard page
display a Cancel button that, when clicked, returns the user to the previous page */}
        </div>
    );
}

export default NewTable;
