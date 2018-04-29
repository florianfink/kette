import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:7def8cb7-a390-4ba8-a3c3-63fb2f85290b',
    region: 'us-east-1',
    userPoolId: 'us-east-1_ptfudUdBB',
    userPoolWebClientId: '5m7rkuhq4bqv6e0bh2i6c03k6l',
  },
  API: {
    endpoints: [
      {
        name: "assets",
        endpoint: "https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev",
        region: "us-east-1"
      },
    ]
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      assets: []
    }
  }
  async componentDidMount() {

    const assets = await Amplify.API.get("assets", "/assets");
    this.setState({
      assets: assets
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {this.state.assets.map((asset) => {
          return asset.uniqueAssetId;
        })}
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default withAuthenticator(App);
