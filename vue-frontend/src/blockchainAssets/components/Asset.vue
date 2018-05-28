<template>
  <li :style="theme.item">
    <div :style="theme.item.title">Frame number: {{asset.uniqueAssetId}}</div>
  </li>
</template>

<script>
export default {
  name: "Asset",
  props: ["asset", "theme"]
};
</script>
