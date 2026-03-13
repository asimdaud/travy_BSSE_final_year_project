import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Login from "views/examples/Login.jsx";
import Profile from "views/examples/Profile.jsx";
import Register from "views/examples/Register.jsx";
import Timeline from "views/examples/Timeline.jsx";
import EditProfile from "views/examples/EditProfile";
import PrivateRoute from "./privateRoute";
import Modals from "./components/Modal/Modals";
import FriendsPage from "views/examples/FirendsPage";
import Group from "views/examples/Group.jsx";
import Loc from "views/examples/location";
import Chat from "views/examples/chat";
import FriendReq from "views/examples/FriendReq";
import ExploreAroundMe from "views/examples/ExploreAroundMe";
import PeopleYouMayKnow from "views/examples/PeopleYouMayKnow";
ReactDOM.render(
  <BrowserRouter>
    <Switch>

      <PrivateRoute path="/heatmap" exact render={(props) => <Loc {...props} />} />
      <Route path="/login" exact render={(props) => <Login {...props} />} />

      <PrivateRoute
        path="/explore"
        exact
        render={(props) => <ExploreAroundMe {...props} />}
      />

      <PrivateRoute
        path="/profile"
        render={(props) => <Profile {...props} />}
        exact
      />
      <PrivateRoute
        path="/group"
        render={(props) => <Group {...props} />}
        exact
      />
      <PrivateRoute
        path="/edit-profile"
        render={(props) => <EditProfile {...props} />}
        exact
      />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <PrivateRoute
        path="/chat"
        exact
        render={(props) => <Chat {...props} />}
      />
      <PrivateRoute
        path="/peopleyoumayknow"
        exact
        render={(props) => <PeopleYouMayKnow {...props} />}
      />
      <PrivateRoute
        path="/friend"
        render={(props) => <FriendsPage {...props} />}
        exact
      />
      <PrivateRoute
        path="/home"
        render={(props) => <Timeline {...props} />}
        exact
      />
      <Redirect to="/profile" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
