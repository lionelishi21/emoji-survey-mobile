<template>
<div class="">
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
  export default {
    
  }
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
