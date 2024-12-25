<template>
  <div>
    <ul class="steps">
      <li class="active"></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <ul class="steps-line1">
      <li class="active">hhh</li>
      <li>2222</li>
      <li>333</li>
      <li>444</li>
      <li>555</li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
/* 进度条 */
.steps,.steps-line1 {
  position: relative;
  counter-reset: step;
  width: 840px;
  margin: 0 auto;
  margin-top: 20px;
}
.steps-line1 li,.steps li {
  list-style-type: none;
  font-size: 12px;
  text-align: center;
  width: 20%;
  position: relative;
  color: #999;
  z-index: 2;
  float: left;
}
.steps li:before {
  display: block;
  content: counter(step);
  counter-increment: step;
  width: 24px;
  height: 24px;
  background-color: #fff;
  line-height: 24px;
  border-radius: 50%;
  font-size: 14px;
  color: #999;
  text-align: center;
  font-weight: 700;
  margin: 0 auto 8px auto;
  border: 1px #e5e5e5 solid;
}
.steps li:after {
  content: "";
  width: 100%;
  height: 1px;
  background-color: #b3b3b3;
  position: absolute;
  left: 0;
  top: 15px;
  z-index: -1;
}
.steps li:first-child {
  z-index: 3;
}
.steps li:last-child {
  z-index: 1;
}
.steps li:first-child:after {
  width: 50%;
  left: 50%;
}
.steps li:last-child:after {
  width: 50%;
}
.steps li.active:before {
  color: #fff;
}
.steps li.active:before,
.steps li.active:after {
  background-color: #3277df;
}
</style>