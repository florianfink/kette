<template>
  <div :style="theme.container">
    <h2 :style="theme.header">Assets</h2>
    <ul :style="theme.list">
      
      <an-asset
        v-for="asset in assets"
        :key="asset.uniqueAssetId"
        :asset="asset"
        :theme="theme"
      />
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import { API } from 'aws-amplify'

import BlockchainAssetsTheme from "../BlockchainAssetsTheme";
import Asset from "./Asset";

Vue.component("an-asset", Asset);

export default {
  name: "Assets",
  data() {
    return {
      theme: BlockchainAssetsTheme || {},
      assets: []
    };
  },
  created() {
    API.get("assets", "/assets").then(assets => {
      this.assets = assets;
    });
  }
};
</script>
