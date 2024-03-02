<template>
  <div>
    <van-button @click="hanldeClick">打开弹窗</van-button>
    <ba-tree-picker
      ref="treePicker"
      :multiple="true"
      @select-change="selectChange"
      title="选择属地"
      :localdata="copyAreaOptions"
      valueKey="id"
      :textKey="label"
      childrenKey="children"
      :selectedData="[1,2,4]"
    />
  </div>
</template>
 
<script>
import baTreePicker from "@/components/tree-picker1/ba-tree-picker.vue";
export default {
  components: {
    baTreePicker,
  },
  data() {
    return {
      copyAreaOptions: [],
      label: "name",
    };
  },
  created() {

    this.getTreeselect();
  },
  mounted() {
    window.tree = this.$refs.treePicker
  },
  methods: {
    hanldeClick() {
        this.$refs.treePicker._show();
    },
    // 显示选择器
    showPicker() {
      this.$refs.treePicker._show();
    },
    /** 查询下拉树结构 */
    getTreeselect() {
      //接口数据
      this.copyAreaOptions = [
        {
          name: "list1",
          id: 1,
          children: [
            {
              name: "list2",
              // pid: 1,
              id: 2,
              children: [
                {
                  name: "层级3",
                  id: "3-1",
                },
              ],
            },
            {
              name: "list3",
              // pid: 1,
              id: 4,
            },
          ],
        },
        {
          name: "list110",
          id: 10,
        }
      ];
    // this.copyAreaOptions = [
    //     {
    //       name: "list1",
    //       id: 1,
    //     },
    //     {
    //       name: "list2",
    //       id: 2,
    //     },
    //     {
    //       name: "list3",
    //       id: 3,
    //     },
    //   ];
    },
    //监听选择（ids为数组）
    selectChange(ids, names) {
      console.log(ids, names);
    },
  },
};
</script>