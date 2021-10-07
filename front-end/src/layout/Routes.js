import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import NewReservation from "../components/NewReservation";
import NewTable from "../components/NewTable";
import SeatButton from "../components/SeatButton";

import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
    return (
        <Switch>
            <Route exact={true} path="/">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations/new">
                <NewReservation />
            </Route>

            <Route path="/dashboard">
                <Dashboard todayDate={today()} />
            </Route>
            <Route path="/dashboard/:date">
                <Dashboard />
            </Route>
            <Route path="/tables/new">
                <NewTable />
            </Route>
            <Route exact={true} path="/reservations/:reservation_id/seat">
                <SeatButton />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;
