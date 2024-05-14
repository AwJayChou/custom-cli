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
    return 106;
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

          const keyShape = group.addShape("rect", {
            attrs: {
              width,
              height: size[1],
              radius: 0,
              fill: "rgba(255, 255, 255, 1)",
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
          group.addShape("text", {
            attrs: {
              text: fittingString(cfg.name, 100, 10).isMax
                ? ""
                : fittingString(subText, 95 - cfg.name.length * 10, 8)
                    .currentWidth > 0
                ? fittingString(subText, 95 - cfg.name.length * 10, 8).text
                : "",
              fontSize: 8,
              // textAlign: 'left',
              x: -width / 2 + 8 + Util.getTextSize(cfg.name, 10)[0],
              textBaseline: "middle",
              fill: "rgba(153, 153, 153, 1)",
            },
            name: "othet-node-count",
          });
          const bottomText = `成本占比(${cfg.rate || ""}%)`;
          group.addShape("text", {
            attrs: {
              text: bottomText,
              fontSize: 8,
              textAlign: "center",
              y: 26,
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
          if (cfg.children && cfg.children.length > 0) {
            if (cfg.state === "left") {
              group.addShape("marker", {
                attrs: {
                  ...defaultAttrs,
                  symbol: cfg.collapsed ? Marker.expand : Marker.collapse,
                  x: -width / 2 - 6,
                },
                name: "collapse-icon",
              });
            } else {
              group.addShape("marker", {
                attrs: {
                  ...defaultAttrs,
                  symbol: cfg.collapsed ? Marker.expand : Marker.collapse,
                  x: width / 2 + 6,
                },
                name: "collapse-icon",
              });
            }
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
              formatText: function formatText(model) {
                var text = `${model.name || ""} , (${model.count || ""}家企业)`;

                return text;
              },

              shouldUpdate: function shouldUpdate(e) {
                const model = e.item.getModel();
                const subText = `(${model.count || ""}家企业)`;
                if (model.level === 0) return false;
                if (
                  fittingString(model.name, 100, 10).isMax ||
                  fittingString(subText, 95 - model.name.length * 10, 8).isMax
                ) {
                  return true;
                }
                return false;
              },
            },
            'drag-canvas',
            'zoom-canvas'
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
        if ("collapse-icon" === name) {
          let model = item.getModel();
          if (model.collapsed === undefined) {
            model.collapsed = false;
          }
          // //没有子节点
          // if (
          //   !model.children ||
          //   (model.children && model.children.length === 0)
          // ) {
          //   console.log("UI_LOG: ", "没有子节点,发请求了");
          //   this.loading = true;
          //   //获取父节点的方向
          //   const state = item._cfg.parent.getModel().state || model.state;
          //   setTimeout(() => {
          //     let children = [];
          //     children.push({
          //       id: `k-${Math.random()}`,
          //       name: `k-${Math.random()}`,
          //       state,
          //     });

          //     model.children = children;
          //     Util.traverseTree(model, (subtree) => {
          //       subtree.type = "other-node";
          //     });
          //     graph.updateChild(model, model.id);
          //     const marker = item
          //       .get("group")
          //       .find((ele) => ele.get("name") === "collapse-icon");
          //     marker.attr("symbol", Marker.collapse);
          //     _this.loading = false;
          //   }, 502);
          // } else {
          //   console.log("UI_LOG: ", model);
          //   model.collapsed = !model.collapsed;
          //   graph.updateChild(model, model.id);
          //   // console.log('UI_LOG: ', graph.cfg.data.children)
          // }
        }
      });
      // graph.node((node) => {
      //   return {
      //     label: node.name || "",
      //     anchorPoints: [
      //       [0, 0.5],
      //       [1, 0.5],
      //     ],
      //   };
      // });

      Util.traverseTree(this.treeData, (subtree) => {
        if (subtree.level === undefined) subtree.level = 0;
        subtree.children?.forEach((child) => (child.level = subtree.level + 1));
        switch (subtree.level) {
          // case 0:
          //   subtree.type = "root-node";
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