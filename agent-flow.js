const agentFlowSteps = [
  { id: "intake", title: "需求提出", summary: "业务需求结构化", roles: ["agent", "human"], paths: ["cbb"], skills: ["requirement"] },
  { id: "req_review", title: "需求评审", summary: "业务价值确认", roles: ["human"], paths: ["cbb"], branch: ["评审通过", "评审不通过"] },
  { id: "understand", title: "需求拆解", summary: "场景与复用判断", roles: ["agent", "human"], paths: ["cbb"], skills: ["requirement"], branch: ["可合并：已有模型迭代", "不可合并：新模型开发"] },
  { id: "eda", title: "数据探索", summary: "特征提取与样本验证", roles: ["agent"], paths: ["battery", "cbb"], skills: ["data"] },
  { id: "logic", title: "模型设计", summary: "计算逻辑与判断规则", roles: ["agent"], paths: ["battery", "cbb"], skills: ["model"] },
  { id: "review", title: "模型评审", summary: "逻辑解释与效果评审", roles: ["human"], paths: ["battery", "cbb"], branch: ["评审通过", "评审不通过"] },
  { id: "code", title: "测试验证", summary: "用例测试与边界验证", roles: ["agent"], paths: ["battery", "cbb"], skills: ["test"], branch: ["测试通过", "测试不通过"] },
  { id: "deploy", title: "部署上线", summary: "配置管理与上线发布", roles: ["agent"], paths: ["battery", "cbb"] },
  { id: "ops", title: "运营监测", summary: "效果追踪反馈", roles: ["agent"], paths: ["battery", "cbb"], skills: ["ops"], branch: ["需要迭代", "无需迭代"] },
  { id: "iteration", title: "模型迭代", summary: "版本迭代优化", roles: ["agent", "human"], paths: ["battery", "cbb"], skills: ["model"] }
];

const agentSkillCatalog = {
  requirement: "需求解析 Skill",
  data: "数据探索skill",
  model: "模型设计 Skill",
  test: "模型测试 Skill",
  ops: "运营监测 Skill"
};

const agentSourceDetails = {
  battery: {
    eda: { support: ["依据机理分析假设，利用伽利略Codex自动提取云端数据中相关测点，进行假设中特征、趋势、分布等探索性分析及验证。"], outputs: ["数据探索报告（html）", "数据探索计算脚本（py）"] },
    logic: { support: ["基于数据探索结果构建模型设计方案，包含主逻辑、阈值、窗口、屏蔽条件和风险等级等技术细节。"], outputs: ["初版模型设计文档（Markdown）", "初版模型计算脚本（py）"] },
    review: { decision: ["评审模型设计方案的逻辑合理性、可解释性，判断试运行结果的准确率、覆盖度是否满足要求。"], branch: ["评审通过。", "评审不通过。"], outputs: ["冻结版模型设计文档（Markdown）", "冻结版模型计算脚本（py）"] },
    code: { support: ["基于模型功能设计测试用例，在测试环境进行测试验证。"], branch: ["测试通过。", "测试不通过。"], outputs: ["测试验证报告（html）", "测试数据集（csv/parquet）"] },
    deploy: { support: ["将测试通过的模型自动打包、上架，完成上线配置，更新版本记录。"], outputs: ["模型上线配置", "上线版本记录"] },
    ops: { support: ["自动监测作业成功率、预警数量，记录误报/漏报case，形成运营复盘。"], branch: ["需要迭代。", "无需迭代：持续运营监测。"], outputs: ["运营监测看板", "运营监测报告（html）"] },
    iteration: { support: ["基于运营监测结果，生成模型优化方案和版本变更建议。"], decision: ["人工确认迭代范围、优先级和是否进入下一版本。"], outputs: ["模型迭代建议（Markdown）", "新版模型计算脚本（py）"] }
  },
  cbb: {
    intake: { support: ["将自然语言描述的模型需求转化为结构化的需求文档。"], decision: ["挖掘业务痛点，梳理相应的模型需求。"], outputs: ["初版BRD需求文档（Markdown）"] },
    req_review: { decision: ["判断需求价值、数据可行性、业务边界和优先级。"], branch: ["评审通过。", "评审不通过。"], outputs: ["冻结版BRD需求文档（Markdown）"] },
    understand: { support: ["拆解风险场景、测点参数，检索已有模型，判断模型复用可能性。"], decision: ["确认需求拆解及复用判断是否符合业务诉求。"], branch: ["可合并：进入模型迭代，迭代已有模型。", "不可合并：进入数据探索，开发新模型。"], outputs: ["PRD需求文档（Markdown）", "模型开发排期"] },
    eda: { support: ["基于PRD需求文档，利用伽利略Codex自动提取云端数据中相关测点，进行需求中特征、趋势、分布等探索性分析及验证。"], outputs: ["数据探索报告（html）", "数据探索计算脚本（py）"] },
    logic: { support: ["基于数据探索结果构建模型设计方案，包含主逻辑、阈值、窗口、屏蔽条件和风险等级等技术细节。"], outputs: ["初版模型设计文档（Markdown）", "初版模型计算脚本（py）"] },
    review: { decision: ["评审模型设计方案的逻辑合理性、可解释性，判断试运行结果的准确率、覆盖度是否满足要求。"], branch: ["评审通过。", "评审不通过。"], outputs: ["冻结版模型设计文档（Markdown）", "冻结版模型计算脚本（py）"] },
    code: { support: ["基于模型功能设计测试用例，在测试环境进行测试验证。"], branch: ["测试通过。", "测试不通过。"], outputs: ["测试验证报告（html）", "测试数据集（csv/parquet）"] },
    deploy: { support: ["将测试通过的模型自动打包、上架，完成上线配置，更新版本记录。"], outputs: ["模型上线配置", "上线版本记录"] },
    ops: { support: ["自动监测作业成功率、预警数量，记录误报/漏报case，形成运营复盘。"], branch: ["需要迭代。", "无需迭代：持续运营监测。"], outputs: ["运营监测看板", "运营监测报告（html）"] },
    iteration: { support: ["基于运营监测结果，生成模型优化方案和版本变更建议。"], decision: ["人工确认迭代范围、优先级和是否进入下一版本。"], outputs: ["模型迭代建议（Markdown）", "新版模型计算脚本（py）"] }
  }
};

const agentDetailKeywords = ["业务痛点", "结构化", "需求文档", "需求价值", "数据可行性", "业务边界", "优先级", "风险场景", "测点参数", "已有模型", "模型复用", "机理分析假设", "云端数据", "相关测点", "特征", "趋势", "分布", "探索性分析", "数据探索结果", "模型设计方案", "主逻辑", "阈值", "窗口", "屏蔽条件", "风险等级", "逻辑合理性", "可解释性", "试运行结果", "准确率", "覆盖度", "测试用例", "测试环境", "自动打包", "上线配置", "版本记录", "作业成功率", "预警数量", "误报", "漏报", "运营复盘", "运营监测结果", "模型优化方案", "版本变更建议", "迭代范围", "下一版本", "BRD", "PRD", "Markdown", "html", "py", "csv/parquet"];

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
let expandedAgentFlowId = null;
const agentFlowChart = document.getElementById("agentFlowChart");
const agentPopoverLayer = document.getElementById("agentPopoverLayer");

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
  return `<g class="agent-svg-node ${roleClass} ${hot ? "path-hot" : "muted"}" data-agent-flow="${node.id}" role="button" tabindex="${hot ? 0 : -1}" aria-label="查看${step.title}详情" style="--path-color:${style.color};--path-glow:${style.glow};--node-glow:${nodeGlow}">${shape}<circle cx="${node.x + 28}" cy="${node.y + node.h / 2}" r="15" fill="rgba(255,255,255,.08)"></circle><text class="number" x="${node.x + 20}" y="${node.y + node.h / 2 + 4}">${String(index + 1).padStart(2, "0")}</text><text class="title" x="${titleX}" y="${titleY}" text-anchor="${anchor}">${step.title}</text><text class="summary" x="${titleX}" y="${summaryY}" text-anchor="${anchor}">${step.summary}</text><foreignObject x="${tagX}" y="${node.y - 12}" width="${tagWidth}" height="28"><div xmlns="http://www.w3.org/1999/xhtml" class="agent-svg-node-tag-wrap">${tags}</div></foreignObject></g>`;
}

function renderAgentFlow() {
  if (!agentFlowChart) return;
  const style = { color: "#62b8ff", glow: "rgba(98,184,255,.32)" };
  agentFlowChart.innerHTML = `<defs><linearGradient id="agentRoleGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#22d8ff"></stop><stop offset="100%" stop-color="#ffbd59"></stop></linearGradient><marker id="agentArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L8,3 z" fill="rgba(122,211,255,.75)"></path></marker></defs>${agentFlowEdges.map((edge) => renderAgentEdge(edge, style)).join("")}${agentFlowNodes.map((node, index) => renderAgentNode(node, index, style)).join("")}`;
  agentFlowChart.querySelectorAll(".agent-svg-node.path-hot").forEach((node) => {
    const toggle = (event) => {
      event.stopPropagation();
      expandedAgentFlowId = expandedAgentFlowId === node.dataset.agentFlow ? null : node.dataset.agentFlow;
      renderAgentPopover();
    };
    node.addEventListener("click", toggle);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") toggle(event);
    });
  });
  renderAgentPopover();
}

function getAgentSourceDetail(step) {
  const detail = agentSourceDetails[activeAgentSource]?.[step.id] || {};
  return {
    agent: detail.agent || detail.support || [],
    human: detail.human || detail.decision || [],
    outputs: detail.outputs || ["待生成交付物"]
  };
}

function highlightAgentDetail(text) {
  return agentDetailKeywords.reduce((value, keyword) => value.split(keyword).join(`<span class="agent-detail-keyword">${keyword}</span>`), text);
}

function renderAgentDetailItems(items) {
  return items.map((item) => `<li>${highlightAgentDetail(item)}</li>`).join("");
}

function buildAgentPopover(step) {
  const detail = getAgentSourceDetail(step);
  const skills = step.skills?.length
    ? `<div class="agent-skill-cards">${step.skills.map((id) => `<span class="agent-skill-card">${agentSkillCatalog[id]}</span>`).join("")}</div>`
    : "";
  const agentSection = step.roles.includes("agent") && detail.agent.length
    ? `<div class="agent-popover-section"><small>Agent 执行</small><ul>${renderAgentDetailItems(detail.agent)}</ul></div>`
    : "";
  const humanSection = step.roles.includes("human") && detail.human.length
    ? `<div class="agent-popover-section"><small>人工介入</small><ul>${renderAgentDetailItems(detail.human)}</ul></div>`
    : "";
  const roleSections = step.id === "intake" ? `${humanSection}${agentSection}` : `${agentSection}${humanSection}`;
  const roles = step.roles.map((role) => `<span class="agent-svg-node-tag ${role === "human" ? "human" : "agent"}">${role === "human" ? "人工" : "Agent"}</span>`).join("");
  return `<div class="agent-popover" data-agent-flow="${step.id}"><div class="agent-popover-header"><h4>${step.title}</h4><div class="agent-popover-roles">${roles}</div></div>${skills}${roleSections}<div class="agent-popover-section"><small>关键交付物</small><ul>${detail.outputs.map((item) => `<li>${item}</li>`).join("")}</ul></div></div>`;
}

function positionAgentPopover() {
  const popover = agentPopoverLayer?.querySelector(".agent-popover");
  if (!popover || !expandedAgentFlowId) return;
  const node = agentFlowNodes.find((item) => item.id === expandedAgentFlowId);
  if (!node) return;
  const chartWidth = agentFlowChart.clientWidth || 1500;
  const chartHeight = agentFlowChart.clientHeight || 700;
  const scaleX = chartWidth / 1500;
  const scaleY = chartHeight / 700;
  const gap = 14;
  const pad = 8;
  const popoverWidth = popover.offsetWidth;
  const popoverHeight = popover.offsetHeight;
  const left = node.x * scaleX;
  const top = node.y * scaleY;
  const width = node.w * scaleX;
  const height = node.h * scaleY;
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const placements = [
    { x: centerX - popoverWidth / 2, y: top + height + gap },
    { x: centerX - popoverWidth / 2, y: top - popoverHeight - gap },
    { x: left - popoverWidth - gap, y: centerY - popoverHeight / 2 },
    { x: left + width + gap, y: centerY - popoverHeight / 2 }
  ];
  const fits = (place) => place.x >= pad && place.y >= pad && place.x + popoverWidth <= chartWidth - pad && place.y + popoverHeight <= chartHeight - pad;
  const best = placements.find(fits) || placements[0];
  const x = Math.min(Math.max(best.x, pad), Math.max(pad, chartWidth - popoverWidth - pad));
  const y = Math.min(Math.max(best.y, pad), Math.max(pad, chartHeight - popoverHeight - pad));
  popover.style.left = `${Math.round(x)}px`;
  popover.style.top = `${Math.round(y)}px`;
}

function renderAgentPopover() {
  if (!agentPopoverLayer) return;
  const step = agentFlowSteps.find((item) => item.id === expandedAgentFlowId && item.paths.includes(activeAgentSource));
  agentPopoverLayer.innerHTML = step ? buildAgentPopover(step) : "";
  const popover = agentPopoverLayer.querySelector(".agent-popover");
  if (popover) {
    popover.addEventListener("click", (event) => event.stopPropagation());
    requestAnimationFrame(positionAgentPopover);
  }
}

document.querySelectorAll(".agent-source-btn").forEach((button) => {
  button.addEventListener("click", () => {
    activeAgentSource = button.dataset.agentSource;
    expandedAgentFlowId = null;
    document.querySelectorAll(".agent-source-btn").forEach((item) => item.classList.toggle("active", item === button));
    renderAgentFlow();
  });
});

document.addEventListener("click", () => {
  if (!expandedAgentFlowId) return;
  expandedAgentFlowId = null;
  renderAgentPopover();
});

window.addEventListener("resize", () => requestAnimationFrame(positionAgentPopover));

renderAgentFlow();
