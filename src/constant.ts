export const initialData = {
  nodes: [
    {
      id: "0",
      label: "顶级",
      width: 60,
      height: 32,
      shape: "rect"
      // class: "type-top",
      // description: "这是顶级node"
    },
    {
      id: "1",
      label: "次级",
      width: 60,
      height: 32,
      shape: "rect"
      // class: "type-sub-top",
      // description: "这是次顶级node"
    },
    {
      id: "2",
      label: "区分条件",
      width: 100,
      height: 80,
      shape: "ellipse"
      // description: "这是条件node"
    },
    {
      id: "3",
      label: "过滤",
      width: 60,
      height: 32,
      shape: "rect"
      // description: "这是过滤node"
    },
    {
      id: "4",
      label: "合格物品",
      width: 60,
      height: 60,
      shape: "circle"
      // description: "这是一个物品"
    },
    {
      id: "5",
      label: "残次品",
      width: 60,
      height: 60,
      shape: "circle"
      // description: "这是一个不好的物品 "
    }
  ],
  edges: [
    { source: "0", target: "1", label: "下级" },
    { source: "1", target: "2", label: "下级" },
    { source: "2", target: "4", label: "通过" },
    { source: "2", target: "3", label: "未通过" },
    { source: "3", target: "5", label: "未通过" },
    { source: "3", target: "4", label: "通过" }
  ]
};

export const downMenu = {
  node: [
    {
      icon: "el-icon-warning-outline",
      label: "详情",
      command: "nodeDetail"
    },
    {
      icon: "el-icon-delete",
      label: "删除",
      command: "nodeDelete"
    },
    {
      icon: "el-icon-connection",
      label: "添加edge",
      command: "nodeAddEdge"
    },
    {
      icon: "el-icon-link",
      label: "添加子node",
      command: "nodeAddNode"
    }
  ],
  edge: [
    {
      icon: "el-icon-warning-outline",
      label: "详情",
      command: "edgeDetail"
    },
    {
      icon: "el-icon-delete",
      label: "删除",
      command: "edgeDelete"
    }
  ],
  svg: [
    {
      icon: "el-icon-plus",
      label: "添加node",
      command: "addNode"
    },
    {
      icon: "el-icon-plus",
      label: "添加流程",
      command: "addFlow"
    }
  ]
};

export const shapes = ["rect", "ellipse", "circle", "diamond"];

export const appendData = {
  nodes: [
    {
      id: "60",
      label: "顶级",
      shape: "rect",
      class: "type-top",
      description: "这是顶级node"
    },
    {
      id: "61",
      label: "次级",
      shape: "rect",
      class: "type-sub-top",
      description: "这是次顶级node"
    },
    {
      id: "62",
      label: "区分条件",
      shape: "diamond",
      description: "这是条件node"
    },
    {
      id: "63",
      label: "过滤",
      shape: "rect",
      description: "这是过滤node"
    },
    {
      id: "64",
      label: "合格物品",
      shape: "circle",
      description: "这是一个物品"
    },
    {
      id: "65",
      label: "残次品",
      shape: "circle",
      description: "这是一个不好的物品 "
    }
  ],
  edges: [
    { source: "60", target: "61", label: "下级" },
    { source: "61", target: "62", label: "下级" },
    { source: "62", target: "64", label: "通过" },
    { source: "62", target: "63", label: "未通过" },
    { source: "63", target: "65", label: "未通过" },
    { source: "63", target: "64", label: "通过" }
  ]
};
