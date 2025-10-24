<template lang="pug">
.layoutFooter
  .container {{ '本服务由湖北省广播电视局提供' }}
</template>

<script setup lang="ts" name="CommonFooter"></script>

<style lang="scss" scoped>
.layoutFooter {
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  .container {
    color: #9e9e9e;
  }
}
</style>
