<template>
  <div class="container">
    <div id="x6" ref="x6"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Graph, Edge, Node } from "@antv/x6";
import Layout, { DagreLayout } from "@antv/layout";
import { initialData } from "./constant";

export default Vue.extend({
  name: "App",
  data() {
    return {
      g: {} as Graph,
      nodes: [] as Node.Metadata[],
      edges: [] as Edge.Metadata[]
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const x6 = this.$refs.x6 as HTMLElement;

      this.g = new Graph({
        container: x6,
        // 自适应宽高
        autoResize: true,
        // 背景色
        background: {
          color: "#d3d3d3"
        },
        // 网格
        grid: {
          size: 5,
          visible: true
        },
        // 画布拖拽
        panning: {
          enabled: true,
          eventTypes: ["rightMouseDown"]
          // modifiers: "shift"
        },
        // 滚轮缩放
        mousewheel: true,
        // 缩放临界值
        scaling: {
          max: 4,
          min: 0.5
        },
        // 节点缩放
        resizing: {
          enabled: true,
          restricted: true
        },
        // 节点拖拽
        translating: {
          restrict: -10
        },
        // 框选
        selecting: {
          enabled: true,
          rubberband: true,
          className: "select-chosen",
          showNodeSelectionBox: true
        },
        // 连线
        connecting: {
          snap: {
            radius: 30
          },
          allowMulti: false,
          allowLoop: false,
          allowEdge: false,
          highlight: true
        }
        // highlighting: {
        //   magnetAvailable: {
        //     name: "stroke",
        //     args: {
        //       padding: 4,
        //       attrs: {
        //         "stroke-width": 2,
        //         stroke: "red"
        //       }
        //     }
        //   }
        // }
      });

      const dagreLayout = new DagreLayout({
        type: "dagre",
        rankdir: "LR",
        align: "DL",
        controlPoints: true
      });

      this.initData();

      this.g.fromJSON(
        dagreLayout.layout({
          nodes: this.nodes as Layout.Node[],
          edges: this.edges as Layout.Edge[]
        })
      );
    },
    initData() {
      this.nodes = initialData.nodes.map((node) =>
        this.formatNode(node.id, node)
      );
      this.edges = initialData.edges.map((edge) =>
        this.formatEdge(edge.source, edge.target, edge)
      );
    },
    formatNode(id: string, node: Node.Metadata) {
      return {
        id,
        ...node,
        attrs: {
          body: {
            fill: "#5f95ff",
            stroke: "transparent",
            rx: 5,
            ry: 5
          },
          label: {
            fill: "#ffffff"
          }
        }
      };
    },
    formatEdge(source: string, target: string, edge: Edge.Metadata) {
      return {
        source,
        target,
        attrs: {
          line: {
            stroke: "#a2b1c3",
            strokeWidth: 2
          }
        },
        labels: [
          {
            markup: [
              {
                tagName: "rect",
                selector: "body"
              },
              {
                tagName: "text",
                selector: "label"
              }
            ],
            attrs: {
              label: {
                cursor: "pointer",
                text: edge.label,
                textAnchor: "middle",
                textVerticalAnchor: "middle",
                fontSize: 14,
                fill: "#8d939b"
              },
              body: {
                cursor: "pointer",
                ref: "label",
                refX: "-20%",
                refY: "-20%",
                refWidth: "140%",
                refHeight: "140%",
                fill: "#d3d3d3",
                stroke: "#a2b1c3",
                strokeWidth: 1
              }
            }
          }
        ]
      };
    }
  },
  beforeDestroy() {
    this.g.dispose();
  }
});
</script>

<style>
body {
  margin: 0;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 20px 36px;
  box-sizing: border-box;
}
#x6 {
  flex: 1;
}
.select-chosen {
  border: 2px dashed #696c14;
  background-color: #feb663;
}
</style>
