<template>
  <div class="flex justify-center items-center bg-slate-900/70 w-full h-full fixed z-50">
    <div class="column">
      <div class="flex items-center h-10 mb-1">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <span> Loading </span>
    </div>
  </div>
</template>

<style scoped>
.line {
  height: 0px;
  width: 5px;
  margin: 0 3px;
  border-radius: 10px;
  background-color: white;
  animation: loading 1s linear infinite;
  transform-origin: center;
}

.line:nth-child(2) {
  animation-delay: 0.1s;
}
.line:nth-child(3) {
  animation-delay: 0.2s;
}
.line:nth-child(4) {
  animation-delay: 0.3s;
}
.line:nth-child(5) {
  animation-delay: 0.4s;
}
.line:nth-child(6) {
  animation-delay: 0.5s;
}
.line:nth-child(7) {
  animation-delay: 0.6s;
}
.line:nth-child(8) {
  animation-delay: 0.7s;
}
.line:nth-child(9) {
  animation-delay: 0.8s;
}
.line:nth-child(10) {
  animation-delay: 0.9s;
}

@keyframes loading {
  0% {
    height: 3px;
  }
  50% {
    height: 40px;
  }
  100% {
    height: 3px;
  }
}
</style>