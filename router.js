import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import Cam from './src/Components/Cam';
import Complete from './src/Components/RecordingComplete';
import Dashboard from './src/Components/Dashboard';
import Login from './src/Components/Login';
import ImportAccount from './src/Components/ImportAccount';
import AccountCreated from './src/Components/AccountCreated';
import MyStore from './src/Components/MyStore'
import VideoPlayer from './src/Components/VideoPlayer'
import TransferOwnership from './src/Components/TransferOwnership';
import LinkEmail from './src/Components/LinkEmail';
const img = require('./src/AppAssets/timer.png');
import { AsyncStorage } from 'react-native'
import SendMail from './src/Components/SendMail';
import PendingRequests from './src/Components/PendingRequests';

const MyRouter = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="login"
          component={Login}
          title="Login"
          // hideNavBar
          initial
        />
        <Scene key="mystore"
          component={MyStore}
          title="My Store"
        // hideNavBar
        // initial
        />
        <Scene key="link"
          component={LinkEmail}
          title="Link Email"
        // hideNavBar
        // initial
        />
        <Scene key="transfer"
          component={TransferOwnership}
          title="Transfer Ownership"
        // hideNavBar
        // initial
        />

        <Scene key="pendingrequests"
          component={PendingRequests}
          title="Pending Requests"
        // hideNavBar
        // initial
        />
        <Scene key="videoplayer"
          component={VideoPlayer}
          title="Player"
        // hideNavBar
        // initial
        />
        <Scene key="importAccount"
          component={ImportAccount}
          title="Import Account"
        // hideNavBar
        // initial
        />
        <Scene key="created"
          component={AccountCreated}
          title="Account Created"
        // hideNavBar
        // initial
        />
        <Scene key="video"
          component={Cam}
          hideNavBar
        // initial
        />
        <Scene key="sendmail"
          component={SendMail}
          title = "Send Email"
          // hideNavBar
        // initial
        />
        <Scene key="dashboard"
          component={Dashboard}
          title="Dashboard"
          rightTitle="Logout"
          // rightButtonImage = {img}
          onRight={async () => {
            console.log('right');
            try {
              console.log('trying');
              AsyncStorage.setItem('wallet', '').then(() => {
                console.log('returning');
                Actions.reset('login');
              })
            } catch (err) {
              console.log(err);
            }
          }}
        // hideNavBar
        // initial
        />
        <Scene key="complete"
          component={Complete}
          title="Recording Complete"
        // hideNavBar
        // initial
        />
      </Scene>
    </Router>
  );
}

export default MyRouter;