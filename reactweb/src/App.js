import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import './DashboardLayout.css';

import DashboardLayout from './DashboardLayout';
//import List from './List';
import UpdateScreen from './UpdateScreen';
import HomeScreen from './HomeSreen';
import SavedToDo from './SavedToDo';
import AddTodo from './AddToDo';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout wrapper */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<HomeScreen />} /> {/* Renders at "/" */}
          {/*<Route path="list" element={<List />} />*/}
          <Route path="update/:id" element={<UpdateScreen />} />
            <Route path="add" element={<AddTodo />} />        {/* "/add" */}
          <Route path="list" element={<SavedToDo />} />    {/* "/list" */}
        </Route>
      </Routes>
    </Router>
  );
}
