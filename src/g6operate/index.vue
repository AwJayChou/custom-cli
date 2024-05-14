<template>
  <div>
    <div id="container"></div>
  </div>
</template>
 
<script>
// https://blog.csdn.net/qq_41579104/article/details/113388616
import G6 from "@antv/g6";  //注意引入 
import { renderMap } from "./config"; //朱茵引入封装的函数
export default {
  data() {
    return {
      graph: {}, //定义一个graph对象
      data: {    //定义一个公共数据数组
        id: "root",
        label: "root",
        name: 1,
        children: [
          {
            id: "c1",
            label: "c1",
            name: 2,
 
            children: [
              {
                id: "c1-1",
                label: "c1-1",
                name: 3
              },
              {
                id: "c1-2",
                label: "c1-2",
                name: 3,
                children: [
                  {
                    id: "c1-2-1",
                    label: "c1-2-1",
                    name: 4
                  },
                  {
                    id: "c1-2-2",
                    label: "c1-2-2",
                    name: 4
                  }
                ]
              }
            ]
          },
          {
            id: "c2",
            label: "c2",
            name: 2
          },
          {
            id: "c3",
            label: "c3",
            name: 2,
 
            children: [
              {
                id: "c3-1",
                label: "c3-1",
                name: 3
              },
              {
                id: "c3-2",
                label: "c3-2",
                name: 3,
 
                children: [
                  {
                    id: "c3-2-1",
                    label: "c3-2-1",
                    name: 4
                  },
                  {
                    id: "c3-2-2",
                    label: "c3-2-2",
                    name: 4
                  },
                  {
                    id: "c3-2-3",
                    label: "c3-2-3",
                    name: 4
                  }
                ]
              },
              {
                id: "c3-3",
                label: "c3-3",
                name: 3
              }
            ]
          }
        ]
      },
    };
  },
  mounted() {
    this.render(); //注意渲染
  },
  methods: {
    render() {
      const defaultStateStyles = {
        hover: {
          stroke: "#1890ff",
          lineWidth: 2
        }
      };
      const defaultNodeStyle = {
        fill: "#F3F7FF",
        stroke: "#3759B0",
        radius: 5
      };
      const defaultLabelCfg = {
        style: {
          fill: "#000",
          fontSize: 12
        }
      };
      const defaultLayout = {
        type: "compactBox",
        direction: "LR",
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 40;
        },
        getHGap: function getHGap() {
          return 70;
        }
      };
      const width = document.getElementById("container").scrollWidth;
      const height = document.getElementById("container").scrollHeight || 450;
      this.graph = new G6.TreeGraph({
        container: "container",
        width: width,
        height: height,
        linkCenter: true,
        modes: {
          default: ["drag-canvas", "zoom-canvas"]
        },
        defaultNode: {
          type: "icon-node",
          size: [120, 40],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg
        },
        defaultEdge: {
          type: "cubic-horizontal",
          style: {
            stroke: "#A3B1BF"
          }
        },
        nodeStateStyles: defaultStateStyles,
        edgeStateStyles: defaultStateStyles,
        layout: defaultLayout
      });
      //节点双击事件，这里的编辑页面用的是浏览器的弹窗，也可自己编写页面进行调用
      this.graph.on('node:dblclick', (evt,element) => {
          console.log(evt,element)
          const { item, target } = evt
          console.log(evt)
          const targetType = target.get('type')
          const name = target.get('name')
          console.log(target)
          var str=prompt("随便写点儿啥吧",target.attrs.text);
        })
      this.graph.on('node:click', evt => {
          const { item, target } = evt
          const targetType = target.get('type')
          const name = target.get('name')
 console.log('## name ==> ', name)
      // 增加元素，这里增加元素也是用的浏览器的弹窗
      if (targetType === 'marker') {
        const model = item.getModel()
        if (name === 'add-item') {
          if (!model.children) {
            model.children = []
      }
          const id = 'ra'+ Math.random();
          var str=prompt("请输入节点名称","比如c3-3-4");
      if(str){
            target.attrs.text = str
            model.children.push({
                id,
                name:1,
                label: str,
            })
          this.graph.updateChild(model, model.id)
      }
      //删除节点
        } else if (name === 'remove-item') {
          this.graph.removeChild(model.id)
        }
      }
    })
      renderMap(this.data, this.graph); //别忘了渲染
    },
  }
};
</script>
 
<style scoped>
@media screen and (min-width: 200px) and (max-width: 1600px) {
  #container {
    margin-top: 1%;
    height: 350px;
  }
}
@media screen and (min-width: 1601px) {
  #container {
    height: 500px;
    margin-top: 2%;
  }
}
</style>