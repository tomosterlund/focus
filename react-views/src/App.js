import React from 'react';
import './App.scss';
import Layout from './components/Layouts/Layout'

// Views
import GroupRoom from './containers/GroupRoom/GroupRoom'
import Registration from './containers/RegistrationLogin/Registration'
import Login from './containers/RegistrationLogin/Login'
import HomePage from './containers/HomePage/HomePage'
import GroupsPage from './containers/GroupsPage/GroupsPage'
import EditUser from './containers/EditUser/EditUser';

// Router
import { BrowserRouter as Router, Switch} from 'react-router-dom'
import { Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/groups" exact component={GroupsPage} />
            <Route path="/register" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/groups/:groupId" exact component={GroupRoom} />
            <Route path="/edit-user" exact component={EditUser} />
          </Switch>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
