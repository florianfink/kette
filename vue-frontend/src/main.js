/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Amplify, { Auth, Logger } from 'aws-amplify'

Vue.config.productionTip = false

// Hannes kann nicht kämpfen
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
})

Amplify.Logger.LOG_LEVEL = 'DEBUG'

const logger = new Logger('main')

Auth.currentUserInfo()
  .then(user => logger.debug(user))
  .catch(err => logger.debug(err))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
