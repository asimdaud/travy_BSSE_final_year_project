import React from "react";
import moment from "moment";
// reactstrap components
import { Button, Card, Container, Row, Col, Modal, Badge } from "reactstrap";
// import SmoothImage from "react-smooth-image";
// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import UserHeader from "components/Headers/UserHeader.jsx";
import { isUserSignedIn } from "../../services/authServices";
import * as firebase from "firebase";
// import PostModal from "components/Modal/postModal";
import Post from "../../components/post";
import PostPicOnly from "../../components/postPicOnly";
import { Redirect, Link } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
// import defModal from "components/Modal/defModal";
// import postModal from "components/Modal/postModal";
// import Modals from "components/Modal/Modals";

// const user3 = JSON.parse(localStorage.getItem("uid"));

// user3 ? console.log("cSAnt") : console.log("lll");

// const ModalPost = ({showM, handleClose})=> {

//   // const {showM, handleClose} = this.props;

//       // const [modal, setModal] = useState(false);

//       // const toggle = () => setModal(!modal);

//       return (
//       <div>
//         {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
//         <Modal
//         isOpen={showM}
//         >
//           <ModalHeader >Modal title</ModalHeader>
//           <ModalBody>
//   <Post/>
//           </ModalBody>
//           <ModalFooter>
//             {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
//             <Button color="secondary" onClick={handleClose}>Cancel</Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     );

//   }

// const onMouseOver = event => {
// event.target.style.color = "#f7f7f7";
// };

// const onMouseOut = event => {
//   event.target.style.color = "#f7f7f7";
// };

class Profile extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");

  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic:
        "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      posts: [],
      loading: true,
      followingList: [],
      followingListData: [],
      followerList: [],
      followerListData: [],
      // showModal: false,
      defaultModal: false,
      modalItem: "",
    };
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  //   componentWillMount =   () => {

  //     // this.getFollowedUsers();
  //     this.getPosts();
  // this.getProfilePic();

  //       this.getFollowedUsers();

  //   };
  componentDidMount() {
    localStorage.setItem("groupId", JSON.stringify("TCeQwxQ2DprIpZpr431V"));

    this.getFriendList();
    this.getPosts();
    this.getProfilePic();
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  componentWillUnmount() {
    // this.getFollowCount();
    // this.getPosts();
    // this.getProfilePic();
  }

  getProfilePic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user3)
      .onSnapshot((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            username: res.username,
            bio: res.bio,
            name: res.name,
            email: res.email,
          });
        }
        // console.log(res);
      });
    // profile pic
    const firebaseProfilePic = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // Inserting into an State and local storage incase new device:
        this.setState({ profilePic: url });
        console.log(url);
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              profilePic:
                "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
            });
            break;
          default:
        }
        console.log(error);
      });
  };
  getPosts = () => {
    const cloudImages = [];
    this.firestorePostRef
      .doc(this.state.user3)
      .collection("userPosts")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let article = {
            username: this.state.username,
            userId: this.state.user3,
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

  getFriendList = async () => {
    let following = [];
    let follower = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("followedBy")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          follower.push(docSnap.id);
        });
      });
    await this.firestoreUsersRef
      .doc(this.state.user3)
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
          alert(err);
        });
    });
    let followingArr = [];
    let avatar =
      "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let name;
    this.state.followingList.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          name = doc.data().username;

          let followingList = {
            userId: userId,
            name: name,
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
          alert(err);
        });
    });
  };

  editprofile() {
    return <Redirect to="/edit-profile" tag={Link} />;
  }

  logOut() {
    localStorage.clear();
  }

  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  onMouseOverColor = (event) => {
    event.target.backgroudColor = "#FFFFFF";
  };

  render() {
    // if (this.state.loading){
    //   return <div>My sweet spinner</div>;
    // }
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{ 
            // backgroundColor: "#f0f3f4", 
            // backgroundImage: "linear-gradient(to left top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #ad9ae2, #c09be1, #d19bde, #fb93be, #ff9693, #ffa86a, #dec055)"
            backgroundImage: "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)"
            // backgroundImage: "  linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)",
        }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "200px" }}
          >
                        <Container>
              <Card className="card-profile shadow">
                <div className="px-4">
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            style={{
                              width: "200px",
                              height: "200px",
                              display: "block",
                              objectFit: "cover",
                            }}
                            className="rounded-circle img-responsive"
                            src={this.state.profilePic}
                          />
                        </a>
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
                        </Button> */}
                        <Button
                          className="float-right"
                          color="default"
                          size="sm"
                          to="/edit-profile"
                          tag={Link}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </Col>
                    <Col className="order-lg-1" lg="4">
                      <div
                        className="card-profile-stats d-flex justify-content-center"
                        onClick={() => this.toggleModal("notificationModal")}
                        // onMouseEnter={event => onMouseOver(event)}
                        // onMouseOut={event => onMouseOut(event)}
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

                {this.state.followingListData.map((user, postindex) => (
                  <li key={postindex} item={this.state.followingList}>
                    <Row
                    // className="justify-content-center"
                    >
                      <Col lg="6" onMouseOver={() => this.onHover(user.userId)}>
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
                              {/* <p className="description" onCLick={()=>{}}>View profile</p> */}

                              <Link to="/friend">
                                <a class="description link">View profile</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Col>
            <Col>
              <ul>
                <h3 className="mb-0 text-white font-weight-bold">Followers</h3>

                {this.state.followerListData.map((user, postindex) => (
                  <li key={postindex} item={this.state.followerList}>
                    <Row
                    // className="justify-content-center"
                    >
                      <Col lg="6" onMouseOver={() => this.onHover(user.userId)}>
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
                              {/* <p className="description" onCLick={()=>{}}>View profile</p> */}
                              <Link to="/friend">
                                <a class="description link">View profile</a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </li>
                ))}
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

        <Modal
          size="md"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          {" "}
          {this.state.modalItem && <PostPicOnly item={this.state.modalItem} />}
        </Modal>
        <SimpleFooter />
      </>
    );
  }
}

export default Profile;
