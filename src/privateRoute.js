import React
// { useContext }
from "react";
import { Route, Redirect } from "react-router-dom";
// import { AuthContext } from "./context/auth";
import Timeline from "views/examples/Timeline";
import Profile from "views/examples/Profile";
import EditProfile from "views/examples/EditProfile";
import Chat from "views/examples/chat";
import Location from "views/examples/location";
import FriendsPage from "views/examples/FirendsPage";
import Group from "views/examples/Group";
import FriendReq from "views/examples/FriendReq";
import ExploreAroundMe from "views/examples/ExploreAroundMe";
import PeopleYouMayKnow from "views/examples/PeopleYouMayKnow";


import { Grade } from "@material-ui/icons";
// import Maps from "views/examples/Maps";
// import Maps2 from "views/examples/Maps2";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
 const currentUser = JSON.parse(localStorage.getItem('uid'));
//  const friendId = JSON.parse(localStorage.getItem('Fuid'));



 if(currentUser==null)
  return <Redirect to="/register" />

//   if ( friendId==null)
//         return <Redirect to="/timeline" />
        
  
  return (
 <>
     {/* <Route {...rest} render={(routeProps) =>  <RouteComponent {...routeProps} />}  /> */}
        <Route path="/home" exact render={props => <Timeline {...props} />} />
        <Route path="/friend" exact render={props => <FriendsPage {...props} />} />
        <Route path="/profile" exact render={props => <Profile {...props} />} />
        <Route path="/edit-profile" exact render={props => <EditProfile {...props} />} />
        <Route path="/chat" exact render={props => <Chat {...props} />} />
        <Route path="/heatmap" exact render={props => <Location {...props} />} />
        <Route path="/group" exact render={props => <Group {...props} />} />
        <Route path="/peopleyoumayknow" exact render={props => <PeopleYouMayKnow {...props} />} />
        {/* <Route path="/fr" exact render={props => <FriendReq {...props} />} /> */}
        <Route path="/explore" exact render={(props) => <ExploreAroundMe {...props} />}/>

        {/* <Route path="/Maps" exact render={props => <Maps {...props} />} />
        <Route path="/Maps2" exact render={props => <Maps2 {...props} />} /> */}
 
</>

        );
};



export default PrivateRoute;

// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import { useAuth } from "./context/auth";

// function PrivateRoute({ component: Component, ...rest }) {
//   const isAuthenticated = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// }

// export default PrivateRoute;


// <Route
//       {...rest}
//       render={props =>
//         fakeAuth.isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: props.location }
//             }}
//           />
//         )
//       }
//     />