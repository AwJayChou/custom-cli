<template>
    <div v-bind:class="{'my_scroll_container':true}" 
       @scroll="getScroll" 
       :style="`${scrollX==='true'||
            scrollX===true?'overflow-x:scroll;overflow-y:hidden':''};${scrollY==='true'||
            scrollY===true?'overflow-x:hidden;overflow-y:scroll':''};`"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        scrollX:{
        type:[String,Boolean],
        value:false
        },
        scrollY:{
        type:[String,Boolean],
        value:false
        }
    },
    data() {
        return {
        scrollTop: 0
        };
    },
    methods: {
        //滚动事件
        getScroll(e) {
          let wScrollY = e.target.scrollTop; // 当前滚动条位置
          this.scrollTop = wScrollY;
          let wInnerH = e.target.clientHeight; // 设备窗口的高度（不会变）
          let bScrollH = e.target.scrollHeight; // 元素总高度
          if (wScrollY + wInnerH >= bScrollH) {
             this.$emit("reachBottom");
          }
        }
    },
    activated() {
        this.$el.scrollTop = this.scrollTop;
        this.$emit('getScrollTop',{scrollTop:this.scrollTop});
    },
    updated() {},
    mounted() {}
};
</script>
<style scoped>
.my_scroll_container{
   width: 100%;
  height: 250px;
}
</style>