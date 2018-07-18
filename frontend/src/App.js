import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure({
  Auth: {
    identityPoolId: 'eu-central-1:44cb3772-bc89-4f1b-9071-a92df07e861d',
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_m6GXL0kiz',
    userPoolWebClientId: '3qhh4nkqbpkjk6oippehtvbq3l',
  },
  API: {
    endpoints: [
      {
        name: "assets",
        endpoint: "https://8lc7n8q4ml.execute-api.eu-central-1.amazonaws.com/dev",
        region: "eu-central-1"
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
