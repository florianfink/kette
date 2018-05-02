<template>
  <div :style="theme.container">
    <h1 :style="theme.h1">
      KETTE
    </h1>

    <div :style="theme.section">
      <h2 :style="theme.h2">Welcome</h2>
      <pre :style="theme.pre">

        You will find all your registered assets here.
      </pre>
    </div>
  </div>
</template>

<script>
import { AmplifyTheme } from '../amplify'

export default {
  name: 'Home',
  data () {
    return {
      theme: AmplifyTheme
    }
  }
}
</script>
