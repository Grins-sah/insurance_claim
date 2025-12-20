import React from 'react';
import LandingPage from './pages/LandingPage';
import { Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AuthorityPage from './pages/AuthorityPage';
import DashboardPage from './pages/Customer/DashboardPage';
import PoliciesPage from './pages/Customer/PoliciesPage';
import ClaimsPage from './pages/Customer/ClaimsPage';
import CreateClaimPage from './pages/Customer/CreateClaimPage';
import NotificationsPage from './pages/Customer/NotificationsPage';
import ProfilePage from './pages/Customer/ProfilePage';
import SettingsPage from './pages/Customer/SettingsPage';
const App = () => {
    return (<div>
      <Routes>

        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/:par' element={<AuthPage />}></Route>
        <Route path='/customer/dashboard' element={<DashboardPage />}></Route>
        <Route path='/customer/policies' element={<PoliciesPage />}></Route>
        <Route path='/customer/claims' element={<ClaimsPage />}></Route>
        <Route path='/customer/create-claim' element={<CreateClaimPage />}></Route>
        <Route path='/customer/notifications' element={<NotificationsPage />}></Route>
        <Route path='/customer/profile' element={<ProfilePage />}></Route>
        <Route path='/customer/settings' element={<SettingsPage />}></Route>
        <Route path='/authority/dashboard' element={<AuthorityPage />}></Route>

      </Routes>
      
      
    </div>);
};
export default App;
