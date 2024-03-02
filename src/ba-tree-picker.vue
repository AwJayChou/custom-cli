<!-- 树形层级选择器-->
<!-- 支持单选、多选 -->
<template>
  <div>
    <div
      class="tree-cover"
      :class="{ show: showDialog }"
      @click="_cancel"
    ></div>
    <div class="tree-dialog" :class="{ show: showDialog }">
      <div class="tree-bar">
        <div
          class="tree-bar-cancel"
          :style="{ color: cancelColor }"
          hover-class="hover-c"
          @click="_cancel"
        >
          取消
        </div>
        <div class="tree-bar-title" :style="{ color: titleColor }">
          {{ title }}
        </div>
        <div
          class="tree-bar-confirm"
          :style="{ color: confirmColor }"
          hover-class="hover-c"
          @click="_confirm"
        >
          {{ multiple ? "确定" : "" }}
        </div>
      </div>
      <div class="tree-div">
        <scroll-view class="tree-list" :scroll-y="true">
          <div v-for="(item, index) in treeList" :key="index">
            <div
              class="tree-item"
              :style="[{ paddingLeft: item.level * 30 + 'px' }]"
              :class="{ itemBorder: border === true, show: item.isShow }"
            >
              <div class="item-label">
                <!-- 下拉节点点击 -->
                <div
                  class="item-icon uni-inline-item1"
                  @click="_onItemSwitch(item, index)"
                >
                  <div style="height: 100%; width: 100%">
                    <van-icon
                      v-if="!item.isLastLevel && item.isShowChild"
                      name="arrow-up"
                    />
                    <van-icon
                      v-else-if="!item.isLastLevel && !item.isShowChild"
                      name="arrow-down"
                    />
                    <div
                      v-else
                      class="item-last-dot"
                      :style="{ 'border-top-color': switchColor }"
                    ></div>
                  </div>
                </div>
                <div class="item-name">
                  <!-- {{
                    item.name +
                    (item.childCount ? "(" + item.childCount + ")" : "")
                  }} -->
                  {{ item.name }}
                </div>
                <div
                  class="uni-flex-item uni-inline-item"
                  @click="_onItemSelect(item, index)"
                >
                  <div
                    class="item-check"
                    v-if="selectParent ? true : item.isLastLevel"
                  >
                    <!-- 选中 部分 -->
                    <div
                      class="item-check-yes"
                      v-if="item.checkStatus == 1"
                      :class="{ radio: !multiple }"
                      :style="{ 'border-color': confirmColor }"
                    >
                      <div
                        class="item-check-yes-part"
                        :style="{ 'background-color': confirmColor }"
                      ></div>
                    </div>
                    <!-- 选中 全部 -->
                    <div
                      class="item-check-yes"
                      v-else-if="item.checkStatus == 2"
                      :class="{ radio: !multiple }"
                      :style="{ 'border-color': confirmColor }"
                    >
                      <div
                        class="item-check-yes-all"
                        :style="{ 'background-color': confirmColor }"
                      ></div>
                    </div>
                    <!-- 未选中 -->
                    <div
                      class="item-check-no"
                      v-else
                      :class="{ radio: !multiple }"
                      :style="{ 'border-color': confirmColor }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>
 
<script>
import scrollView from "@/components/tree-picker/scrollView.vue";

export default {
  emits: ["select-change"],
  name: "ba-tree-picker",
  components: {
    scrollView,
  },
  props: {
    valueKey: {
      type: String,
      default: "id",
    },
    textKey: {
      type: String,
      default: "name",
    },
    childrenKey: {
      type: String,
      default: "children",
    },
    localdata: {
      type: Array,
      default: function () {
        return [];
      },
    },
    localTreeList: {
      //在已经格式化好的数据
      type: Array,
      default: function () {
        return [];
      },
    },
    selectedData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    title: {
      type: String,
      default: "",
    },
    multiple: {
      // 是否可以多选
      type: Boolean,
      default: true,
    },
    selectParent: {
      //是否可以选父级
      type: Boolean,
      default: true,
    },
    confirmColor: {
      // 确定按钮颜色
      type: String,
      default: "", // #0055ff
    },
    cancelColor: {
      // 取消按钮颜色
      type: String,
      default: "", // #757575
    },
    titleColor: {
      // 标题颜色
      type: String,
      default: "", //
    },
    switchColor: {
      // 节点切换图标颜色
      type: String,
      default: "", // #666
    },
    border: {
      // 是否有分割线
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showDialog: false,
      treeList: [],
    };
  },
  computed: {},
  methods: {
    _show() {
      this.showDialog = true;
    },
    _hide() {
      this.showDialog = false;
    },
    _cancel() {
      this._hide();
      this.$emit("cancel", "");
    },
    _confirm() {
      //多选
      let selectedList = []; //如果子集全部选中，只返回父级 id
      let selectedNames;
      let currentLevel = -1;
      this.treeList.forEach((item, index) => {
        if (currentLevel >= 0 && item.level > currentLevel) {
        } else {
          if (item.checkStatus === 2) {
            currentLevel = item.level;
            selectedList.push(item.id);
            selectedNames = selectedNames
              ? selectedNames + " / " + item.name
              : item.name;
          } else {
            currentLevel = -1;
          }
        }
      });
      //console.log('_confirm', selectedList);
      this._hide();
      this.$emit("select-change", selectedList, selectedNames);
    },
    //格式化原数据（原数据为tree结构）
    _formatTreeData(list = [], level = 0, parentItem, isShowChild = true) {
      let nextIndex = 0;
      let parentId = -1;
      let initCheckStatus = 0;
      if (parentItem) {
        nextIndex =
          this.treeList.findIndex((item) => item.id === parentItem.id) + 1;
        parentId = parentItem.id;
        if (!this.multiple) {
          //单选
          initCheckStatus = 0;
        } else initCheckStatus = parentItem.checkStatus == 2 ? 2 : 0;
      }
      list.forEach((item) => {
        // 判断是否为叶子节点
        let isLastLevel = true;
        if (item && item[this.childrenKey]) {
          let children = item[this.childrenKey];
          if (Array.isArray(children) && children.length > 0) {
            isLastLevel = false;
          }
        }

        let itemT = {
          id: item[this.valueKey],
          name: item[this.textKey],
          level,
          isLastLevel,
          isShow: isShowChild,
          isShowChild: false,
          checkStatus: initCheckStatus,
          orCheckStatus: 0,
          parentId,
          children: item[this.childrenKey],
          childCount: item[this.childrenKey]
            ? item[this.childrenKey].length
            : 0,
          childCheckCount: 0,
          childCheckPCount: 0,
        };

        if (this.selectedData.indexOf(itemT.id) >= 0) {
          itemT.checkStatus = 2;
          itemT.orCheckStatus = 2;
          itemT.childCheckCount = itemT.children ? itemT.children.length : 0;
          this._onItemParentSelect(itemT, nextIndex);
        }

        this.treeList.splice(nextIndex, 0, itemT);
        nextIndex++;
      });
      console.log("## _formatTreeData ==> ", this.treeList);
    },
    // 节点打开、关闭切换
    _onItemSwitch(item, index) {
      // console.log(item)
      console.log("_itemSwitch", item, item.level);
      if (item.isLastLevel === true) {
        return;
      }
      item.isShowChild = !item.isShowChild;
      if (item.children) {
        this._formatTreeData(item.children, item.level + 1, item);
        // 这里是否可以将树形改变？
        item.children = undefined;
      } else {
        this._onItemChildSwitch(item, index);
      }
    },
    // 把整颗树打开
    _openAllTree(t) {
      let main = t || this.treeList
      main.forEach((tree, index) => {
      	this._onItemSwitch(tree,index)
      	if (tree.children) {
      		this._openAllTree(tree.children)
      	}
      })
    },
	// 把整颗树打开
    _openAllTree1() {
      let main = this.treeList
      main.forEach((tree, index) => {
      	this._onItemSwitch(tree,index)
      	if (tree.children) {

      		this._openAllTree(tree.children)
      		// this._openAllTree()
      	}
      })
    },
    _onItemChildSwitch(item, index) {
      //console.log('_onItemChildSwitch')
      const firstChildIndex = index + 1;
      if (firstChildIndex > 0)
        for (var i = firstChildIndex; i < this.treeList.length; i++) {
          let itemChild = this.treeList[i];
          if (itemChild.level > item.level) {
            if (item.isShowChild) {
              if (itemChild.parentId === item.id) {
                itemChild.isShow = item.isShowChild;
                if (!itemChild.isShow) {
                  itemChild.isShowChild = false;
                }
              }
            } else {
              itemChild.isShow = item.isShowChild;
              itemChild.isShowChild = false;
            }
          } else {
            return;
          }
        }
    },
    // 节点选中、取消选中
    _onItemSelect(item, index) {
      //console.log('_onItemSelect')
      //console.log(item)
      if (!this.multiple) {
        //单选
        item.checkStatus = item.checkStatus == 0 ? 2 : 0;

        this.treeList.forEach((v, i) => {
          if (i != index) {
            this.treeList[i].checkStatus = 0;
          } else {
            this.treeList[i].checkStatus = 2;
          }
        });

        let selectedList = [];
        let selectedNames;
        selectedList.push(item.id);
        selectedNames = item.name;
        this._hide();
        this.$emit("select-change", selectedList, selectedNames);
        return;
      }

      let oldCheckStatus = item.checkStatus;
      switch (oldCheckStatus) {
        case 0:
          item.checkStatus = 2;
          item.childCheckCount = item.childCount;
          item.childCheckPCount = 0;
          break;
        case 1:
        case 2:
          item.checkStatus = 0;
          item.childCheckCount = 0;
          item.childCheckPCount = 0;
          break;
        default:
          break;
      }
      //子节点 全部选中
      this._onItemChildSelect(item, index);
      //父节点 选中状态变化
      this._onItemParentSelect(item, index, oldCheckStatus);
    },
    _onItemChildSelect(item, index) {
      //console.log('_onItemChildSelect')
      let allChildCount = 0;
      if (item.childCount && item.childCount > 0) {
        index++;
        while (
          index < this.treeList.length &&
          this.treeList[index].level > item.level
        ) {
          let itemChild = this.treeList[index];
          itemChild.checkStatus = item.checkStatus;
          if (itemChild.checkStatus == 2) {
            itemChild.childCheckCount = itemChild.childCount;
            itemChild.childCheckPCount = 0;
          } else if (itemChild.checkStatus == 0) {
            itemChild.childCheckCount = 0;
            itemChild.childCheckPCount = 0;
          }

          index++;
        }
      }
    },
    _onItemParentSelect(item, index, oldCheckStatus) {
      //console.log('_onItemParentSelect')
      //console.log(item)
      const parentIndex = this.treeList.findIndex(
        (itemP) => itemP.id == item.parentId
      );
      //console.log('parentIndex：' + parentIndex)
      if (parentIndex >= 0) {
        let itemParent = this.treeList[parentIndex];
        let count = itemParent.childCheckCount;
        let oldCheckStatusParent = itemParent.checkStatus;

        if (oldCheckStatus == 1) {
          itemParent.childCheckPCount -= 1;
        } else if (oldCheckStatus == 2) {
          itemParent.childCheckCount -= 1;
        }
        if (item.checkStatus == 1) {
          itemParent.childCheckPCount += 1;
        } else if (item.checkStatus == 2) {
          itemParent.childCheckCount += 1;
        }
        if (
          itemParent.childCheckCount <= 0 &&
          itemParent.childCheckPCount <= 0
        ) {
          itemParent.childCheckCount = 0;
          itemParent.childCheckPCount = 0;
          itemParent.checkStatus = 0;
        } else if (itemParent.childCheckCount >= itemParent.childCount) {
          itemParent.childCheckCount = itemParent.childCount;
          itemParent.childCheckPCount = 0;
          itemParent.checkStatus = 2;
        } else {
          itemParent.checkStatus = 1;
        }
        //console.log('itemParent：', itemParent)
        this._onItemParentSelect(itemParent, parentIndex, oldCheckStatusParent);
      }
    },
    // 重置数据
    _reTreeList() {
      this.treeList.forEach((v, i) => {
        this.treeList[i].checkStatus = v.orCheckStatus;
      });
    },
    _initTree() {
      this.treeList = [];
      this._formatTreeData(this.localdata);
    },
  },
  watch: {
    localdata() {
      this._initTree();
    },
    localTreeList() {
      this.treeList = this.localTreeList;
    },
  },
  mounted() {
    this._initTree();
  },
};
</script>
 
<style scoped>
.tree-cover {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
}

.tree-cover.show {
  visibility: visible;
  opacity: 1;
}

.tree-dialog {
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  z-index: 102;
  top: 20%;
  transition: all 0.3s ease;
  transform: translateY(100%);
}

.tree-dialog.show {
  transform: translateY(0);
}

.tree-bar {
  /* background-color: #fff; */
  height: 40px;
  padding-left: 15px;
  padding-right: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom-width: 1px !important;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
  font-size: 15px;
  color: #757575;
  line-height: 1;
}

.tree-bar-confirm {
  color: #0055ff;
  padding: 15px;
}

.tree-bar-title {
  color: #007aff;
}

.tree-bar-cancel {
  color: #757575;
  padding: 10px;
}

.tree-div {
  flex: 1;
  padding: 20px 0 10px 0px;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.tree-list {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.tree-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1;
  height: 0;
  opacity: 0;
  transition: 0.2s;
  overflow: hidden;
}

.tree-item.show {
  height: 35px;
  opacity: 1;
  padding: 0 15px 0 0;
}

.tree-item.showchild:before {
  transform: rotate(90deg);
}

.tree-item.last:before {
  opacity: 0;
}

.switch-on {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #666;
}

.switch-off {
  width: 0;
  height: 0;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-left: 10px solid #666;
}

.item-last-dot {
  position: absolute;
  width: 0px;
  height: 0px;
  border-radius: 100%;
  background: #666;
}

.item-icon {
  width: 0px;
  /* height: 8px; */
  /* margin-right: 8px; */
  padding-right: 20px;
  padding-left: 20px;
}

.item-label {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1.2;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  font-size: 14px;
}

.item-check {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-check-yes,
.item-check-no {
  width: 20px;
  height: 20px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  border-top-width: 1px;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-style: solid;
  border-color: #0055ff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.item-check-yes-part {
  width: 12px;
  height: 12px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  background-color: #0055ff;
}

.item-check-yes-all {
  margin-bottom: 5px;
  border: 2px solid #007aff;
  border-left: 0;
  border-top: 0;
  height: 12px;
  width: 6px;
  transform-origin: center;
  /* #ifndef APP-NVUE */
  transition: all 0.3s;
  /* #endif */
  transform: rotate(45deg);
}

.item-check .radio {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.item-check .radio .item-check-yes-b {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}

.hover-c {
  opacity: 0.6;
}

.itemBorder {
  border-bottom: 1px solid #e5e5e5;
}
</style>