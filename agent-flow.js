const agentFlowSteps = [
  { id: "intake", title: "需求提出", summary: "业务需求结构化", roles: ["agent", "human"], paths: ["cbb"] },
  { id: "req_review", title: "需求评审", summary: "业务价值确认", roles: ["human"], paths: ["cbb"] },
  { id: "understand", title: "需求拆解", summary: "场景与复用判断", roles: ["agent", "human"], paths: ["cbb"] },
  { id: "eda", title: "数据探索", summary: "特征提取与样本验证", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "logic", title: "模型设计", summary: "计算逻辑与判断规则", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "review", title: "模型评审", summary: "逻辑解释与效果评审", roles: ["human"], paths: ["battery", "cbb"] },
  { id: "code", title: "测试验证", summary: "用例测试与边界验证", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "deploy", title: "部署上线", summary: "配置管理与上线发布", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "ops", title: "运营监测", summary: "效果追踪反馈", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "iteration", title: "模型迭代", summary: "版本迭代优化", roles: ["agent", "human"], paths: ["battery", "cbb"] }
];

const agentFlowNodes = [
  { id: "intake", x: 40, y: 80, w: 200, h: 76 },
  { id: "req_review", x: 285, y: 45, w: 220, h: 146, shape: "diamond" },
  { id: "understand", x: 560, y: 45, w: 240, h: 146, shape: "diamond" },
  { id: "eda", x: 980, y: 80, w: 200, h: 76 },
  { id: "logic", x: 1260, y: 205, w: 220, h: 80 },
  { id: "review", x: 995, y: 255, w: 230, h: 150, shape: "diamond" },
  { id: "code", x: 655, y: 255, w: 230, h: 150, shape: "diamond" },
  { id: "deploy", x: 375, y: 292, w: 200, h: 76 },
  { id: "ops", x: 90, y: 255, w: 230, h: 150, shape: "diamond" },
  { id: "iteration", x: 600, y: 550, w: 220, h: 80, kind: "loop" }
];

const agentFlowEdges = [
  { paths: ["cbb"], d: "M240 118 L285 118" },
  { paths: ["cbb"], d: "M505 118 L560 118", label: { x: 532, y: 92, w: 92, text: "评审通过" } },
  { paths: ["cbb"], d: "M395 191 L395 225 L140 225 L140 156", label: { x: 290, y: 210, w: 105, text: "评审不通过" } },
  { paths: ["cbb"], d: "M800 118 L980 118", label: { x: 890, y: 142, w: 170, text: "不可合并：新模型开发" } },
  { paths: ["cbb"], d: "M680 191 L680 225 L590 225 L590 515 L710 515 L710 550", label: { x: 610, y: 210, w: 190, text: "可合并：已有模型迭代" } },
  { paths: ["battery", "cbb"], d: "M1180 118 L1370 118 L1370 205" },
  { paths: ["battery", "cbb"], d: "M1260 245 L1235 245 L1235 330 L1225 330" },
  { paths: ["battery", "cbb"], d: "M995 330 L885 330", label: { x: 940, y: 305, w: 92, text: "评审通过" } },
  { paths: ["battery", "cbb"], d: "M655 330 L575 330", label: { x: 615, y: 305, w: 80, text: "测试通过" } },
  { paths: ["battery", "cbb"], d: "M375 330 L320 330" },
  { paths: ["battery", "cbb"], d: "M1110 405 L1110 450 L1325 450 L1325 285", label: { x: 1188, y: 438, w: 110, text: "评审不通过" } },
  { paths: ["battery", "cbb"], d: "M770 405 L770 505 L1370 505 L1370 285", label: { x: 1115, y: 520, w: 110, text: "测试不通过" } },
  { paths: ["battery", "cbb"], d: "M320 330 L320 590 L600 590", label: { x: 470, y: 575, w: 110, text: "需要迭代" } },
  { paths: ["battery", "cbb"], d: "M90 330 L45 330 L45 455 L205 455 L205 405", label: { x: 120, y: 475, w: 170, text: "无需迭代：持续监测" } },
  { paths: ["battery", "cbb"], d: "M820 590 L930 590 L930 670 L1415 670 L1415 285", label: { x: 1140, y: 655, w: 120, text: "版本更新" } }
];

let activeAgentSource = "battery";
const agentFlowChart = document.getElementById("agentFlowChart");

function renderAgentEdgeLabel(label, hot) {
  const width = label.w || 110;
  return `<rect class="agent-edge-label-bg ${hot ? "path-hot" : "muted"}" x="${label.x - width / 2}" y="${label.y - 17}" width="${width}" height="24" rx="12"></rect><text class="agent-flow-label ${hot ? "path-hot" : "muted"}" x="${label.x}" y="${label.y}" text-anchor="middle">${label.text}</text>`;
}

function renderAgentEdge(edge, style) {
  const hot = edge.paths.includes(activeAgentSource);
  const label = edge.label ? renderAgentEdgeLabel(edge.label, hot) : "";
  return `<path class="agent-flow-link ${hot ? "path-hot" : "muted"}" style="--path-color:${style.color};--path-glow:${style.glow}" d="${edge.d}"></path>${label}`;
}

function renderAgentNode(node, index, style) {
  const step = agentFlowSteps.find((item) => item.id === node.id);
  const hot = step.paths.includes(activeAgentSource);
  const roleClass = step.roles.length > 1 ? "role-mixed" : step.roles[0] === "human" ? "role-human" : "role-agent";
  const nodeGlow = step.roles.length > 1 ? "rgba(255,189,89,.28)" : step.roles[0] === "human" ? "rgba(255,189,89,.32)" : "rgba(34,216,255,.32)";
  const tagWidth = step.roles.length > 1 ? 112 : 62;
  const tagX = node.shape === "diamond" ? node.x + node.w / 2 - tagWidth / 2 : node.x + node.w - tagWidth - 12;
  const shape = node.shape === "diamond"
    ? `<polygon class="shape" points="${node.x + node.w / 2},${node.y} ${node.x + node.w},${node.y + node.h / 2} ${node.x + node.w / 2},${node.y + node.h} ${node.x},${node.y + node.h / 2}"></polygon>`
    : `<rect class="shape" x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="${node.kind === "loop" ? 26 : 20}"></rect>`;
  const titleX = node.shape === "diamond" ? node.x + node.w / 2 : node.x + 66;
  const anchor = node.shape === "diamond" ? "middle" : "start";
  const titleY = node.shape === "diamond" ? node.y + node.h / 2 - 3 : node.y + 38;
  const summaryY = node.shape === "diamond" ? node.y + node.h / 2 + 22 : node.y + 62;
  const tags = step.roles.map((role) => `<span class="agent-svg-node-tag ${role === "human" ? "human" : "agent"}">${role === "human" ? "人工" : "Agent"}</span>`).join("");
  return `<g class="agent-svg-node ${roleClass} ${hot ? "path-hot" : "muted"}" style="--path-color:${style.color};--path-glow:${style.glow};--node-glow:${nodeGlow}">${shape}<circle cx="${node.x + 28}" cy="${node.y + node.h / 2}" r="15" fill="rgba(255,255,255,.08)"></circle><text class="number" x="${node.x + 20}" y="${node.y + node.h / 2 + 4}">${String(index + 1).padStart(2, "0")}</text><text class="title" x="${titleX}" y="${titleY}" text-anchor="${anchor}">${step.title}</text><text class="summary" x="${titleX}" y="${summaryY}" text-anchor="${anchor}">${step.summary}</text><foreignObject x="${tagX}" y="${node.y - 12}" width="${tagWidth}" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="agent-svg-node-tag-wrap">${tags}</div></foreignObject></g>`;
}

function renderAgentFlow() {
  if (!agentFlowChart) return;
  const style = { color: "#62b8ff", glow: "rgba(98,184,255,.32)" };
  agentFlowChart.innerHTML = `<defs><linearGradient id="agentRoleGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#22d8ff"></stop><stop offset="100%" stop-color="#ffbd59"></stop></linearGradient><marker id="agentArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L8,3 z" fill="rgba(122,211,255,.75)"></path></marker></defs>${agentFlowEdges.map((edge) => renderAgentEdge(edge, style)).join("")}${agentFlowNodes.map((node, index) => renderAgentNode(node, index, style)).join("")}`;
}

document.querySelectorAll(".agent-source-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activeAgentSource = button.dataset.agentSource;
    document.querySelectorAll(".agent-source-btn").forEach((item) => item.classList.toggle("active", item === button));
    renderAgentFlow();
  });
});

renderAgentFlow();
