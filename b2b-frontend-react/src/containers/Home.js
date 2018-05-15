import React, { Component } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      apiKeys: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const apiKeys = await this.apiKeys();
      this.setState({ apiKeys });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  apiKeys() {
    return API.get("apiKeys", "/apiKeys");
  }

  handleApiKeyClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderApiKeysList(apiKeys) {
    return [{}].concat(apiKeys).map(
      (apiKey, i) =>
        i !== 0
          ? <ListGroupItem
            key={apiKey.apiKey}
            header={apiKey.apiKey}
          >
          </ListGroupItem>
          : <ListGroupItem
            key="new"
            href="/apiKeys/new"
            onClick={this.handleApiKeyClick}
          >
            <h4>
              <b>{"\uFF0B"}</b> Create a new API key
              </h4>
          </ListGroupItem>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Dashboard</h1>
        <p>KETTE Dashboard</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  renderApiKeys() {
    return (
      <div className="apiKeys">
        <PageHeader>Your API key</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderApiKeysList(this.state.apiKeys)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderApiKeys() : this.renderLander()}
      </div>
    );
  }
}
