/*global google*/

import React, { Component } from "react";
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import {
  Card,
  CardBody,
  CardText,
  Alert,
  CardTitle,
  CardLink,
  CardSubtitle,
  Container,
  Badge,
  Row,
  Modal,
  Button,
  Jumbotron,
  ListGroup,
  ListGroupItem,
  UncontrolledAlert,
  Col,
} from "reactstrap";
import { firebase, auth } from "../../services/firebase";
import { Redirect, Link } from "react-router-dom";
const userId = JSON.parse(localStorage.getItem("uid"));
const fuid = JSON.parse(localStorage.getItem("Fuid"));

class ExploreAroundMe extends Component {
  user = firebase.auth().currentUser;
  firestoreUsersRef = firebase.firestore().collection("users");
  firestoreFollowingRef = firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("following");
  firestoreUserRecommendationsRef = firebase
    .firestore()
    .collection("userRecommendations")
    .doc(userId)
    .collection("recommendedUsers")
    .doc(userId);

  state = {
    user: JSON.parse(localStorage.getItem("uid")),
    fuid: JSON.parse(localStorage.getItem("Fuid")),
    alreadyFriendsCheck: false,
    userRec: [],
    userRecData: [],
    userLocation: "",
    following: false,
    pending: false,
    publicProfile: true,
    loading: true,
  };

  componentDidMount() {
    this.getUserRec();
  }

  componentWillMount() {
    // this.getUserRec().then(() => {
    //   this.viewUserRec();
    // });
  }

  //   getFriends = async () => {
  //     let users = [];
  //     await this.firestoreUsersRef
  //       .doc(this.state.userId)
  //       .collection("following")
  //       .get()
  //       .then((querySnapshot) => {
  //         querySnapshot.forEach((docSnap) => {
  //           users.push(docSnap.id);
  //         });
  //       });
  //     this.setState({ alreadyFriends: users });

  //   };

  alreadyFriends = (fuid) => {
    let bol = false;
    // let userIdTBC = JSON.stringify(fuid);
    this.firestoreFollowingRef
      .doc(fuid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          bol = true;
        }
      });

    return bol;
  };

  getUserRec = async () => {
    let users = [];
    await this.firestoreUserRecommendationsRef.onSnapshot((doc) => {
      const res = doc.data();

      res.users.map((data, index) => {
        if (!this.alreadyFriends(data.id)) {
          users.push(data.id);
        }
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

  getUserLoc = (lat, lng) => {
    let locString = "";

    var geocoder = new google.maps.Geocoder();
    var latlng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          locString = results[0].formatted_address;
          alert("User's Location: " + locString);
        } else {
          locString = "Location not available";
          alert("User's Location: " + locString);
        }
      }
    });
    return;
  };

  follow = () => {
    //unknown private account
    if (!this.state.following && !this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.userId)
        .collection("sent")
        .doc(this.state.fuid)
        .set({
          userId: this.state.fuid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.fuid)
          .collection("received")
          .doc(this.state.userId)
          .set({
            userId: this.state.userId,
          })
          .then(() => {
            this.setState({ pending: true, following: false });
            console.log("follow request sent");
            console.log("pending: " + this.state.pending);
          });
    }
    //unknown publicProfile account
    else if (!this.state.following && this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.userId)
        .collection("following")
        .doc(this.state.fuid)
        .set({
          userId: this.state.fuid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.fuid)
          .collection("followedBy")
          .doc(this.state.userId)
          .set({
            userId: this.state.userId,
          })
          .then(() => {
            this.setState({ following: true, pending: false });
            console.log("followed");
            console.log("pending: " + this.state.pending);
          });
    }
  };

  renderFollow = () => {
    if (!this.state.following && !this.state.pending) {
      return (
        <Button
          className="mr-4"
          color="outline-info"
          size="sm"
          // shadowless={false}
          onClick={() => this.follow()}
        >
          Follow
        </Button>
      );
    } else if (this.state.pending && !this.state.following) {
      return (
        <Button
          className="mr-4"
          // color="info"
          size="sm"
          // shadowless={false}
          onClick={() => this.cancelRequest()}
        >
          Request Sent <i className="ni ni-fat-remove" />
        </Button>
      );
    } else if (this.state.following && !this.state.pending) {
      return (
        <>
          <Button
            className="mr-4"
            color="outline-info"
            size="sm"
            onClick={() => this.unfollow()}
          >
            Following
          </Button>
          <Link to="/chat">
            <Button className="mr-4" color="outline-success" size="sm">
              Message
            </Button>
          </Link>
        </>
      );
    }
  };

  checkFollow = () => {
    this.firestoreUsersRef
      .doc(this.state.userId)
      .collection("following")
      .doc(this.state.fuid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({ following: true, pending: false });
        }
      });

    this.firestoreUsersRef
      .doc(this.state.userId)
      .collection("sent")
      .doc(this.state.userId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.firestoreUsersRef
            .doc(this.state.userId)
            .collection("received")
            .doc(this.state.userId)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                this.setState({ following: false, pending: true });
              } else {
                this.setState({ pending: false });
              }
            });
        }
      });
  };

  cancelRequest = () => {
    this.firestoreUsersRef
      .doc(this.state.userId)
      .collection("sent")
      .doc(this.state.userId)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.userId)
        .collection("received")
        .doc(this.state.userId)
        .delete()
        .then(() => {
          this.setState({ following: false, pending: false });
          console.log("pending: " + this.state.pending);
        });
  };

  unfollow = () => {
    this.firestoreUsersRef
      .doc(this.state.userId)
      .collection("following")
      .doc(this.state.fuid)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.fuid)
        .collection("followedBy")
        .doc(this.state.userId)

        .delete()

        .then(() => {
          this.setState({ following: false });
          console.log("UNFOLLOWED");
          console.log("pending: " + this.state.pending);
        });
  };

  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  render() {
    return (
      <>
        <UserNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            <div className="shape shape-style-3  shape-dark alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section mt--200">
            <Container className="mt--300 pb-5" fluid>
              <Row
                style={{
                  marginRight: "30px",
                  marginBottom: "5px",
                  marginLeft: "30px",
                }}
              >
                <Col>
                  <Card style={{borderRadius:"77px"}}>
                    {/* <div className="row justify-content-center" > */}
                      <h4 className="text-center lead">People You May Know</h4>
                    {/* </div> */}
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="row justify-content-center">
                    {this.state.userRecData.map((user, postindex) => (
                      <div
                        style={{ padding: "5px", zoom: "85%" }}
                        key={postindex}
                        item={this.state.userRec}
                      >
                        <Card className="shadow"
                          style={{
                            // backgroundColor: "#F2F2F2",
                            borderColor: "#F2F2F2",
                            width: "320px",
                            height: "600px",
                            borderRadius:"48px"
                          }}
                          onMouseOver={() => this.onHover(user.userId)}
                        >
                          <img
                            style={{
                              width: "320px",
                              height: "280px",
                              // display: "block",
                              objectFit: "cover",
                              borderTopLeftRadius:"50px",
                              borderTopRightRadius:"50px"
                            }}
                            // className="rounded"
                            src={user.avatar}
                          />
                          <CardBody>
                            <CardTitle>{user.name}</CardTitle>
                            <CardSubtitle>
                              <p className="description text-capitalize">
                                {" "}
                                {user.bio}{" "}
                              </p>

                              <h6 className="description">Interests:</h6>
                              <p className="description text-capitalize">
                                {user.interestsArr.slice(0,3).map((data, index) => (
                                  <Badge
                                    className="text-uppercase"
                                    color="success"
                                    pill
                                  >
                                    {data}
                                  </Badge>
                                ))}
                              </p>
                              <h6 className="description">
                                <span>
                                  {" "}
                                  Last seen at: {user.location.lastSeen}{" "}
                                </span>
                              </h6>
                              <CardText>
                                {" "}
                                <a
                                  href="#"
                                  className="description"
                                  onClick={() => {
                                    this.getUserLoc(
                                      user.location.latitude,
                                      user.location.longitude
                                    );
                                  }}
                                >
                                  Click to know user's location
                                </a>{" "}
                              </CardText>
                            </CardSubtitle>
                          </CardBody>

                          <CardBody>
                            {this.renderFollow()}
                            {/* <Button
                              className="mr-4"
                              color="outline-info"
                              size="sm"
                              //   onClick={}
                            >
                              Send Request
                            </Button> */}{" "}
                            <Button
                              className="mr-4"
                              color="outline-danger"
                              size="sm"
                              //   onClick={}
                            >
                              View Profile
                            </Button>
                          </CardBody>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
        <SimpleFooter />
      </>
    );
  }
}
export default ExploreAroundMe;
