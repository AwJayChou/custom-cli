<template>
  <div>
    <van-sticky :container="container">
      <van-search show-action placeholder="请输入搜索关键词" />
    </van-sticky>
    <div>
      <!-- @change="toggle"
          @click="onClick" -->
      <!-- <van-sticky offset-top="50">
        <van-checkbox-group v-model="mainCheck">
          <van-checkbox shape="square" ref="checkboxes">全选</van-checkbox>
        </van-checkbox-group>
      </van-sticky> -->
    </div>

    <!-- <van-checkbox-group v-model="mainCheck">
          <van-checkbox shape="square" ref="checkboxes">全选</van-checkbox>
        </van-checkbox-group> -->
    <van-sticky :container="container" offset-top="50">
      <div style="background: white;padding-left:16px">
        <van-checkbox v-model="checked" @change="onChange" shape="square">
        全选
      </van-checkbox>
      </div>
      
    </van-sticky>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->

      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in list"
            clickable
            :key="item"
            @click="toggle(index)"
          >
            <div style="display: flex">
              <van-checkbox shape="square" :name="item" ref="checkboxes" />
              <div>
                <!-- <div v-for="(item, index) in Object.keys(item)"  :key="index">
                    {{ item[key] }}
                  </div> -->
                {{ item }}
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      mainCheck: false,
      container: null,
      //   list: [],
      loading: false,
      finished: false,
      list: ["a", "b"],
      result: ["a", "b", 3, 4],
      // 数据
      data11: [],
      totalData: [],
      // 表头列表
      thList: [
        {
          title: "机构",
          isSort: false,
        },
        {
          title: "保费",
          isSort: true, // 是否进行排序
          backgroundColor: "#fdeeee", // 是否单独显示背景颜色
          sortField: "addAgent", // 排序字段
        },
        {
          title: "达成率",
          isSort: true,
          backgroundColor: "#fdeeee",
          sortField: "addAgentRate",
        },
        {
          title: "新增代理人",
          isSort: true,
          sortField: "preium",
        },
        {
          title: "代理人达成率",
          isSort: true,
          sortField: "premiumRate",
        },
      ],
      // 是否需要排序 默认不进行排序
      isNeedSort: false,
      // 排序序号
      sortIndex: null,
      // 排序形式 倒叙默认倒叙 false为正序
      order: true,
      // 是否显示更多
      showMore: this.showMoreCom,
    };
  },
  methods: {
    onChange(c) {
      console.log("## onchange == ", c);
      this.$refs.checkboxGroup.toggleAll(c);
    },
    toggle(e) {
      this.$refs.checkboxGroup.toggleAll(!e);
    },
    onClick(e) {
      this.mainCheck = !this.mainCheck;
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 20) {
          this.finished = true;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
// 控制高度
.controlHeight {
  height: 485px;
  overflow: hidden;
  transition: 0.3s;
}
// 正常高度
.normalHeight {
  height: 100%;
  transition: 0.3s;
}
// 头部
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 40px;
}
// 表格相关样式
table {
  border-collapse: collapse;
  width: 98%;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
  // 每一行下面加边框
  tr {
    border-bottom: 1px solid #f1f1f1;
  }
  .cont {
    height: 40px;
  }
}
// 表头设置
.top {
  height: 40px;
  line-height: 40px;
  background: rgb(242, 245, 247);
  .title {
    margin-right: 3px;
  }
  th {
    border-left: 1px solid #e9ebec;
    font-weight: 500;
  }
}
// 合计一行高亮显示
.sum {
  color: #005dff;
  font-weight: bold;
}
// 正常排序的样式
.sort {
  display: inline-block;
  width: 7px;
  height: 10px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAeCAYAAAG012XDAAAABGdBTUEAALGPC/xhBQAAAppJREFUSA3dVjtvE0EQnjkbkCMRhBTIHwi/gdgSBQSIi1iOA3ZNT5HUQIfow6OnvwM/5BR2zKNAsvkP5A8kIEA4xALsW2b2POs9353jioKVzjP7zbezM7MvA1gNWXdrLWVhlhpvYTTeEuttNt2aLTaYSimvcc1zu90Mf9agQHVr+/cEdFjxaq0dAP9lIAGw2Xy/NBj++iysTPrcJdFPl0hJdImWtag9iXdEIE/qU6wpQ7ArNMlgbKawXlPNt8hQLZfyd8woUgzZbb7JwnDI84ZbOp2rFG72GJQYEhZwMi5UxwmcrIlnyS6JqbPWNdfpI3yJZRIu5TEJCtEu1alxup3Ohb29DxdlsEgdgnSUUg4cj76f/Pn5VetiIBkievU2J6ibrTNgiG6tfRJQJr82poluvf0JQEX3JmGBjVbLq7deKAX3J36iGiI+j6L/DEGv1n6sQD2aOSPiE9Qn8fBHpDShgcuLC04llxtQNa+EDHaHbMzRdawU8wfopEJHgrmMsY11szLl4q0qOrjLIDfWGQt6Mb98jsdnOWSN7MmQlTo62aP+O1BqFRA/wuXzN3Re00Srb8K0MKNSFLvA1WOH3FhSX+OGFVViI/UanS3ljzyiz5rUpyKW4+oTcuo2WiugoEffUnT+BITPPUJWVohZ2ul4k7ylvn15JnhJhHuwvLhm9gge9h8Q9WoifQ4DHbNVOOo/nIP6v1P0Qs1zNc1TCKrrs/Lm+rbZUvrlHf2m7aRW5nEQ4iAeZFJns4XCdf2sGKdCCt7IEW2vuJtXWCJxAOnUmrydBhVlWrqN/W3wfXO7TNvBcXYqxdtPIzgBkUhtEj9Jr+ptj/8CCE4Dqnc318tUP1+waTnTqZD5gYRjVVo4k2lsbFz7JniS/AspWgleJ+XDaAAAAABJRU5ErkJggg==);
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
// 激活排序的样式
.sortUp {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAeCAYAAAG012XDAAAABGdBTUEAALGPC/xhBQAAAqRJREFUSA3lVj1vE0EQnTljkFMQIRlRIDr4BRTJWUKQBEiKWE4Cdk1PkdRAh+gDpKe3Qz7kJiHEB0LyGck0tKSDICEQoAhijLGXmT3veffOd6c0NIxk7eybN7Ozs7O3BtAEpV5zhYZpanl9a5iF+UfwiaVrq8lkgkuW5me8JJlYrtcz/NOc+qrj3lKgJRWnsQQCngCPJAhOMwui81mxANOnfT1RQUqrTixbY7oq3y6BvGiPck35hOBGfINUao2nsoQ8BmSw3Revbej1eF1TLCsHV8ZcBj1y5GFofpP2ILAGR6rB3UUR5a5lzeX2Eb4MZRKuyhPKQy+Vcd5DIzWbo/Dq7amgzTt2hQphwUHnO3R+fgXWNTGXD5ZOK9PAy3EPtQCeqmEe0XHfUceFe5MxtpFQFzZWKJ/boWgm8Nic/tMZVta37wsQ92JXRXyA8iZ+OgiXRvc8c3LEKuVyLbohF3Tc0MnGHFnHUmFmD63UDYNAE8bYxrh/MsXCtTW0cFmRWWdMzUMj3+P+XTZsZlMYpv6k/j4D7f0and44IDbgxNlJyJ1rDaMqzE9TAcboNJbh14dDGZANHJjnjMfI8ExfugvQxQpFiVkUe5ASRbhsh+pjBnXenAfouJRRNiYR04RI9z5tw8RFeUJs9IJ6ddulYPrH03ROmiG6VO8prre3vfb+HbprY0l+CfZxaH+8m8D5H8zyoCobWytCQNKnKbEeiPioODe96LdUtepkW93f3E7UVkcUxL1M6ridz0/IZ8UPqsKUq89t+NPdpcYPf3kVyR+xBcdSU6X8Vfl2KjgUVBnKm88W6QGOvo6WtVQqXH+o+PoYGZRJgp6k1Y3tCv25WlBO5LB2c266SPXrKSw4xgZV5PLOzij8EPMj6czm7OylbwqPGv8Ccef3M+dWP3cAAAAASUVORK5CYII=);
}
.more {
  height: 40px;
  text-align: center;
  line-height: 40px;
  span {
    display: inline-block;
  }
  span:active {
    transition: height 0.3s;
  }
}
</style>