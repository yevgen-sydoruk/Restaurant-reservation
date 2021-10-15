import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatOption() {
    const history = useHistory();
    const [seatError, setSeatError] = useState(null);
    const [allTables, setAllTables] = useState([]);
    const [table, setTable] = useState();

    const { reservation_id } = useParams(); //get reservation_id from URL

    useEffect(() => {
        const abortController = new AbortController();
        setSeatError(null);
        async function loadTables() {
            try {
                const response = await listTables(abortController.signal);
                setAllTables(response);
            } catch (error) {
                setSeatError(error);
            }
        }
        loadTables();
        return () => {
            abortController.abort();
        };
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        if (table) {
            try {
                const abortController = new AbortController();
                const response = await updateSeat(
                    { ...table, reservation_id: reservation_id },
                    abortController.signal
                );
                history.push("/");
                return response;
            } catch (error) {
                setSeatError(error);
            }
        }
    }

    function handleChange(event) {
        if (event.target.value !== "Select a table...") {
            const result = allTables.find(
                (table) => table.table_name === event.target.value
            );
            setTable(result);
        }
    }

    function handleCancel() {
        history.goBack();
    }

    const tableOptions = allTables.map((table) => {
        if (!table.reservation_id) {
            return (
                <option key={table.table_id} value={table.table_name}>
                    {table.table_name} - {table.capacity}
                </option>
            );
        } else {
            return (
                <option key={table.table_id} value={table.table_name} disabled>
                    {table.table_name} - {table.capacity} - Occupied
                </option>
            );
        }
    });

    if (allTables) {
        return (
            <div className="container">
                <h2>Seat</h2>
                <ErrorAlert error={seatError} />
                <form onSubmit={(event) => handleSubmit(event)}>
                    <select
                        name="table_id"
                        id="table_id"
                        className="form-control mb-3"
                        value={table ? table.table_name : "table"}
                        onChange={(event) => handleChange(event)}
                    >
                        <option value="Select a table...">
                            Select a Table...
                        </option>
                        {tableOptions}
                    </select>
                    <button
                        type="submit"
                        className="btn btn-primary btn-md mr-3"
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => handleCancel()}
                        type="button"
                        className="btn btn-secondary btn-md"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        );
    } else {
        return null;
    }
}

export default SeatOption;
