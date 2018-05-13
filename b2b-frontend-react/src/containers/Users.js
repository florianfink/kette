import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
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
    if(!firstApiKey) return;

    const apiKey = firstApiKey.apiKey;
    try {
      const init = {
        headers: {
          'x-api-key': apiKey
        }
      };
      const response = await fetch("https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev/users", init)
      const users = await response.json();
      this.setState({ users });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  handleApiKeyClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderApiKeysList(users) {
    return users.map(
      (user) =>
        <ListGroupItem
          key={user.userId}
          header={user.userId}
        />
    );
  }

  render() {
    return (
      <div className="apiKeys">
        <PageHeader>Users created with your API key</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderApiKeysList(this.state.users)}
        </ListGroup>
      </div>
    );
  }
}
