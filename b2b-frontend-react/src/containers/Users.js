import React, { Component } from "react";
import { API } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";

export default class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      users: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    const apiKeys = await API.get("apiKeys", "/apiKeys");
    const firstApiKey = apiKeys[0];
    if (!firstApiKey) {
      this.setState({ isLoading: false });
      return
    };

    const apiKey = firstApiKey.apiKey;
    try {
      const init = {
        headers: {
          'x-api-key': apiKey
        }
      };
      const response = await fetch("https://api.kette.io/dev/users", init)
      const users = await response.json();
      this.setState({ isLoading: false, users: users });
    } catch (e) {
      this.setState({ isLoading: false });
      alert(e);
    }
  }

  renderApiKeysList(users) {
    return (
      users.map((user) =>
        <ListGroupItem
          key={user.Username}
          header={user.UserAttributes[3].Value}
        />
      ));
  }

  renderLoading() {
    return <ListGroupItem key="Key" header="Loading ..." />
  }

  render() {
    return (
      <div className="apiKeys">
        <PageHeader>Users created with your API key</PageHeader>
        <ListGroup>
          {this.state.isLoading ? this.renderLoading() : this.renderApiKeysList(this.state.users)}
        </ListGroup>
      </div>
    );
  }
}
