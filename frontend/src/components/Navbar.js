import React from "react";
import { NavLink } from "react-router-dom";
import Teach from './Teach';
import Home from './Home';
import Learn from './Learn';
import {AppBar, Typography, Toolbar, Tabs, Tab} from "@mui/material"
import SchoolIcon from '@mui/icons-material/School';
import '../styles/Navbar.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";
const pages = ['Home', 'Learn', 'Teach'];

const Navbar = ()=>{
    
    return(
        <>
            <BrowserRouter>
            
            <AppBar sx={{background:"#063970"}}>
                <Toolbar>
                    <SchoolIcon fontSize="large"/>
                    <Typography>
                        Learn Languages
                                          
                    </Typography>
                    
                    <Tabs textColor="inherit">
                        <Tab label="Home" component={NavLink} to={"/"}></Tab>
                        <Tab label="Teach" component={NavLink} to={"/teach"}></Tab>
                        <Tab label="Learn" component={NavLink} to={"/learn"}></Tab>                                              
                    </Tabs>            
                </Toolbar>
            </AppBar>
           
            <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/teach" element={<Teach/>}></Route>
          <Route path="/learn" element={<Learn/>}></Route>
        </Routes>
            </BrowserRouter>
            
        </>
     /*   <>
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
        </>*/
    )
}

export default Navbar;