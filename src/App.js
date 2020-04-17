import React from "react";
import NavBar from "./components/NavBar/NavBar";
import profile from "./assets/logo-white.svg";
import logo1 from "./assets/logo-black.svg";


class App extends React.Component {
  state = {
    profilePicture: profile,
    firstName: "Mihail",
    lastName: "Postica",
    messages: [{ id: 1, whoLastMessaged: true, profilePicture: logo1, read: true, time: "18:53", lastMessage: "Helloo", firstName: "Zina", lastName: "Postica" },
    { id: 2, whoLastMessaged: true, profilePicture: logo1, read: true, time: "18:53", lastMessage: "Helloo", firstName: "David", lastName: "Sima" },
    { id: 3, whoLastMessaged: true, profilePicture: logo1, read: true, time: "18:53", lastMessage: "Helloo", firstName: "Zina", lastName: "Postica" }],
    notifications: [{ id: 3, profilePicture: logo1, time: "18:53", action: "Liked your picture", firstName: "Misa", lastName: "Postica" },
    { id: 1, profilePicture: logo1, time: "18:53", action: "Liked your picture", firstName: "Zina", lastName: "Postica" },
    { id: 2, profilePicture: logo1, time: "18:53", action: "Liked your picture", firstName: "David", lastName: "Sima" }],
    friendRequests: [{ id: 1, profilePicture: logo1, firstName: "Zina", lastName: "Postica" },
    { id: 2, profilePicture: logo1, firstName: "David", lastName: "Sima" },
    { id: 3, profilePicture: logo1, firstName: "Mihail", lastName: "Postica" }]
  }
  render() {
  return(
    <header >
      <NavBar 
      firstName={this.state.firstName}
      lastName={this.state.lastName}
      profilePicture={this.state.profilePicture}
      messages={this.state.messages}
      notifications={this.state.notifications}
      friendRequests={this.state.friendRequests} 
      />
    </header>
  );
}
}

export default App;
