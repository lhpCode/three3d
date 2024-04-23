<template>
  <div class="card">
    <div class="card-border" />
    <div class="conter">
      <div class="title">
        <slot name="title" />
      </div>

      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.card {
  // height: 100px;
  height: auto;
  position: relative;
  .conter {
    padding: 10px;
    position: relative;
    z-index: 10;
    color: #fff;
    .title {
      position: relative;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #56bce7;
      height: 26px;
      &::before {
        margin-left: 10px;
        margin-right: 5px;
        display: flex;
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #56bce7;
      }
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        content: "";
        width: 13px;
        height: 13px;
        border-top: 1px solid #56bce7;
        border-left: 1px solid #56bce7;
      }
    }
  }
  &:hover {
    .card-border {
      box-shadow: 0px 0px 8px 0px rgba(255, 255, 255, 0.8);
    }
  }
}

.card-border {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 10px;
  overflow: hidden;
  background-color: #195ccf;
  color: #fff;
  box-sizing: border-box;
  z-index: 0;
  opacity: 0.8;

  &::before {
    position: absolute;
    display: inline-block;
    content: "";
    width: 200%;
    height: 20%;
    top: 50%;
    left: -50%;
    background-color: #4cc6f3;
    animation-duration: 10s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: borderFrames;
    transform: translate(-50%, -50%);
    z-index: -6;
  }
  &::after {
    position: absolute;
    display: inline-block;
    content: "";
    top: 2px;
    left: 2px;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    // background-color: rgba($color: #020613, $alpha: 1);
    background-color: rgba(1, 32, 94, 1);
    border-radius: 5px;
    z-index: -2;
  }
}
@keyframes borderFrames {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
