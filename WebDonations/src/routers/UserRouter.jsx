import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import UserList from '../components/UserList';
// import UserProfile from '../components/UserProfile';
// import UserEdit from '../components/UserEdit';

// Example user-related components

const UserRouter = () => (
    <Router>
        <Routes>
            {/* <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/users/:id/edit" element={<UserEdit />} /> */}
        </Routes>
    </Router>
);

export default UserRouter;