let websocket: WebSocket;
export const linkWebsocket = () => {
  if ("WebSocket" in window) {
    websocket = new WebSocket("ws://localhost:8848?devID=998");
    setSocket(websocket);
  }
};

const HeartLink: {
  time: number;
  timeLink: number;
  start: Function;
} = {
  time: 5000,
  timeLink: 0,
  start: function () {
    this.timeLink = window.setTimeout(function () {
      console.log("尝试重新建立连接");
      linkWebsocket();
    }, this.time);
  },
};

// const
const getMessage = (evnt: MessageEvent<any>) => {
  const { data } = evnt;
  console.log("接收信息", JSON.parse(data));
};

const setSocket = (websocket: WebSocket) => {
  websocket.onopen = function (evnt) {
    console.log("连接已经建立", evnt);
  };
  websocket.onmessage = function (evnt) {
    getMessage(evnt);
  };
  websocket.onerror = function (evnt) {
    console.log("发生错误", evnt);
  };
  websocket.onclose = function (evnt) {
    console.log("连接断开", evnt);
    HeartLink.start();
  };
};

const sendMessage = (data: any) => {
  websocket.send(JSON.stringify(data));
};

// 获取可用频道列表
const sendGet = (id: number) => {
  const sendObj = {
    jsonrpc: 2.0,
    method: "get",
    params: {
      entity: "channels",
    },
    id,
  };
  sendMessage(sendObj);
};

// 添加订阅频道
const sendAdd = () => {
  const sendObj = {
    jsonrpc: "2.0",
    method: "add",
    params: {
      data: ["pos", "notify"],
      entity: "subscriptions",
      userEmail: "test@redpointpositioning.com",
      authToken: "y3jK0EU-TkKKIxBETwup",
      project_uid: "jVrlR-ZERcmq0urnJ41Jgg",
    },
    id: 19,
  };
  sendMessage(sendObj);
};
// 取消订阅频道。
const sendDelete = () => {
  const sendObj = {
    jsonrpc: "2.0",
    method: "delete",
    params: {
      data: ["alarm"],
      entity: "subscriptions",
      userEmail: "test@redpointpositioning.com",
      authToken: "y3jK0EU-TkKKIxBETwup",
      project_uid: "jVrlR-ZERcmq0urnJ41Jgg",
    },
    id: 24,
  };
  sendMessage(sendObj);
};

export const send = {
  get: sendGet,
  add: sendAdd,
  delete: sendDelete,
};
