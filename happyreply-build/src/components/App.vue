<template>
<div class="">
    <router-view></router-view>
</div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>

 // @import '../styles/index.scss';

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
