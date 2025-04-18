import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Home from '../pages/Home.jsx';
import Export from '../pages/Export.jsx';
import Semester from '../pages/Semester.jsx';
import Help from '../pages/Help.jsx'
import Summary from '../pages/Summary.jsx';
import AlphaList from '../pages/AlphaList.jsx';
import Bloc from '../pages/Bloc.jsx';
import Faculty from '../pages/Faculty.jsx';
import Admin from '../pages/Admin.jsx';
import { AdminContextProvider } from '../context/adminContext.jsx';

const RouterComponent = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/admin" element={<AdminContextProvider><Admin /></AdminContextProvider>} />
            <Route path="/export" element={<Export />} />
            <Route path="/semester/:id" element={<Semester/>}>
                <Route path="/semester/:id/" element={<Summary/>} /> 
                <Route path='/semester/:id/summary' element={<Summary />}/>
                <Route path='/semester/:id/alphalist' element={<AlphaList/>}/>
                <Route path='/semester/:id/bloc' element={<Bloc/>} />
                <Route path='/semester/:id/faculty' element={<Faculty/>} />
            </Route>
        </Routes>
    );
};

export default RouterComponent;