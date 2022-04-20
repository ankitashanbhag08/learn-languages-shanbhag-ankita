import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ()=>{
    return(
        <>
            <nav>
                <h2>Learn Languages</h2>
                <ul>
                    <li>
                        <NavLink to="/">HOME</NavLink>
                    </li>
                    <li>
                        <NavLink to="/teach">TEACH</NavLink>
                    </li>
                    <li>
                        <NavLink to="/learn">LEARN</NavLink>
                    </li>
                    <li>
                        <NavLink to="/login">LOGIN</NavLink>
                    </li>
                    <li>
                        <NavLink to="/register">REGISTER</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;