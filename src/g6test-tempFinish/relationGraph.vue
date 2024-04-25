<template>
  <div class="relation-graph">
    <div @click="handleDown">download</div>
    <div class="main-graph" id="graph"></div>
  </div>
</template>

<script>
import { treeData } from "./mock.data";
import { colorMap, nameMap} from './config'
import { objectProperty } from "mars-pro/lib/pro/util";
import { postForm } from "mars-pro/lib/pro/request";
import G6, {
  Util,
  registerNode,
  registerEdge,
  TreeGraph,
  Marker,
} from "@antv/g6";

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
      res = `${str.slice(0, i - 1)}${ellipsis}`;
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
    handleDown() {
      this.globalGraph.downloadFullImage(
        'test',
        'image/png',
        {
          backgroundColor: '#fff',
          padding: 20,
        }
        )
    },
    //初始化树
    initTree() {
      console.log("UI_LOG: ", "开始初始化~");
      const _this = this;
      let container = document.querySelector("#graph");
      let { clientWidth: width, clientHeight: height } = container;

      // console.log('UI_LOG: ', Util.getLetterWidth('获取字母的宽度', 16))
      // console.log('UI_LOG: ', Util.getTextSize('获取文字大小', 12)[0])
      //根节点
      registerNode("root-node", {
        labelPosition: "center",
        draw(cfg, group) {
          console.log("## root-node cfg", cfg, group);

          const size = [100, 40];
          // 量取text的长度
          const fs = 16; // todos 暂时是剧中的
          const width = Util.getTextSize(cfg.name, fs)[0] + 10;
          console.log("## width  fs==> ", width);
          const defaultWidth = 150;
          const rectBg = colorMap[cfg.biz]
          const keyShape = group.addShape("rect", {
            attrs: {
              width: defaultWidth,
              // height: size[1],
              height: 55,
              stroke: rectBg,
              // stroke: "#ff8d0c",
              // stroke: 'black',
              lineWidth: 0.5,
              radius: 2,
              y: -size[1] / 2,
            },
            name: "root-rectshape",
          });
          console.log("##  config.name => ", cfg.name);
          // 第一层 背景色
          group.addShape("rect", {
            attrs: {
              width: defaultWidth,
              height: 20,
              lineWidth: 0.5,
              // fill: "#ff8d0c",
              fill: rectBg,
              radius: [2, 2, 0, 0],
              label: cfg.name,
              labelCfg: {
                position: "center",
                style: {
                  fontSize: 12,
                  color: "#fff",
                },
              },

              // x: -width / 2,
              y: -size[1] / 2,
            },
            label: cfg.name,
            labelCfg: {
              position: "center",
              style: {
                fontSize: 12,
                color: "#fff",
              },
            },
          });
          // 分割线
          group.addShape("rect", {
            attrs: {
              // fill: "#ff8d0c",
              fill: rectBg,
              width: defaultWidth,
              height: 0.5,
              // x: -width / 2,
              y: 16,
            },
          });
          const longText = "111112222222321321321321321312312321312";
          // ==========================标题
          const labelFont = 10;
          
          let labelX = 2;
          let showText = cfg.name + longText;
          const labelRealSize = Util.getTextSize(showText, labelFont)[0];
          // const labelRealSize
          console.log("## label real size ==> ", labelRealSize);
          if (labelRealSize < defaultWidth) {
            // 如果文字长度比rect短
            labelX = (defaultWidth - labelRealSize) / 2;
          } else if(fittingString(showText, defaultWidth, labelFont).isMax) {
            showText = fittingString(showText, defaultWidth, labelFont).text
             
          }
          group.addShape("text", {
            attrs: {
              width: defaultWidth,
              text: showText,
              // text: cfg.name + longText,
              fontSize: labelFont,
              // textAlign: "center",
              // center / end / left / right / start，
              // textAlign: "end",
              fill: "#fff",
              x: labelX,
              y: -4,
            },

            // name: "root-label",
          });
          const f1 = "认缴金额/实际金额" + longText;
          const text1 = fittingString(f1, defaultWidth, 8).isMax
            ? fittingString(f1, defaultWidth, 8).text
            : f1;
          // ========================== line1
          group.addShape("text", {
            attrs: {
              width: defaultWidth,
              // text: '认缴金额/实际金额111111111111111111111111111',
              // text: '认缴金额/实际金额1' + longText,
              text: text1,
              fontSize: 8,

              fill: "#333",
              // x: -width / 2 +2,
              x: 2,
              y: 13,
            },

            // name: "root-label",
          });
          const f2 = "投资金额" + longText;
          const text2 = fittingString(f2, defaultWidth, 8).isMax
            ? fittingString(f2, defaultWidth, 8).text
            : f2;
          // ========================== line1
          group.addShape("text", {
            attrs: {
              width: defaultWidth,
              text: text2,
              fontSize: 8,
              fill: "#333",
              // x: -width / 2 + 2,
              x: 2,
              y: 30,
            },

            // name: "root-label",
          });

          return keyShape;
        },
      });
      //非根节点的第一层节点

      //其他类型的节点
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
              // stroke: "rgba(0, 83, 255, 1)",
              stroke: "rgba(255, 0, 0, 1)",
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

          return keyShape;
        },
      });

      //自定义边
      registerEdge("tree-line", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;

          // const path = [
          //   ["M", startPoint.x, startPoint.y],
          //   ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
          //   ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
          //   ["L", endPoint.x, endPoint.y],
          // ];
          const path = [
            ["M", startPoint.x, startPoint.y],
            ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
            ["L", endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
            ["L", endPoint.x, endPoint.y],
          ];
          const shape = group.addShape("path", {
            attrs: {
              // stroke: 'rgba(43, 111, 253, 1)',
              // stroke: 'rgba(43, 111, 253, 1)',
              stroke: "#999",
              path,
            },
            name: "path-shape",
          });
          return shape;
        },
      });
      
      let graph = new TreeGraph({
        container,
        width,
        height,
        // renderer: "svg",
        modes: {
          default: [
            {
              type: "tooltip",
              formatText: function formatText(model) {
                // console.log("## model ==> ", model);
                // var text = `${model.name || ''}  (${model.count || ''}家企业)\n啦啦啦啦啦啦`
                const text = `<ul>
      <li>节点名称: ${model.name}</li>
       </ul>
       <ul>
       <li>权重: ${model.count || ""}</li>
      </ul>`;
                return text;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        //默认节点属性
        defaultNode: {
          type: "rect",
          style: {
            width: 100,
            height: 30,
          },
          labelCfg: {
            /* label's position, options: center, top, bottom, left, right */
            position: "center",
          },
        },
        //默认连线节点
        defaultEdge: {
          type: "tree-line",
        },
        layout: {
          type: "mindmap",
          direction: "H",
          // getHeight: () => 16, // 好像矩形框的高度
          // getHeight: () => 100, // 好像矩形框的高度
          // getWidth: () => 30,
          // getWidth: () => 1000, // 整个图形的宽度
          // getVGap: () => 30, //
          getVGap: () => 30, // 矩形框垂直的距离
          getHGap: () => 80, // 矩形框和连接线的距离
          getSide: (node) => {
            return node.data.state === "left" ? "left" : "right";
          },
        },
      });
  this.globalGraph = graph
      graph.on("node:click", (ev) => {
        const { item, target } = ev;
        const name = target.get("name");
        let model = item.getModel();
        console.log("## node:click ev里面的 item target ==> ", item, target);
        console.log("##node:click target-name model ==> ", name, model);
      });
      graph.node((node) => {
        return {
          label: node.name || "",
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        };
      });

      Util.traverseTree(this.treeData, (subtree) => {
        if (subtree.level === undefined) subtree.level = 0;
        subtree.children?.forEach((child) => (child.level = subtree.level + 1));
        switch (subtree.level) {
          // case 0:
          //   subtree.type = "root-node";
          //   break;
          default:
            // subtree.type = "other-node";
            subtree.type = "root-node";
        }
      });
      graph.data(this.treeData);
      graph.render();
      graph.fitView();
      // graph.zoom(0.8, { x: width * 3, y: height * 3 })
    },
    // async loadData() {
    //   const param = {
    //     industryTypeEquals: 1,
    //     pageNo: 1,
    //     pageSize: 1000
    //   }
    //   let { response } = await postForm(
    //     '/information/industryRelationshipStudy/treeData',
    //     param
    //   ).done()
    //   if (response) {
    //     this.treeData = objectProperty(response, 'data.result', {})
    //     this.initTree()
    //   }
    // }
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