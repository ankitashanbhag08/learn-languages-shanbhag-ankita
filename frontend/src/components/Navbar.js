import React, {useState} from "react";
import { Link } from "react-router-dom";
import Teach from './Teach';
import TakeTest from './TakeTest';
import Learn from './Learn';
import {AppBar, Typography, Toolbar, Tabs, Tab, Button} from "@mui/material"
import SchoolIcon from '@mui/icons-material/School';

import {BrowserRouter, Route, Routes} from "react-router-dom";


const Navbar = ()=>{ 
    //Defines the current active tab
    const [value, setValue]  = useState("/");
    return(
        <>
            <BrowserRouter>            
                <AppBar sx={{background:"#063970"}}>
                    <Toolbar>
                        <SchoolIcon fontSize="large"/>
                        <Typography>
                            Learn Languages
                                            
                        </Typography>
                        
                        <Tabs sx={{marginLeft:"auto"}} textColor="inherit" value={value} onChange={(e, value)=>setValue(value)} indicatorColor="secondary">
                            <Tab label="Learn" value={"/"} component={Link} to={"/"}></Tab>
                            <Tab label="Take Test" value={"/test"} component={Link} to={"/test"}></Tab>
                            <Tab label="Teach" value={"/teach"} component={Link} to={"/teach"}></Tab>                          
                        </Tabs> 
                        <Button sx={{marginLeft:"auto"}} variant="contained">Login </Button>
                        <Button sx={{marginLeft:"10px"}} variant="contained">Register</Button>           
                    </Toolbar>
                </AppBar>           
                <Routes>
                    <Route path="/test" element={<TakeTest/>}></Route>
                    <Route path="/teach" element={<Teach/>}></Route>
                    <Route path="/" element={<Learn/>}></Route>
                </Routes>
            </BrowserRouter>
            
        </>
    )
}

export default Navbar;