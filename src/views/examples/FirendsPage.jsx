import React from "react";

// reactstrap components
import { Button, Card, Container, Row, Col, Modal, Badge } from "reactstrap";
// import HttpsOutlinedIcon from '@material-ui/icons/HttpsOutlined';
// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import UserHeader from "components/Headers/UserHeader.jsx";
import { isUserSignedIn } from "../../services/authServices";
import * as firebase from "firebase";
// import PostModal from "components/Modal/postModal";
import Post from "../../components/post";
import { Redirect, Link } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
// import defModal from "components/Modal/defModal";
// import postModal from "components/Modal/postModal";
// import Modals from "components/Modal/Modals";

const friendId = JSON.parse(localStorage.getItem("Fuid"));
const currentUserUid = JSON.parse(localStorage.getItem("uid"));

class FriendsPage extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  // componentDidMount() {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   this.refs.main.scrollTop = 0;
  // }

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     friendId: JSON.parse(localStorage.getItem("Fuid")),
  //     currentUserUid: JSON.parse(localStorage.getItem("uid")),
  //     uid: friendId,
  //     profilePic:
  //       "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
  //     username: "",
  //     bio: "",
  //     name: "",
  //     email: "",
  //     posts: [],
  //     postCount: 0,
  //     following: false,
  //     loading: true,
  //     totalFollowers: "00"
  //     // showModal: false,
  //     // defaultModal: false
  //   };
  // }

  state = {
    friendId: JSON.parse(localStorage.getItem("Fuid")),
    currentUserUid: JSON.parse(localStorage.getItem("uid")),
    uid: friendId,
    profilePic:
      "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
    username: "",
    bio: "",
    name: "",
    email: "",
    posts: [],
    postCount: 0,
    following: false,
    pending: false,
    publicProfile: true,
    loading: true,
    followingList: [],
    followingListData: [],
    followerList: [],
    followerListData: [],
    // showModal: false,
    // defaultModal: false
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  componentWillMount = () => {
    // this.getFriendId().then(() => {
    //   this.getFriendList();
    //   this.getPosts();
    //   this.checkFollow();
    //   this.getProfilePic();
    // });
  };

  getFriendId = async () => {
    // this.state.friendId = JSON.parse(localStorage.getItem("Fuid"));
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.setState({ uid: JSON.parse(localStorage.getItem("Fuid")) });

    this.getFriendId().then(() => {
    this.getFriendList();
    this.checkFollow();
    this.getPosts();

    this.getProfilePic();
    });

    // this.redirectToHome();

    // this.getRealTimeUpdates();

    // this.getPermissionAsync();

    // this.checkFollow();
  }

  componentWillUnmount = () => {
    this.getFriendList();
    this.getFriendId();
  };

  getProfilePic = () => {
    // if (isUserSignedIn) {
    //   console.log(friendId);
    // }

    firebase
      .firestore()
      .collection("users")
      .doc(this.state.uid)
      .onSnapshot((doc) => {
        const res = doc.data();

        this.setState({
          username: res.username,
          bio: res.bio,
          name: res.name,
          email: res.email,
          publicProfile: res.publicProfile,
        });
      });
    // profile pic
    const firebaseProfilePic = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.uid + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // Inserting into an State and local storage incase new device:
        this.setState({ profilePic: url });
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              profilePic:
                "https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop",
            });
            break;
        }
        console.log(error);
      });
  };
  getPosts = () => {
    const cloudImages = [];
    firebase
      .firestore()
      .collection("posts")
      .doc(this.state.uid)
      .collection("userPosts")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let article = {
            username: this.state.username,
            userId: this.state.uid,
            title: "post",
            avatar: this.state.profilePic,
            image: doc.data().image,
            // cta: "cta",
            caption: doc.data().caption,
            location: doc.data().location.coordinates,
            locName: doc.data().location.locationName,
            postId: doc.data().postId,
            timeStamp: doc.data().time,
            // likes:0,
            locLatLng: "Address",
          };
          cloudImages.push(article);
        });
      });
    this.setState({ posts: cloudImages });
  };

  editprofile() {
    return <Redirect to="/edit-profile" tag={Link} />;
  }

  logOut() {
    localStorage.clear();
  }

  // checkFollow = () => {
  //   firebase
  //     .firestore()
  //     .collection("following")
  //     .doc(currentUserUid)
  //     .collection("userFollowing")
  //     .doc(friendId)
  //     .get()
  //     .then(snapshot => {
  //       if (snapshot.exists) {
  //         this.setState({ following: true });
  //       } else {
  //         this.setState({ following: false });
  //       }
  //     });
  // };

  checkFollow = async () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("following")
      .doc(this.state.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({ following: true, pending: false });
        }
      });

    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("sent")
      .doc(this.state.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.firestoreUsersRef
            .doc(this.state.uid)
            .collection("received")
            .doc(this.state.currentUserUid)
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
      .doc(this.state.currentUserUid)
      .collection("sent")
      .doc(this.state.uid)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.uid)
        .collection("received")
        .doc(this.state.currentUserUid)
        .delete()
        .then(() => {
          this.setState({ following: false, pending: false });
          console.log("pending: " + this.state.pending);
        });
  };

  unfollow = () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("following")
      .doc(this.state.uid)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.uid)
        .collection("followedBy")
        .doc(this.state.currentUserUid)

        .delete()

        .then(() => {
          this.setState({ following: false });
          console.log("UNFOLLOWED");
          console.log("pending: " + this.state.pending);
        });
  };

  follow = () => {
    //unknown private account
    if (!this.state.following && !this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("sent")
        .doc(this.state.uid)
        .set({
          userId: this.state.uid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.uid)
          .collection("received")
          .doc(this.state.currentUserUid)
          .set({
            userId: this.state.currentUserUid,
          })
          .then(() => {
            this.setState({ pending: true, following: false });
            console.log("follow request sent");
            // console.log("pending: " + this.state.pending);
          });
    }
    //unknown publicProfile account
    else if (!this.state.following && this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("following")
        .doc(this.state.uid)
        .set({
          userId: this.state.uid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.uid)
          .collection("followedBy")
          .doc(this.state.currentUserUid)
          .set({
            userId: this.state.currentUserUid,
          })
          .then(() => {
            this.setState({ following: true, pending: false });
            console.log("followed");
            // console.log("pending: " + this.state.pending);
          });
    }
  };

  renderFollow = () => {
    if (!this.state.following && !this.state.pending) {
      return (
        <Button
          className="mr-4"
          color="info"
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

  privateProfile = () => {
    if (!this.state.following && !this.state.publicProfile) {
      return (
        <div className="container-fluid bg-3 text-center">
          <h3 className="display-3 lead">
            This Account is Private{" "}
            <i className="fa fa-lock" aria-hidden="true"></i>
            {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
          </h3>
          <p className="lead description">
            Follow this account to see their posts.
          </p>

          <div className="row"></div>
        </div>
      );
    } else if (this.state.publicProfile || this.state.following) {
      return (
        <div className="container-fluid bg-3 text-center">
          <h3>Posts</h3>
          <div className="row">
            {this.state.posts.map((post, index) => (
              <Card
                className="col-sm-4"
                style={{ padding: "10px" }}
                key={index}
                onClick={() => {
                  this.setState({ modalItem: post });
                  this.setState({ defaultModal: true });
                }}
              >
                <img
                  src={post.image}
                  className="img-fluid"
                  alt=""
                  // style={{height:'98%'}}
                  // onClick={() => <Modals/>}
                />
              </Card>
            ))}
          </div>
        </div>
      );
    }
  };

  getFriendList = async () => {
    let following = [];
    let follower = [];
    await this.firestoreUsersRef
      .doc(this.state.uid)
      .collection("followedBy")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          follower.push(docSnap.id);
        });
      });
    await this.firestoreUsersRef
      .doc(this.state.uid)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          following.push(docSnap.id);
        });
      });
    this.setState({ followerList: follower, followingList: following });
    // console.log(this.state.followerList);
    // console.log(this.state.followingList);
    this.viewFriendListData();
  };

  viewFriendListData = () => {
    let followerArr = [];
    let Fravatar =
      "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let Frname;
    this.state.followerList.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          Frname = doc.data().username;

          let followerList = {
            userId: userId,
            Frname: Frname,
            Fravatar:
              "https://firebasestorage.googleapis.com/v0/b/travycomsats.appspot.com/o/profilePics%2F(" +
              userId +
              ")ProfilePic?alt=media&token=69135050-dec6-461d-bc02-487766e1c81d",
          };

          followerArr.push(followerList);
          this.setState({ followerListData: followerArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
        });
    });
    let followingArr = [];
    let avatar =
      "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let name, username;
    this.state.followingList.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          username = doc.data().username;
          name = doc.data().name;

          let followingList = {
            userId: userId,
            name: name,

            username: username,
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/travycomsats.appspot.com/o/profilePics%2F(" +
              userId +
              ")ProfilePic?alt=media&token=69135050-dec6-461d-bc02-487766e1c81d",
          };

          followingArr.push(followingList);
          this.setState({ followingListData: followingArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
        });
    });
  };

  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  // redirectToHome = () => {
  //   if(JSON.parse(localStorage.getItem("Fuid")) == null){
  //     return <Redirect to="/timeline" tag={Link} />;
  //   }
  //     }

  render() {
    // if (this.state.loading){
    //   return <div>My sweet spinner</div>;
    // }

    return (
      <>
        <UserNavbar />
        <main className="profile-page" ref="main">
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {/* SVG separator */}
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
          <section className="section mt--150">
            <Container>
              <Card className="card-profile shadow mt--300">
                <div className="px-4">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        {/* <a href="#pablo" onClick={(e) => e.preventDefault()}> */}
                        <img
                          style={{
                            width: "200px",
                            height: "200px",
                            display: "block",
                            objectFit: "cover",
                          }}
                          className="rounded-circle img-responsive"
                          alt="..."
                          src={this.state.profilePic}
                        />
                        {/* </a> */}
                      </div>
                    </Col>
                    <Col
                      className="order-lg-3 text-lg-right align-self-lg-center"
                      lg="4"
                    >
                      <div className="card-profile-actions py-4 mt-lg-0">
                        {/* <Button
                          className="mr-4"
                          color="info"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Follow
                        </Button>

                        <Button
                          onClick={this.toggleFollow}
                          className={
                            this.state.ifFollowed === true ? "fa fa-heart" : "fa fa-heart-o"
                          }
                        >

                          {" " }
                        </Button> */}

                        {this.renderFollow()}

                        {/* <Button
                          onClick={this.toggleFollow}
                          className={
                            this.state.following === true ? (
                              <Button
                                className="mr-4 fa fa-heart"
                                color="info"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                              >
                                " " 
                              </Button>
                            ) : (
                              <Button
                                className="mr-4 fa fa-heart-o"
                                color="outline-info"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                              >
                                
                              </Button>
                            )
                          }
                        >
                          {" " + this.state.likes}
                        </Button> */}
                      </div>
                    </Col>
                    <Col className="order-lg-1" lg="4">
                      <div
                        className="card-profile-stats d-flex justify-content-center"
                        onClick={() => this.toggleModal("notificationModal")}
                      >
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.posts.length}
                          </span>
                          <span className="description">Posts</span>
                        </div>
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.followerList.length}
                          </span>
                          <span className="description">Followers</span>
                        </div>
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.followingList.length}
                          </span>
                          <span className="description">Following</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center mt-5">
                    <h3>
                      {this.state.username}{" "}
                      {/* <span className="font-weight-light">, 27</span> */}
                    </h3>
                    {/* <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Bucharest, Romania
                    </div> */}
                    <div className="h6 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                      {this.state.bio}
                    </div>
                    {/* <div>
                      <i className="ni education_hat mr-2" />
                      University of Computer Science
                    </div> */}
                  </div>
                  <div className="mt-5 py-5 border-top text-center">
                    <Row className="justify-content-center">
                      <Col lg="11">
                        {this.privateProfile()}

                        {/* 
                        
                        <div className="container-fluid bg-3 text-center">
                          <h3>Posts</h3>
                          <div className="row">
                            {this.state.posts.map((post, index) => (
                              <Card
                                className="col-sm-4"
                                style={{ padding: "10px" }}
                                key={index}
                                onClick={() => {
                                  this.setState({ modalItem: post });
                                  this.setState({ defaultModal: true });
                                }}
                              >
                                <img
                                  src={post.image}
                                  className="img-fluid"
                                  alt=""
                                  // style={{height:'98%'}}
                                  // onClick={() => <Modals/>}
                                />
                              </Card>
                            ))}
                          </div>
                        </div> */}
                        {/* <a
                          href="#"
                          onClick={() => this.toggleModal("defaultModal")}
                        >
                          Show more
                        </a> */}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Container>
          </section>
        </main>

        <Modal
          size="lg"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          {" "}
          {this.state.modalItem && <Post item={this.state.modalItem} />}
        </Modal>

        <Modal
          className="modal-dialog-centered modal-danger"
          contentClassName="bg-gradient-danger"
          isOpen={this.state.notificationModal}
          toggle={() => this.toggleModal("notificationModal")}
          size="lg"
        >
          <div className="modal-header"></div>
          <Row>
            <Col>
              {" "}
              <ul>
                <h3 className="mb-0 text-white font-weight-bold">Following</h3>

                {
                  // this.state.followedUsers.map((followedUsers) => {
                  this.state.followingListData.map((user, postindex) => (
                    <li key={postindex} item={this.state.followingList}>
                      <Row
                      // className="justify-content-center"
                      >
                        <Col
                          lg="6"

                          onMouseOver={() => localStorage.setItem("Fuid", JSON.stringify(user.groupId))}
                          onClick={()=>{  window.location.reload(false) }
                          }

                        >
                          {/* <div className="card-profile-stats d-flex justify-content-center"> */}
                          {/* <p className="mb-0 text-black font-weight-bold">
                          <img
            alt="Image placeholder"
            className="media-comment-avatar avatar rounded-circle"
            style={{
              // width: "200px",
              // height: "200px",
              display: "block",
              objectFit: "cover",
            }}
            // src={this.state.profilePic}
            // className="rounded-circle img-responsive"

            src={user.avatar}
          />
                            {user.name}
                          </p> */}

                          <div
                            className="media media-comment"
                            style={{ margin: "5px" }}
                          >
                            <img
                              alt="Image placeholder"
                              className="media-comment-avatar avatar rounded-circle"
                              style={{
                                display: "block",
                                objectFit: "cover",
                                padding: "2px",
                                margin: "5px",
                              }}
                              src={user.avatar}
                            />
                            <div className="media-body">
                              <div className="media-comment-text">
                                <h4>
                                  <Badge
                                    color="secondary"
                                    style={{ padding: "2px" }}
                                  >
                                    {user.name}
                                  </Badge>
                                </h4>

                                <a href="/friend" class="description link">
                                  View profile
                                </a>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  ))
                }
              </ul>
            </Col>
            <Col>
              <ul>
                <h3 className="mb-0 text-white font-weight-bold">Followers</h3>

                {
                  // this.state.followedUsers.map((followedUsers) => {
                  this.state.followerListData.map((user, postindex) => (
                    <li key={postindex} item={this.state.followerList}>
                      <Row
                      // className="justify-content-center"
                      >
                        <Col
                          lg="6"

                          onMouseOver={() => localStorage.setItem("Fuid", JSON.stringify(user.groupId))}
                          onClick={()=>{  window.location.reload(false) }
                          }
                        >
                          {/* <div className="card-profile-stats d-flex justify-content-center"> */}
                          {/* <p className="mb-0 text-black font-weight-bold">
                          <img
            alt="Image placeholder"
            className="media-comment-avatar avatar rounded-circle"
            style={{
              // width: "200px",
              // height: "200px",
              display: "block",
              objectFit: "cover",
            }}
            // src={this.state.profilePic}
            // className="rounded-circle img-responsive"

            src={user.avatar}
          />
                            {user.name}
                          </p> */}

                          <div
                            className="media media-comment"
                            style={{ margin: "5px" }}
                          >
                            <img
                              alt="Image placeholder"
                              className="media-comment-avatar avatar rounded-circle"
                              style={{
                                display: "block",
                                objectFit: "cover",
                                padding: "2px",
                                margin: "5px",
                              }}
                              src={user.Fravatar}
                            />
                            <div className="media-body">
                              <div className="media-comment-text">
                                <h4>
                                  <Badge
                                    color="secondary"
                                    style={{ padding: "2px" }}
                                  >
                                    {user.Frname}
                                  </Badge>
                                </h4>
                                {/* <p className="description" onCLick={() => {}}>
                                  View profile
                                </p> */}
                                <a href="/friend" class="description link">
                                  View profile
                                </a>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </li>
                  ))
                }
              </ul>
            </Col>
          </Row>
          <div className="modal-footer">
            <Button
              className="text-white ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("notificationModal")}
            >
              Close
            </Button>
          </div>
        </Modal>

        <SimpleFooter />
      </>
    );
  }
}

export default FriendsPage;
