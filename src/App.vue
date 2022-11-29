<template>
  <div class="container">
    <div id="x6" ref="x6"></div>
    <el-dropdown ref="menuDown" trigger="click" placement="bottom">
      <div></div>
      <el-dropdown-menu class="x6-down-menu" slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in dropdown"
          :key="index"
          :icon="item.icon"
          :command="item.command"
          >{{ item.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Graph, Edge, Node, Cell } from "@antv/x6";
import { CellEditor } from "@antv/x6/es/registry/tool/editor";
import Layout, { DagreLayout } from "@antv/layout";
import { initialData, downMenu, DownMenu } from "./constant";

export default Vue.extend({
  name: "App",
  data() {
    return {
      g: {} as Graph,
      nodes: [] as Node.Metadata[],
      edges: [] as Edge.Metadata[],
      dropdown: [] as DownMenu[]
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
          color: "#dfdfdf"
        },
        // 网格
        grid: {
          size: 15,
          visible: true
        },
        // 画布拖拽
        panning: {
          enabled: true,
          eventTypes: ["leftMouseDown"],
          modifiers: "ctrl"
        },
        // 滚轮缩放
        mousewheel: true,
        // 缩放临界值
        scaling: {
          max: 4,
          min: 0.5
        },
        // 节点缩放
        // resizing: {
        //   enabled: true,
        //   restricted: true
        // },
        // 节点拖拽
        translating: {
          restrict: -10
        },
        // 框选
        selecting: {
          enabled: true,
          rubberband: true,
          className: "select-chosen",
          showNodeSelectionBox: false
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
        },
        interacting: {
          // 配置node是否可拖拽
          nodeMovable: (cellView) => {
            return !!cellView.cell.getData()?.disableMove;
          }
        }
        // interacting: (cellView) => {
        //   if (cellView.cell.getData()?.disableMove) {
        //     return { nodeMovable: false };
        //   }
        //   return true;
        // }
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

      this.addEvents();
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
            strokeWidth: 4,
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
        labels: [this.edgeLabelMarkUp(edge.label)]
      };
    },
    edgeLabelMarkUp(value: string) {
      return {
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
            text: value,
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            fontSize: 14,
            fill: "#5f95ff"
          },
          body: {
            cursor: "pointer",
            fill: "#d3d3d3",
            stroke: "#a2b1c3",
            strokeWidth: 1
          }
        }
      };
    },
    addEvents() {
      // 鼠标移入node
      this.g.on("node:mouseenter", ({ node }) => {
        this.g.getNodes().forEach((node) => {
          node.removeTool("button-remove");
          node.attr("body/stroke", "transparent");
        });
        node.addTools({
          name: "button-remove",
          args: {
            x: "100%",
            y: 0,
            offset: { x: -5, y: 5 }
          }
        });
        node.attr("body/stroke", "#9dd1aa");
      });

      // 鼠标移出node
      this.g.on("node:mouseleave", ({ node }) => {
        // 添加silent为true，不更新tools
        node.removeTool("button-remove", {
          silent: node.getTools()!.items.length > 1
        });
        node.attr("body/stroke", "transparent");
      });
      // 鼠标点击空白区域消除删除按钮
      // this.g.on("blank:click", () => {
      //   this.g.getNodes().forEach((node) => {
      //     node.removeTool("button-remove");
      //   });
      // });
      // 鼠标移入edge
      this.g.on("edge:mouseenter", ({ edge }) => {
        edge.attr("line/stroke", "#9dd1aa");
        edge.prop("labels/0", {
          attrs: {
            body: {
              stroke: "#9dd1aa"
            }
          }
        });
      });
      // 鼠标移出edge
      this.g.on("edge:mouseleave", ({ edge }) => {
        edge.attr("line/stroke", "#a2b1c3");
        edge.prop("labels/0", {
          attrs: {
            body: {
              stroke: "#a2b1c3"
            }
          }
        });
      });
      // 双击节点修改label
      this.g.on("node:dblclick", ({ node, e }) => {
        node.addTools({
          name: "node-editor",
          args: {
            event: e,
            setText: (args: any) => {
              (
                CellEditor.NodeEditor.getDefaults() as {
                  setText: (args: any) => void;
                }
              ).setText(args);
            }
          }
        });
      });
      // 双击edge修改label
      this.g.on("edge:dblclick", ({ edge, e }) => {
        // 只作用到label上
        if (e.target.nodeName === "path") {
          return;
        }

        // 修正连续点击多个edge导致定位计算bug
        this.g.getEdges().forEach((edge) => {
          edge.removeTool("edge-editor");
        });
        edge.addTools({
          name: "edge-editor",
          args: {
            event: e,
            setText: ({
              cell,
              value,
              index
            }: {
              cell: Edge;
              value: string;
              index?: number;
            }) => {
              if (index === -1) {
                // // 添加判断label数目，只允许输入一个label
                // if (edge.labels.length >= 1) {
                //   // 修改
                //   cell.prop(`labels/0/attrs/label/text`, value);
                // } else {
                //   // 新增
                cell.appendLabel({
                  position: {
                    distance: 0.5
                  },
                  ...this.edgeLabelMarkUp(value)
                });
                // }
              } else {
                if (value) {
                  cell.prop(`labels/${index}/attrs/label/text`, value);
                } else if (typeof index === "number") {
                  cell.removeLabelAt(index);
                }
              }
            }
            // setText: (args: any) => {
            //   CellEditor.EdgeEditor.getDefaults().setText(args);
            // }
          }
        });
      });
      // 鼠标右键点击画布
      this.g.on("blank:contextmenu", ({ e, x, y }) => {
        this.showSvgMenu(x, y);
      });
    },
    showSvgMenu(x: number, y: number) {
      this.dropdown = downMenu.svg;
      this.showMenu(x, y);
    },
    // showNodeMenu(node) {
    //   this.currentNode = node;
    //   this.dropdown = downMenu.node;
    //   this.showMenu();
    // },
    // showEdgeMenu(edge) {
    //   this.currentEdge = edge;
    //   this.dropdown = downMenu.edge;
    //   this.showMenu();
    // },
    showMenu(x: number, y: number) {
      console.log(x, y);
      console.log(this.g.scale());
      console.log(this.g.translate());
      const { tx, ty } = this.g.translate();
      const { sx, sy } = this.g.scale();
      (this.$refs.menuDown as any).show();
      const menu = (this.$refs.menuDown as any).popperElm;
      setTimeout(() => {
        menu.setAttribute("x-placement", "bottom-start");
        menu.style.left = x * sx + tx + 30 + "px";
        menu.style.top = y * sy + ty + 20 + "px";
      }, 0);
    }
  },
  beforeDestroy() {
    this.g.dispose();
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 20px 36px;
  box-sizing: border-box;
  #x6 {
    flex: 1;
    .select-chosen {
      border: 2px dashed #696c14;
      background-color: #feb663;
    }
  }
}
.x6-down-menu {
  transform: none !important;
  .popper__arrow {
    left: 20px !important;
  }
}
</style>
