import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
    return (
        <div className="container-fluid ">
            <div className="main-c d-flex container-fluid justify-content-between h-100">
                <div className="menu col-md-2 side-bar h-100 w-300">
                    <Menu />
                </div>
                <div className="routes col">
                    <Routes />
                </div>
            </div>
        </div>
    );
}

export default Layout;
