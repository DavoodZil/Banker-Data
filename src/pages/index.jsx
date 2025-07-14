import Layout from "./Layout.jsx";

import Merchants from "./Merchants";

import Reports from "./Reports";

import Goals from "./Goals";

import CashFlow from "./CashFlow";

import Budget from "./Budget";

import Tag from "./Tag";

import Entity from "./Entity";

import Group from "./Group";

import Preferences from "./Preferences";

import Notifications from "./Notifications";

import Dashboard from "./Dashboard";

import Accounts from "./Accounts";

import Transactions from "./Transactions";

import Categories from "./Categories";

import Rules from "./Rules";

import AccountDetails from "./AccountDetails";

import API from "./API";

import Import from "./Import";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Merchants: Merchants,
    
    Reports: Reports,
    
    Goals: Goals,
    
    CashFlow: CashFlow,
    
    Budget: Budget,
    
    Tag: Tag,
    
    Entity: Entity,
    
    Group: Group,
    
    Preferences: Preferences,
    
    Notifications: Notifications,
    
    Dashboard: Dashboard,
    
    Accounts: Accounts,
    
    Transactions: Transactions,
    
    Categories: Categories,
    
    Rules: Rules,
    
    AccountDetails: AccountDetails,
    
    API: API,
    
    Import: Import,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Merchants />} />
                
                
                <Route path="/Merchants" element={<Merchants />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Goals" element={<Goals />} />
                
                <Route path="/CashFlow" element={<CashFlow />} />
                
                <Route path="/Budget" element={<Budget />} />
                
                <Route path="/Tag" element={<Tag />} />
                
                <Route path="/Entity" element={<Entity />} />
                
                <Route path="/Group" element={<Group />} />
                
                <Route path="/Preferences" element={<Preferences />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Accounts" element={<Accounts />} />
                
                <Route path="/Transactions" element={<Transactions />} />
                
                <Route path="/Categories" element={<Categories />} />
                
                <Route path="/Rules" element={<Rules />} />
                
                <Route path="/AccountDetails" element={<AccountDetails />} />
                
                <Route path="/API" element={<API />} />
                
                <Route path="/Import" element={<Import />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}