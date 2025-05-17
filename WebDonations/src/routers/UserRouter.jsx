import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import UserList from '../components/UserList';
// import UserProfile from '../components/UserProfile';
// import UserEdit from '../components/UserEdit';

// Example user-related components

const UserRouter = () => (
  <Routes>
    {/* <Route path="/users" element={<UserList />} />
    <Route path="/users/:id" element={<UserProfile />} />
    <Route path="/users/:id/edit" element={<UserEdit />} /> */}
    
    {/* Default route */}
    <Route path="/" element={<Navigate to="/dashboard" />} />
    
    {/* Redirect admin routes */}
    <Route path="/admin/*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

export default UserRouter;