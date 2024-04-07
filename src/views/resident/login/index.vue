<script lang="ts" setup>
import SingIn from "./sign-in.vue";
const styleIcon = {
  width: "400px",
  height: "500px",
  fontSize: "18px",
};
</script>
<template>
  <div class="login flex-center">
    <div class="login-center flex-center">
      <div class="login-left-img">
        <SvgIcon :styleIcon="styleIcon" iconName="#login-bg" />
      </div>
      <div class="login-right-input">
        <div class="login-title">
          <div class="title-welcome">welcome!</div>
          <div class="title-sign">Sign in to your Account</div>
        </div>
        <SingIn />
      </div>
    </div>
    <div class="left-buttom-circle circle-bgc-1" />
    <div class="left-buttom-circle circle-bgc-2" />
    <div class="left-buttom-circle circle-bgc-3" />
    <div class="left-buttom-circle circle-bgc-4" />
  </div>
</template>
<style lang="scss" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(to bottom right, #2282fe, #4193ff);
  .login-center {
    position: relative;
    width: 800px;
    height: 500px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 8px 8px 5px 3px rgba(187, 187, 204, 0.3);
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-name: show;
    z-index: 1000;
    .login-left-img,
    .login-right-input {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      .login-title {
        margin-top: 40px;
        text-align: center;
        .title-welcome {
          font-size: 40px;
          color: #35769c;
        }
        .title-sign {
          color: #87cbf8;
          font-size: 16px;
        }
      }
    }
  }

  .circle-bgc-1 {
    width: 800px;
    height: 800px;
    z-index: 2;
    background-color: rgba(43, 133, 252, 1);
  }
  .circle-bgc-2 {
    width: 650px;
    height: 650px;
    z-index: 3;
    background-color: rgba(43, 133, 252, 0.8);
  }
  .circle-bgc-3 {
    width: 500px;
    height: 500px;
    z-index: 4;
    background-color: rgba(43, 133, 252, 0.6);
  }
  .circle-bgc-4 {
    width: 350px;
    height: 350px;
    z-index: 5;
    background-color: rgba(43, 133, 252, 0.4);
  }
  .left-buttom-circle {
    position: absolute;
    border-radius: 50%;
    transform: translate(-40%, 40%);
    left: 0;
    bottom: 0;
    box-shadow: 3px 0px 18px 4px rgba(3, 3, 3, 0.2);
  }
}
@keyframes show {
  0% {
    box-shadow: 4px 5px 4px 3px rgba(187, 187, 204, 0.2);
  }
  50% {
    box-shadow: 4px 5px 4px 3px rgba(187, 187, 204, 0.6);
  }
  100% {
    box-shadow: 4px 5px 4px 3px rgba(187, 187, 204, 0.2);
  }
}
</style>
