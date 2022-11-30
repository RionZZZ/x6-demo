<template>
  <div class="container">
    <div class="stencil" ref="stencil"></div>
    <div class="x6" ref="x6"></div>
    <div class="mini-map" ref="miniMap"></div>
    <el-dropdown ref="menuDown" trigger="click" placement="bottom">
      <div></div>
      <el-dropdown-menu class="x6-down-menu" slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in dropdown"
          :key="index"
          :icon="item.icon"
          :command="item.command"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Graph, Edge, Node, Addon, Shape } from "@antv/x6";
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
      const miniMap = this.$refs.miniMap as HTMLElement;

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
          size: 5,
          visible: true
        },
        // 画布拖拽
        panning: {
          enabled: true
          // eventTypes: ["leftMouseDown"],
          // modifiers: "ctrl"
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
        // selecting: {
        //   enabled: true,
        //   rubberband: true,
        //   className: "select-chosen",
        //   showNodeSelectionBox: false
        // },
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
          // 等同于
          // interacting: (cellView) => {
          //   if (cellView.cell.getData()?.disableMove) {
          //     return { nodeMovable: false };
          //   }
          //   return true;
          // }
        },

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
        // 小地图
        minimap: {
          enabled: true,
          container: miniMap,
          height: 150,
          width: 250
        }
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
      this.setStencil();
    },
    initData() {
      this.nodes = initialData.nodes.map((node) => this.formatNode(node));
      this.edges = initialData.edges.map((edge) =>
        this.formatEdge(edge.source, edge.target, edge)
      );
    },
    formatNode(node: Node.Metadata) {
      return {
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
    setNodePort(node: Node) {
      const ports = {
        groups: {
          top: {
            position: "top",
            attrs: {
              circle: {
                r: 5,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              }
            }
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 5,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              }
            }
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                r: 5,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              }
            }
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 5,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              }
            }
          }
        },
        items: [
          {
            id: node.id + "port-top",
            group: "top"
          },
          {
            id: node.id + "port-bottom",
            group: "bottom"
          },
          {
            id: node.id + "port-left",
            group: "left"
          },
          {
            id: node.id + "port-right",
            group: "right"
          }
        ]
      };
      node.prop("ports", ports);
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
        console.log(node);
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
      // 鼠标移入edge
      this.g.on("edge:mouseenter", ({ edge }) => {
        edge.attr("line/stroke", "#9dd1aa");
        // 添加判断再塞值，避免修改label时出来length获取错误
        if (edge.labels.length) {
          edge.prop("labels/0", {
            attrs: {
              body: {
                stroke: "#9dd1aa",
                strokeWidth: 2
              }
            }
          });
        }
      });
      // 鼠标移出edge
      this.g.on("edge:mouseleave", ({ edge }) => {
        edge.attr("line/stroke", "#a2b1c3");
        if (edge.labels.length) {
          edge.prop("labels/0", {
            attrs: {
              body: {
                stroke: "#a2b1c3",
                strokeWidth: 1
              }
            }
          });
        }
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
        if (edge.labels.length && e.target.nodeName === "path") {
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
                if (value) {
                  cell.appendLabel({
                    position: {
                      distance: 0.5
                    },
                    ...this.edgeLabelMarkUp(value)
                  });
                }
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
      // 所有添加的节点加上链接桩
      this.g.on("node:added", ({ node }) => {
        node.setData({ disableMove: true });
        this.setNodePort(node);
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
      const { tx, ty } = this.g.translate();
      const { sx, sy } = this.g.scale();
      (this.$refs.menuDown as any).show();
      const menu = (this.$refs.menuDown as any).popperElm;
      setTimeout(() => {
        menu.setAttribute("x-placement", "bottom-start");
        menu.style.left = x * sx + tx + 30 + "px";
        menu.style.top = y * sy + ty + 20 + "px";
      }, 0);
    },
    setStencil() {
      const stencil = new Addon.Stencil({
        title: "新建节点",
        target: this.g,
        search: (cell, key) => {
          return (
            cell.shape.indexOf(key) !== -1 ||
            (cell.attr("text/text") as String).indexOf(key) !== -1
          );
        },
        placeholder: "搜索节点",
        notFoundText: "404",
        stencilGraphWidth: 300,
        stencilGraphHeight: 100,
        groups: [
          {
            name: "node",
            collapsable: false
          }
        ],
        // getDragNode: (node) => {
        //   return node.clone();
        // },
        getDropNode: (node) => {
          const shape = node.shape;
          const nodeInfo = { label: node.attrs!.text.text };
          if (shape === "rect") {
            Object.assign(nodeInfo, {
              width: 60,
              height: 32,
              shape: "rect"
            });
          } else if (shape === "circle") {
            Object.assign(nodeInfo, {
              width: 60,
              height: 60,
              shape: "circle"
            });
          }

          return this.g.createNode(this.formatNode(nodeInfo));
        }
      });
      (this.$refs.stencil as HTMLElement).appendChild(stencil.container);

      const rect = new Shape.Rect({
        width: 70,
        height: 40,
        label: "rect",
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
      });

      const circle = new Shape.Circle({
        width: 80,
        height: 80,
        label: "circle",
        attrs: {
          body: {
            fill: "#5f95ff",
            stroke: "transparent"
          },
          label: {
            fill: "#ffffff"
          }
        }
      });
      stencil.load([rect, circle], "node");
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
  position: relative;
  .x6 {
    flex: 5;
    .select-chosen {
      border: 2px dashed #696c14;
      background-color: #feb663;
    }
  }
  .mini-map {
    position: absolute;
    bottom: 20px;
    right: 36px;
    .x6-widget-minimap {
      background-color: #d8e7cc;
      .x6-graph {
        box-shadow: 0 0 4px 0 #7ca190;
      }
    }
  }
  .stencil {
    flex: 1;
    height: 100%;
    position: relative;
    margin-right: 20px;
  }
}
.x6-down-menu {
  transform: none !important;
  .popper__arrow {
    left: 20px !important;
  }
}
</style>
