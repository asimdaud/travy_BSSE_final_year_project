/*global google*/

import React from "react";
import Post from "../../components/post.jsx";
import {
  // Button,
  Card,
  CardBody,
  CardText,
  Alert,
  CardTitle,
  CardLink,
  CardSubtitle,
  Badge,
  Row,
  Button,
  // CardHeader,
  // CardBody,
  // NavItem,
  // NavLink,
  // Nav,
  // Progress,
  // Table,
  Container,
  Jumbotron,
  Col,
} from "reactstrap";
//  import * as firebase from 'firebase';
import { firebase } from "../../services/firebase";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { Redirect, Link } from "react-router-dom";
// import {
//   CardImg, CardText,  CardTitle, CardSubtitle
// } from 'reactstrap';
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import PlaceCard from "components/PlaceCard.jsx";

const user3 = JSON.parse(localStorage.getItem("uid"));
const userId = JSON.parse(localStorage.getItem("uid"));
// const fuid = JSON.parse(localStorage.getItem("Fuid"));

class Timeline extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  firestoreUserRecommendationsRef = firebase
    .firestore()
    .collection("userRecommendations");

  // firestoreFollowingRef = firebase
  //   .firestore()
  //   .collection("following")
  //   .doc(user3)
  //   .collection("userFollowing");

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     user3: JSON.parse(localStorage.getItem("uid")),
  //     posts: [],
  //     userData: {},
  //     followedUsers: [],
  //     avatar: "",
  //     isLoading: true,
  //   };
  // }

  state = {
    user3: JSON.parse(localStorage.getItem("uid")),
    posts: [],
    userData: {},
    followedUsers: [],
    avatar: "",
    isLoading: true,
    friendReqData: [],
    friendReq: [],

    // fuid: JSON.parse(localStorage.getItem("Fuid")),
    alreadyFriendsCheck: false,
    userRec: [],
    userRecData: [],
    userLocation: "",
    following: false,
    pending: false,
    publicProfile: true,
    loading: true,
    //explorearoundme
    userLat: "33.6829308",
    userLong: "73.005094",
    places: [],
    currentLocation: {},
    placeType: "tourist_attraction",
  };

  // componentWillMount = () => {
  // this.getPosts();
  // user3: JSON.parse(localStorage.getItem("uid"));

  // this.getProfilePic();
  // this.getFollowedUsers();
  // this.getFollowingPosts();
  // };

  // componentDidMount = () => {
  //   // this.getProfilePic();
  //   // this.getFollowingPosts();
  //   // this._isMounted = true;
  //   // this.getFollowedUsers().then(result => {
  //   //   if (this._isMounted) {
  //   //     this.setState({isLoading: false})
  //   //   }
  //   // });
  //   // localStorage.removeItem("Fuid");

  //   user3: JSON.parse(localStorage.getItem("uid"));

  //   this.getUserRec();
  //   this.getProfilePic();
  //   this.getFollowedUsers();
  //   this.getFollowingPosts();

  //   // this.getCurrentLocation().then(() => {
  //   this.getPlaces();
  //   // });
  // };

  componentWillUnmount() {
    this.getFollowedUsers();
    this.getFollowingPosts();
    // this.getProfilePic();
    // this.state = {
    //   user3: JSON.parse(localStorage.getItem("uid")),
    //   posts: [],
    //   userData: {},
    //   followedUsers: [],
    //   avatar: "",
    //   isLoading: true,
    // };
    // this.getProfilePic();
    // this.getFollowedUsers();
    // this.getFollowingPosts();
  }

  getFriendId = async () => {
    // this.state.friendId = JSON.parse(localStorage.getItem("Fuid"));
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.getFriendId().then(() => {
      this.getUserRec();
      this.getProfilePic();
      this.getFollowedUsers();
      this.getFollowingPosts();

      // this.getCurrentLocation().then(() => {
      this.getPlaces();
      // });
    });
  }

  // Get all the users the current user3 is following
  getFollowedUsers = async () => {
    let users = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          users.push(docSnap.id);
        });
        // this.setState({followedUsers: users});
      });
    this.setState({ followedUsers: users });
    // console.log(this.state.followedUsers);
  };

  // Get all posts of each user3 and push them in a same array
  getFollowingPosts = async () => {
    // 1. Get all the users the current user3 is following
    await this.getFollowedUsers().then(async () => {
      // console.log(this.state.followedUsers);

      let users = this.state.followedUsers;
      let allPosts = [];

      // 2. Get posts of each user3 seperately and putting them in one array.
      //  users.forEach(async (user3) => {
      for (const eachUser of users) {
        await this.getProfilePic(eachUser).then(async () => {
          // console.log("Avatar:" + this.state.avatar);
          await this.firestoreUsersRef
            .doc(eachUser)
            .get()
            .then(async (document) => {
              this.setState({ userData: document.data() });

              // console.log(document.data());
              await this.firestorePostRef
                .doc(eachUser)
                .collection("userPosts")
                .orderBy("time", "desc")
                // .limit(9)
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    let article = {
                      username: this.state.userData.username,
                      userId: eachUser,
                      title: "post",
                      avatar: this.state.avatar,
                      image: doc.data().image,
                      cta: "cta",
                      caption: doc.data().caption,
                      location: doc.data().location.coordinates,
                      locName: doc.data().location.locationName,
                      postId: doc.data().postId,
                      timeStamp: doc.data().time,
                      // likes:0,
                      locLatLng: "Address",
                    };
                    allPosts.push(article);
                  });
                });
              this.setState({ posts: allPosts });
            });
        });
        // allPosts.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.timeStamp) - new Date(a.timeStamp) ;
        // });

        // this.setState({posts: allPosts});
        // console.log(this.state.posts);
      }
    });
  };

  getProfilePic = async (user) => {
    const firebaseProfilePic = await firebase
      .storage()
      .ref()
      .child("profilePics/(" + user + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // console.log("got profile pic of" +user3 + url);
        this.setState({ avatar: url });
        console.log(this.state.avatar);

        return url;
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              avatar:
                "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif",
            });
            return "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif";
          // break;
        }
        console.log(error);
      });
  };

  noFriendsTimeline = () => {
    if (this.state.followedUsers.length > 0) {
      return (
        <Col
          sm="6"
          md="6"
          lg="6"
          className="order-md-2"
          style={{ zoom: "85%" }}
        >
          {/* <div className="col-md-8 mx-auto"> */}
          {/* <div className="card"> */}
          {/* <div className="card-header"> */}
          {/* <h5 className="h3 mb-0">Timeline</h5> */}
          {/* </div> */}
          {/* <div className="container card-profile mt--300"> */}

          {this.state.posts.map((post, postindex) => (
            <Post item={post} key={postindex} />
          ))}
        </Col>
      );
    } else {
      return (
        <Col
          sm="6"
          md="6"
          lg="6"
          className="order-md-2"
          style={{ zoom: "85%" }}
        >
          <Card className="container justify-content-center ">
            <h3 className="display-3 lead">
              You aren't following any users{" "}
              <i className="fa fa-lock" aria-hidden="true"></i>
              {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
            </h3>
            <p className="lead description">
              Follow accounts to see their posts
            </p>
          </Card>
        </Col>
      );
    }
  };

  writeNewPost(
    user3,
    // username,
    picture,
    caption,
    location
  ) {
    // A post entry.
    var postData = {
      username: this.state.userData.username,
      userId: user3,
      title: "post",
      avatar: this.state.avatar,
      cta: "cta",
      image: picture,
      caption: caption,
      location: location,
      postId: "",
      timeStamp: "",
    };
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child("posts").push().key;

    // Write the new post's data simultaneously in the posts list and the user3's post list.
    var updates = {};
    updates["/posts/" + newPostKey] = postData;
    updates["/user3-posts/" + user3 + "/" + newPostKey] = postData;

    return firebase.database().ref().update(updates);
  }

  // alreadyFriends = (fuid) => {
  //   let bol = false;
  //   // let userIdTBC = JSON.stringify(fuid);
  //   this.firestoreFollowingRef
  //     .doc(fuid)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         bol = true;
  //       }
  //     });

  //   return bol;
  // };

  getUserRec = async () => {
    let users = [];
    await this.firestoreUserRecommendationsRef
      .doc(this.state.user3)
      .collection("recommendedUsers")
      .doc(this.state.user3)
      .onSnapshot((doc) => {
        const res = doc.data();

        res.users.map((data, index) => {
          users.push(data.id);
        });
        this.setState({ userRec: users });
        console.log(this.state.userRec);

        this.viewUserRec();
      });
  };

  viewUserRec = () => {
    let userRecArray = [];
    let avatar =
      "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let name;
    let username;
    let bio, location, interestsArr;
    this.state.userRec.forEach((userId) => {
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          username = doc.data().username;
          name = doc.data().name;
          avatar =
            "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";

          bio = doc.data().bio;
          location = doc.data().location;
          interestsArr = doc.data().interestsArr;

          let userRecData = {
            userId: userId,
            username: username,
            name: name,
            bio: bio,
            location: location,
            interestsArr: interestsArr,
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/travycomsats.appspot.com/o/profilePics%2F(" +
              userId +
              ")ProfilePic?alt=media&token=69135050-dec6-461d-bc02-487766e1c81d",
          };

          userRecArray.push(userRecData);
          this.setState({ userRecData: userRecArray });
          console.log(this.state.userRecData);
        })
        .catch((err) => {
          alert(err);
        });
    });
  };

  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  //explorearoundme
  getPlacesUrl = (lat, long, radius, type) => {
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
    const location = `location=${lat},${long}&radius=${radius}`;
    const typeData = `&types=${type}`;

    const api = `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    return `${baseUrl}${location}${typeData}${api}`;
  };

  getPlaces = () => {
    const markers = [];
    //NEARBY PLACES
    // firebase
    //   .firestore()
    //   .collection("placesRecommendations")
    //   .doc(this.state.user3)
    //   .collection("recommendedPlaces")
    //   .doc(this.state.user3)

    firebase
      .firestore()
      .collection("userSuggestedPlaces")
      .doc(this.state.user3)
      .onSnapshot((doc) => {
        const res = doc.data();
        res.places.slice(0, 3).map((element, index) => {
          const marketObj = {};
          marketObj.id = element.id;
          // marketObj.icon = element.icon;
          marketObj.place_id = element.place_id;
          // marketObj.opening_hours = element.opening_hours;
          // marketObj.photoURL=element.photos[0].getUrl();
          marketObj.name = element.name;
          marketObj.photos = element.photos;
          marketObj.rating = element.rating;
          marketObj.vicinity = element.vicinity;
          marketObj.type = element.type;
          marketObj.marker = {
            latitude: element.marker.latitude,
            longitude: element.marker.longitude,
          };

          markers.push(marketObj);

          // if (marketObj.photos  ) {
          //   console.log(
          //     "ref ref ref ref: " + marketObj.photos[0].photo_reference
          //   );
          // }else console.log("no photototot")
        });

        this.setState({ places: markers });

        // console.log(this.state.places);
      });
  };

  render() {
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{ 
            // backgroundColor: "#f0f3f4", 
            // backgroundImage: "linear-gradient(to left top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #ad9ae2, #c09be1, #d19bde, #fb93be, #ff9693, #ffa86a, #dec055)"
            // backgroundImage: "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)"
            
          backgroundImage: "linear-gradient(to right bottom, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)"
            // backgroundImage: "  linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)",
        }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "20px" }}
          >
            <Row className="d-flex justify-content-center">
              <Col
                sm="2"
                md="2"
                lg="2"
                className="order-md-1  d-none d-lg-block"
                style={{
                  paddingTop: "200px",
                  padding: "5px",
                  paddingRight: "10px",
                }}
              >
                <Card
                  // className="shadow"
                  style={{
                    // position: "fixed",
                    top: "80px",
                    // left:"0px",
                    borderRadius: "6px",
                    backgroundColor:"transparent",
                    border:"0"
                    // transform:"translateX(-20%)"
                  }}
                >
                  <Link to="/heatmap">
                    <div className="hovereffect">
                      <span
                        className="font-italic font-weight-bold text-white"
                        style={{ textShadow:"3px 2px 5px rgba(0, 5, 9, 1)" }}
                      >
                        View friend's posts on Map
                      </span>
                      <img
                        className="img-responsive"
                        style={{
                          borderRadius: "3px",
                          width: "225px",
                          height: "350px",
                          display: "block",
                          objectFit: "cover",
                        }}
                        src={require("assets/img/brand/1.png")}
                        // src="https://icon2.cleanpng.com/20180614/upl/kisspng-heat-map-google-search-visualization-5b23314a2df702.3196096015290330341883.jpg"

                        alt=""
                      />

                      <div className="overlay" to="/heatmap" tag={Link}>
                        <h2>View Heatmaps</h2>

                        {/* <a href="#">View Heatmaps</a> */}
                      </div>
                    </div>
                  </Link>

                  {/* <Jumbotron
                    to="/heatmap"
                    tag={Link}
                    style={{ background: "transparent" }}
                  >
                    <p className="lead text-black">View Heatmap</p>
                  </Jumbotron> */}
                </Card>
              </Col>

              {this.noFriendsTimeline()}

              <Col
                sm="4"
                md="4"
                lg="4"
                className="order-md-3 d-none d-lg-block"
                style={{
                  paddingTop: "200px",
                  width: "100%",
                  // position: "sticky"
                }}
              >
                <Card
                  // className="shadow"
                  //  body
                  //  inverse
                  style={{
                    backgroundColor: "transparent",
                    position: "fixed",
                    width: "100%",
                    top: "175px",
                    border: "0",
                  }}
                >
                  {/* <Jumbotron
                    to="/explore"
                    tag={Link}
                    style={{ background: "transparent" }}
                  >
                    <p className="lead text-black">Explore Places</p>
                  </Jumbotron>{" "} */}

                  <div style={{ overflow: "auto" }}>
                    <div>
                      <Link to="/peopleyoumayknow">
                        <span
                          className="font-italic font-weight-bold text-white"
                          style={{ textShadow:"3px 2px 5px rgba(0, 5, 9, 1)"}}
                        >
                          People You May Know
                        </span>
                      </Link>
                    </div>

                    {this.state.userRecData
                      .slice(0, 2)
                      .map((user, postindex) => (
                        <div
                          // className="list-group list-group-chat list-group-flush"
                          key={postindex}
                          item={this.state.userRec}
                          style={{ backgroundColor: "transparent" }}
                        >
                          <a
                            href="javascript:;"
                            // className="list-group-item bg-gradient-white"
                            // className="list-group-item"
                            style={{
                              position: "relative",
                              display: "block",
                              padding: "1rem 1rem",
                              marginBottom: "-0.0625rem",
                            }}
                            onMouseOver={() => this.onHover(user.userId)}
                          >
                            <div className="media">
                              <Link to="/friend">
                                <img
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    display: "block",
                                    objectFit: "cover",
                                  }}
                                  className="rounded"
                                  // onMouseOver={() => this.onHover(user.userId)}
                                  src={user.avatar}
                                />
                              </Link>{" "}
                              <div className="media-body ml-2">
                                <div className="justify-content-between align-items-center">
                                  <h6 className="mb-0 text-black font-weight-bold">
                                    {user.name}{" "}
                                    <small className="text-white" 
                                    style={{textShadow:" 3px 2px 13px rgba(0, 0, 0, 0.38)"}}
                                    >
                                      {"     @"} {user.username}
                                    </small>
                                  </h6>
                                  <div>
                                    {/* <small className="text-white"> */}
                                    <span className="badge badge-success">
                                      {user.interestsArr[0]}
                                    </span>{" "}
                                    <span className="badge badge-success">
                                      {user.interestsArr[1]}
                                    </span>{" "}
                                    <span className="badge badge-success">
                                      {user.interestsArr[2]}
                                    </span>
                                    {/* </small> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                  </div>
                  {/* {this.state.userRecData.map((user, postindex) => (
                    <div
                      style={{ padding: "5px", zoom: "85%" }}
                      key={postindex}
                      item={this.state.userRec}
                    >
                      <Card
                        style={{
                          backgroundColor: "#F2F2F2",
                          borderColor: "#F2F2F2",
                          width: "30px",
                          height: "30px",
                        }}
                        classN
                        onMouseOver={() => this.onHover(user.userId)}
                      >
                        <img
                          style={{
                            width: "320px",
                            height: "250px",
                            display: "block",
                            objectFit: "cover",
                          }}
                          className="rounded"
                          src={user.avatar}
                        />
                        {user.name}
                      </Card>
                    </div>
                  ))} */}
                </Card>

                <div
                  style={{
                    paddingTop: "30px",
                  }}
                >
                  <Card
                    // className="shadow "
                    //  body
                    //  inverse
                    style={{
                      backgroundColor: "transparent",
                      // top: "175px",
                      border: "0",
                      //  backgroundColor: "#333", borderColor: "#333" ,
                      position: "fixed",
                      width: "100%",
                      top: "375px",
                    }}
                  >
                    <div style={{ overflow: "auto" }}>
                      <Link to="/explore">
                        <div>
                          <span
                            className="font-italic font-weight-bold text-white"
                            style={{  textShadow:"3px 2px 5px rgba(0, 5, 9, 1)" }}
                          >
                            Explore places
                          </span>
                        </div>
                      </Link>
                      {this.state.places.slice(0, 2).map((data, index) => (
                        <div
                          className="list-group list-group-chat list-group-flush"
                          key={index}
                          // style={{ backgroundColor: "transparent" }}
                        >
                          <a
                            href="javascript:;"
                            // className="list-group-item bg-gradient-white"
                            // className="list-group-item"
                            style={{
                              position: "relative",
                              display: "block",
                              padding: "1rem 1rem",
                              marginBottom: "-0.0625rem",
                            }}
                            // onMouseOver={() => this.onHover(user.userId)}
                          >
                            <div className="media">
                              <img
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                                className="rounded"
                                referrerPolicy="no-referrer"
                                src={
                                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=` +
                                  data.photos[0].photo_reference +
                                  `&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
                                }
                              />{" "}
                              <div className="media-body ml-2">
                                <div className="justify-content-between align-items-center">
                                  <h6 className="mb-0 text-black font-weight-bold">
                                    {data.name}{" "}
                                    <small className="text-white"
                                    style={{textShadow:" 3px 2px 13px rgba(0, 0, 0, 0.38)"}}
                                    >
                                      {data.vicinity}
                                    </small>
                                  </h6>
                                  <div>
                                    {/* <small className="text-white"> */}
                                    <span className="badge badge-info">
                                      {data.type[0]}
                                    </span>
                                    {/* </small> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
            {/* </div> */}
            {/* </div> */}
          </section>
          <SimpleFooter />
        </main>

      </>
    );
  }
}
export default Timeline;
