<template>
  <div class="relation-graph">
    <div class="main-graph" id="graph" v-loading="loading"></div>
  </div>
</template>

<script>
import { treeData } from "./mock.data";
import { objectProperty } from "mars-pro/lib/pro/util";
import { postForm } from "mars-pro/lib/pro/request";
import G6, {
  Util,
  registerNode,
  registerEdge,
  TreeGraph,
  Marker,
} from "@antv/g6";

const defaultStateStyles = {
  hover: {
    stroke: "#1890ff",
    lineWidth: 2,
  },
};
const defaultLayout = {
  type: "compactBox",
  direction: "TB",
  getId: function getId(d) {
    return d.id;
  },
  getHeight: function getHeight() {
    // return 196;
    return 56;
  },
  getWidth: function getWidth() {
    // return 280;
    return 180;
  },
  getVGap: function getVGap() {
    return 16;
  },
  getHGap: function getHGap() {
    return 24;
  },
};

/**
 * 字符串格式化
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp("[\u4E00-\u9FA5]+"); // 中文检测
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // 中文字符长度
      currentWidth += fontSize;
    } else {
      // 英文字符长度计算
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.slice(0, i)}${ellipsis}`;
    }
  });
  return {
    text: res,
    isMax: currentWidth > maxWidth - ellipsisLength,
    currentWidth,
  };
};
export default {
  name: "relation-graph",
  props: {
    industryName: {
      type: String,
      default: "房地产",
    },
  },
  data() {
    return {
      // treeData: {},
      treeData,
      loading: false,
    };
  },
  methods: {
    //初始化树
    initTree() {
      console.log("UI_LOG: ", "开始初始化~");
      const _this = this;
      let container = document.querySelector("#graph");
      let { clientWidth: width, clientHeight: height } = container;

      registerNode("other-node", {
        draw(cfg, group) {
          const size = [100, 30];
          const subText = `(${cfg.count || ""}家企业)`;
          const width = 110;
          const isMain = cfg.id === "0" ? 8 : 0;
          const keyShape = group.addShape("rect", {
            attrs: {
              width,
              // height: size[1]+8,
              height: size[1] + isMain,
              radius: 0,
              fill: "rgba(255, 255, 255, 1)",
              // stroke: "rgba(0, 83, 255, 1)",
              stroke: "rgba(0, 83, 255, 1)",
              x: -width / 2,
              y: -size[1] / 2,
            },
            name: "othet-node-rect",
          });
          group.addShape("text", {
            attrs: {
              text: fittingString(cfg.name, 100, 10).isMax
                ? fittingString(cfg.name, 100, 10).text
                : cfg.name,
              fontSize: 10,
              // textAlign: 'right',
              x: -width / 2 + 6,
              textBaseline: "middle",
              fill: "rgba(51, 51, 51, 1)",
            },
            name: "othet-node-name",
          });
          
          const bottomText = `${cfg.rate || ""}`;
          group.addShape("text", {
            attrs: {
              text: bottomText,
              fontSize: 8,
              textAlign: "center",
              // y: 26,
              x: 20,
              y: -20,
              fill: "rgba(153, 153, 153, 1)",
            },
            name: "othet-node-rate",
          });

          const defaultAttrs = {
            stroke: "rgba(0, 83, 255, 1)",
            fill: "#fff",
            lineWidth: 1,
            cursor: "pointer",
            y: 0,
            r: 6,
          };
          if (cfg.children && cfg.children.length > 0 && !isMain) {
            group.addShape("marker", {
              attrs: {
                ...defaultAttrs,
                symbol: cfg.collapsed ? Marker.expand : Marker.collapse,
                // x: width / 2 + 6,
                x: 0,
                y: 22,
              },
              name: "collapse-icon",
            });
          }

          return keyShape;
        },
      });
      const flowLine = {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          const sourceModel = cfg?.sourceNode?._cfg?.model;
          const targetModel = cfg?.targetNode?._cfg?.model;
          const path = [
            ["M", startPoint.x, startPoint.y - 20],
            ["L", startPoint.x, (startPoint.y + endPoint.y) / 2 + 8],
            ["L", endPoint.x, (startPoint.y + endPoint.y) / 2 + 8],
            ["L", endPoint.x, endPoint.y],
          ];

          const sourceSelected = sourceModel?.isAbnormal;
          const targetSelected = targetModel?.isAbnormal;
          const isSelected = !!sourceModel?.parentMetricNodeId
            ? targetSelected && sourceSelected
            : targetSelected;

          const shape = group.addShape("path", {
            attrs: {
              stroke: isSelected ? "red" : "#cacaca",
              path,
            },
          });
          return shape;
        },
      };
      registerEdge("tree-line", flowLine);

      let graph = new TreeGraph({
        container,
        width,
        height,
        linkCenter: true,
        fitView: true,
        preventOverlap: true,
        modes: {
          default: [
            {
              type: "tooltip", // tootip 无法展示
              show: true,
              formatText: function formatText(model) {
                var text = `<div>
                <p>${model.name || ""}</p>
                <p>${model.count || ""}家企业</p>
                </div>`;

                return text;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        //默认节点属性
        defaultNode: {
          type: "node-child",
          size: [280, 156],
        },
        //默认连线节点
        defaultEdge: {
          type: "tree-line",
        },
        edgeStateStyles: defaultStateStyles,
        // layout: {
        //   // type: "mindmap",
        //   // direction: "H",
        //   type: "compactBox",
        //   direction: "TB",
        //   getHeight: () => 16,
        //   getWidth: () => 30,
        //   getVGap: () => 30,
        //   getHGap: () => 80,
        //   // getSide: (node) => {
        //   //   return node.data.state === "left" ? "left" : "right";
        //   // },
        // },
        layout: defaultLayout,
      });

      graph.on("node:click", (ev) => {
        const { item, target } = ev;
        const name = target.get("name");
        let model = item.getModel();
        if ("collapse-icon" === name) {
          if (model.collapsed === undefined) {
            model.collapsed = false;
          }
          model.collapsed = !model.collapsed;
          graph.updateChild(model, model.id);
        }
        console.log("## item ==> ", model);
        if (model.level === 2) {
          if (!model.children) {
            model.children = [];

            const newModel = {
              id: "newModel",
              name: "newModel",
              count: 12,
              rate: "7.4%",
              state: "left",
              type: "other-node",
            };
            // graph.addChild(model.id, newModel);

            model.children.push(newModel);
            graph.updateChild(model, model.id);
          }
        }
      });

      Util.traverseTree(this.treeData, (subtree) => {
        if (subtree.level === undefined) subtree.level = 0;
        subtree.children?.forEach((child) => (child.level = subtree.level + 1));
        switch (subtree.level) {
          // case 0:
          //   // subtree.type = "root-node";
          //   subtree.type = "rect-jsx";
          //   break;
          // case 1:
          //   subtree.type = 'level1-node'
          //   break
          default:
            subtree.type = "other-node";
        }
      });
      graph.data(this.treeData);
      graph.render();
      graph.fitView();
      // graph.zoom(0.8, { x: width * 3, y: height * 3 })
      setTimeout(() => {
        // 1 默认展开两层节点，之后，重新渲染
        G6.Util.traverseTree(this.treeData, function (item) {
          // console.log('traverseTree ==> ', item, item.level)
          if (item.level === 2 && item.children && item.children.length) {
            console.log("## enter ==> ", item, item.level);
            //collapsed为true时默认收起
            item.collapsed = true;
            graph.updateChild(item, item.id);
          } else if (item.level === 2) {
            // todos 这里添加逻辑进行动态添加
            console.log("## 打开 额外节点");
            // 添加子节点的方法
            // function addChildNode(parentId, newModel) {
            //   graph.addChild(parentId, newModel);
            // }
            // const newModel = {
            //   id: 'newModel',
            //   name: 'newModel',
            //   count: 12,
            //   rate: '7.4%',
            //   state: 'left',
            // }
            // graph.addChild(item.id, newModel);
          }
        });
        // graph.render()
        // graph.fitCenter() // 移到图中心
      }, 10);
    },
  },
  mounted() {
    this.initTree();
    // this.loadData()
  },
};
</script>

<style lang="scss">
.relation-graph {
  .industry-title {
    text-align: center;
    font-size: 36px;
    margin: 4px 0;
    font-weight: 600;
  }
  .industry-intro {
    line-height: 1.6;
    text-indent: 32px;
  }
  .industry-sub-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 8px;
    .title-icon {
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }
  .industry-foot-info {
    display: flex;
    align-items: center;
    background: #f0f4ff;
    .content-icon {
      img {
        height: 40px;
        width: 40px;
        margin: 8px;
      }
    }
    .content-describe {
      em {
        font-style: normal;
        color: #fc5b21;
      }
    }
  }
  .main-graph {
    height: 600px;
    position: relative;
    .g6-tooltip {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 10px 8px;
      box-shadow: rgb(174, 174, 174) 0px 0px 10px;
      width: 200px;
      word-wrap: break-word;
    }
  }
}
</style>