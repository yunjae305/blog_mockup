const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".settings-panel");
const steps = document.querySelectorAll(".step-item");
const promptChips = document.querySelectorAll(".prompt-chip");
const postGoalInput = document.querySelector("#postGoal");
const goalChoiceLabel = document.querySelector("#goalChoiceLabel");
const goalChoiceText = document.querySelector("#goalChoiceText");
const platformChoices = document.querySelectorAll(".choice");
const personaCards = document.querySelectorAll(".persona-card");
const referenceUrlInput = document.querySelector("#referenceUrl");
const referenceFileInput = document.querySelector("#referenceFile");
const referenceFileName = document.querySelector("#referenceFileName");
const DEFAULT_FILE_LABEL = referenceFileName.textContent;
const keywordCount = document.querySelector("#keywordCount");
const keywordCountValue = document.querySelector("#keywordCountValue");
const humanLevel = document.querySelector("#humanLevel");
const humanLevelValue = document.querySelector("#humanLevelValue");
const trendMixRatio = document.querySelector("#trendMixRatio");
const trendMixRatioValue = document.querySelector("#trendMixRatioValue");
const generateButton = document.querySelector("#generatePost");
const loadSampleButton = document.querySelector("#loadSample");
const articleOutput = document.querySelector("#articleOutput");
const pipelineItems = document.querySelectorAll("#pipeline li");
const statusLabel = document.querySelector("#statusLabel");
const summary = document.querySelector("#selectionSummary");
const trendKeywordGrid = document.querySelector("#trendKeywordGrid");
let trendChips = document.querySelectorAll(".trend-chip");
const trendStatusLabel = document.querySelector("#trendStatusLabel");
const trendUpdatedAt = document.querySelector("#trendUpdatedAt");
const refreshTrendButton = document.querySelector("#refreshTrends");
const mixModeChoices = document.querySelectorAll(".mix-mode");
const topicIdeaButton = document.querySelector("#generateTopicIdeas");
const topicResults = document.querySelector("#topicResults");
const selectedTopicTitleInput = document.querySelector("#selectedTopicTitle");
const markdownButton = document.querySelector("#copyMarkdown");
const htmlButton = document.querySelector("#copyHtml");
const draftStatus = document.querySelector("#draftStatus");
const startPostingButton = document.querySelector("#startPosting");
const postingStatus = document.querySelector("#postingStatus");
const postingModeSelect = document.querySelector('select[name="postingMode"]');
const scheduleDelayRow = document.querySelector("#scheduleDelayRow");
const scheduleDelayMinutes = document.querySelector("#scheduleDelayMinutes");
const layoutGrid = document.querySelector(".layout-grid");
const openSettingsButton = document.querySelector("#openSettings");
const closeSettingsButton = document.querySelector("#closeSettings");
const settingsOverlay = document.querySelector("#settingsOverlay");
const verificationOverlay = document.querySelector("#verificationOverlay");
const closeVerificationButton = document.querySelector("#closeVerification");
const cancelVerificationButton = document.querySelector("#cancelVerification");
const confirmVerificationButton = document.querySelector("#confirmVerification");
const verificationInputList = document.querySelector("#verificationInputList");
const verificationSearchList = document.querySelector("#verificationSearchList");
const settingsTabs = document.querySelectorAll(".settings-tab");
const settingsViews = document.querySelectorAll(".settings-view");
const customPromptName = document.querySelector("#customPromptName");
const customPromptDescription = document.querySelector("#customPromptDescription");
const customPromptInput = document.querySelector("#customPromptInput");
const customPromptEnabled = document.querySelector("#customPromptEnabled");
const customPromptCounter = document.querySelector("#customPromptCounter");
const fillCustomPromptSampleButton = document.querySelector("#fillCustomPromptSample");
const saveCustomPromptButton = document.querySelector("#saveCustomPrompt");
const clearCustomPromptButton = document.querySelector("#clearCustomPrompt");
const customPromptStatus = document.querySelector("#customPromptStatus");
const naverSessionStatus = document.querySelector("#naverSessionStatus");
const naverLoginId = document.querySelector("#naverLoginId");
const naverLoginPassword = document.querySelector("#naverLoginPassword");
const tistoryLoginId = document.querySelector("#tistoryLoginId");
const tistoryLoginPassword = document.querySelector("#tistoryLoginPassword");
const saveLoginInfoButton = document.querySelector("#saveLoginInfo");
const clearLoginInfoButton = document.querySelector("#clearLoginInfo");
const loginInfoStatus = document.querySelector("#loginInfoStatus");
const draftList = document.querySelector("#draftList");
const draftPreview = document.querySelector("#draftPreview");
const selectAllDrafts = document.querySelector("#selectAllDrafts");
const deleteSelectedDraftsButton = document.querySelector("#deleteSelectedDrafts");
const editVoicePromptButton = document.querySelector("#editVoicePrompt");
const editCustomPromptFromVoiceButton = document.querySelector("#editCustomPromptFromVoice");
const openPromptFromPersonalButton = document.querySelector("#openPromptFromPersonal");
const voicePromptStatus = document.querySelector("#voicePromptStatus");
const customPromptPersonaTitle = document.querySelector("#customPromptPersonaTitle");
const customPromptPersonaStatus = document.querySelector("#customPromptPersonaStatus");

let currentResult = null;
let currentContext = null;
let generating = false;
let lastGeneratedTitle = "";
let generationCount = 0;
let trendFeedIndex = 0;
let editSaveTimer = null;
let verificationResolve = null;
const MAX_TREND_KEYWORDS = 2;
const CUSTOM_PROMPT_KEY = "humanBlogStudio:customPrompt";
const LOGIN_INFO_KEY = "humanBlogStudio:loginInfo";
const DRAFTS_KEY = "humanBlogStudio:drafts";
const LAST_DRAFT_KEY = "humanBlogStudio:lastDraft";
const CUSTOM_PROMPT_SAMPLE = {
  name: "실무 경험이 풍부한 IT 전문가",
  description: "",
  content: `개발자 또는 IT 기획자의 관점에서 질문하는 경우가 많으므로, 답변은 실무에 바로 적용할 수 있게 구체적으로 작성한다.
가능하면 예시, 구조, 코드 흐름, 서비스 설계 방식, 데이터 흐름, API 활용 방식까지 함께 제안한다.

답변 스타일은 다음 기준을 따른다.

핵심 결론을 먼저 말한다.
왜 그런 판단을 했는지 근거를 설명한다.
실제 개발이나 서비스 운영에서 고려해야 할 점을 알려준다.
너무 이론적으로만 설명하지 말고, 실무에서 어떻게 적용할 수 있는지 알려준다.
내가 잘못 이해하고 있는 부분이 있으면 부드럽게 바로잡아준다.
확실하지 않은 내용은 아는 척하지 말고 모른다고 말한다.
최신 정보가 필요한 내용은 확인이 필요하다고 말한다.
답변은 한국어로 작성한다.
어려운 용어는 필요할 때만 사용하고, 처음 등장할 때 쉽게 풀어서 설명한다.
가능하면 “이렇게 하면 된다” 수준까지 구체적으로 안내한다.

내가 서비스 아이디어, 개발 방식, API, 자동화, AI 기능, 기획서, 발표자료, 포트폴리오, 프로젝트 구조에 대해 물어보면 IT 전문가가 실무 검토를 해주는 것처럼 답변한다.

답변 톤은 전문적이지만 너무 딱딱하지 않게 한다.
불필요하게 길게 말하지 말고, 중요한 부분은 명확하게 정리한다.`,
};

const sampleTrendFeeds = [
  {
    status: "demo",
    items: [
      { keyword: "월드컵 16강", source: "Naver", period: "7월 4-7일", score: 98, change: "+24%" },
      { keyword: "월드컵 중계", source: "YouTube", period: "월드컵 기간", score: 95, change: "+21%" },
      { keyword: "월드컵 응원", source: "Instagram", period: "경기 당일", score: 91, change: "+18%" },
      { keyword: "흠뻑쇼 준비물", source: "Instagram", period: "여름 공연 시즌", score: 88, change: "+16%" },
      { keyword: "흠뻑쇼 코디", source: "Instagram", period: "공연 전후", score: 84, change: "+13%" },
      { keyword: "워터밤 일정", source: "Naver", period: "여름 페스티벌", score: 81, change: "+10%" },
      { keyword: "장마철 데이트", source: "Naver", period: "7월 장마", score: 77, change: "+8%" },
      { keyword: "여름휴가 준비", source: "Naver", period: "7-8월 휴가철", score: 74, change: "+6%" },
    ],
  },
  {
    status: "demo",
    items: [
      { keyword: "장마철 제습기", source: "Naver", period: "장마 시즌", score: 96, change: "+22%" },
      { keyword: "에어컨 전기세", source: "Naver", period: "여름철", score: 92, change: "+19%" },
      { keyword: "여름 샌들 추천", source: "Instagram", period: "휴가 준비", score: 87, change: "+14%" },
      { keyword: "휴가철 피부관리", source: "YouTube", period: "7-8월", score: 84, change: "+12%" },
      { keyword: "비오는날 데이트", source: "Naver", period: "장마", score: 80, change: "+9%" },
      { keyword: "여름 다이어트", source: "Instagram", period: "휴가 전", score: 78, change: "+8%" },
      { keyword: "캠핑 준비물", source: "Naver", period: "주말 여행", score: 75, change: "+6%" },
      { keyword: "물놀이 용품", source: "Shopping", period: "방학 시즌", score: 72, change: "+5%" },
    ],
  },
  {
    status: "demo",
    items: [
      { keyword: "서울 전시회", source: "Naver", period: "주말", score: 93, change: "+20%" },
      { keyword: "부산 여행 코스", source: "Naver", period: "여름휴가", score: 90, change: "+17%" },
      { keyword: "한강 야시장", source: "Instagram", period: "여름밤", score: 86, change: "+13%" },
      { keyword: "제주 렌터카", source: "Naver", period: "휴가철", score: 83, change: "+11%" },
      { keyword: "키즈카페 추천", source: "Community", period: "방학", score: 79, change: "+9%" },
      { keyword: "주말 나들이", source: "Instagram", period: "금-일", score: 76, change: "+7%" },
      { keyword: "호텔 수영장", source: "Naver", period: "호캉스 시즌", score: 73, change: "+5%" },
      { keyword: "도심 피크닉", source: "Instagram", period: "저녁 시간대", score: 70, change: "+4%" },
    ],
  },
];

function activatePanel(panelId) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.panel === panelId));
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === panelId));

  const order = ["topic", "keywords"];
  const activeIndex = order.indexOf(panelId);
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === activeIndex);
    step.classList.toggle("done", index < activeIndex);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activatePanel(tab.dataset.panel));
});

referenceFileInput.addEventListener("change", () => {
  referenceFileName.textContent = referenceFileInput.files[0]?.name || DEFAULT_FILE_LABEL;
});

promptChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    selectPurposeChip(chip);
  });
});

platformChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    platformChoices.forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
  });
});

personaCards.forEach((card) => {
  card.addEventListener("click", () => {
    personaCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
  });
});

bindTrendChipEvents();

refreshTrendButton?.addEventListener("click", () => {
  loadTrendFeed({ force: true });
});

mixModeChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    mixModeChoices.forEach((item) => item.classList.remove("selected"));
    choice.classList.add("selected");
  });
});

keywordCount.addEventListener("input", () => {
  keywordCountValue.textContent = `${keywordCount.value}개`;
});

humanLevel.addEventListener("input", () => {
  humanLevelValue.textContent = humanLevel.value;
});

trendMixRatio?.addEventListener("input", updateTrendMixRatioLabel);

loadSampleButton.addEventListener("click", () => {
  document.querySelector("#serviceName").value = "AIONA";
  selectPurposeByLabel("사용 후기");
  document.querySelector("#referenceMemo").value = "";
  referenceUrlInput.value = "https://aiona.kr/";
  trendFeedIndex = 0;
  renderTrendFeed(getSampleTrendPayload());
  selectTrendKeywords([]);
  selectTrendMixMode("자연스럽게 일부만 반영");
  selectPersona("IT 전문 리뷰어");
  humanLevel.value = 62;
  humanLevelValue.textContent = "62";
  keywordCount.value = 15;
  keywordCountValue.textContent = "15개";
  renderTopicIdeas(createTopicIdeas());
  activatePanel("topic");
});

topicIdeaButton.addEventListener("click", () => {
  renderTopicIdeas(createTopicIdeas());
});

generateButton.addEventListener("click", async () => {
  if (generating) return;

  generating = true;
  generateButton.disabled = true;
  const data = getFormData();
  data.verificationReport = createVerificationReport(data);
  setSummary(data);
  const shouldContinue = await openVerificationModal(data, data.verificationReport);
  if (!shouldContinue) {
    generating = false;
    generateButton.disabled = false;
    statusLabel.textContent = "입력 대기";
    return;
  }
  setGeneratingState();

  await runWritingPipeline();
  const payload = buildMockPayload(data);
  renderArticle(data, payload);

  generating = false;
  generateButton.disabled = false;
});

markdownButton.addEventListener("click", () => copyGenerated("markdown"));
htmlButton.addEventListener("click", () => copyGenerated("html"));
startPostingButton?.addEventListener("click", startPosting);
postingModeSelect?.addEventListener("change", updateScheduleDelayVisibility);
scheduleDelayMinutes?.addEventListener("change", () => {
  getScheduleDelayMinutes();
  updateScheduleDelayVisibility();
});
openSettingsButton?.addEventListener("click", () => openSettingsPanel("personalSettings"));
editVoicePromptButton?.addEventListener("click", () => openSettingsPanel("personalSettings"));
editCustomPromptFromVoiceButton?.addEventListener("click", () => openSettingsPanel("promptSettings"));
openPromptFromPersonalButton?.addEventListener("click", () => activateSettingsPanel("promptSettings"));
closeSettingsButton?.addEventListener("click", closeSettingsPanel);
settingsOverlay?.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) closeSettingsPanel();
});
closeVerificationButton?.addEventListener("click", () => closeVerificationModal(false));
cancelVerificationButton?.addEventListener("click", () => closeVerificationModal(false));
confirmVerificationButton?.addEventListener("click", () => closeVerificationModal(true));
verificationOverlay?.addEventListener("click", (event) => {
  if (event.target === verificationOverlay) closeVerificationModal(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && settingsOverlay && !settingsOverlay.hidden) closeSettingsPanel();
  if (event.key === "Escape" && verificationOverlay && !verificationOverlay.hidden) closeVerificationModal(false);
});

settingsTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateSettingsPanel(tab.dataset.settingsPanel));
});

saveCustomPromptButton?.addEventListener("click", saveCustomPrompt);
clearCustomPromptButton?.addEventListener("click", clearCustomPrompt);
fillCustomPromptSampleButton?.addEventListener("click", fillCustomPromptSample);
customPromptInput?.addEventListener("input", updateCustomPromptCounter);
saveLoginInfoButton?.addEventListener("click", saveLoginInfo);
clearLoginInfoButton?.addEventListener("click", clearLoginInfo);
selectAllDrafts?.addEventListener("change", () => {
  const checked = Boolean(selectAllDrafts.checked);
  draftList?.querySelectorAll(".draft-checkbox").forEach((checkbox) => {
    checkbox.checked = checked;
    checkbox.closest(".draft-row")?.classList.toggle("selected", checked);
  });
  updateDraftSelectionState();
});
deleteSelectedDraftsButton?.addEventListener("click", deleteSelectedDrafts);

articleOutput?.addEventListener("input", () => {
  if (!currentResult || !currentContext || articleOutput.classList.contains("empty")) return;
  syncEditedArticleFromDom();
  if (draftStatus) draftStatus.textContent = "* 수정 중입니다.";
  window.clearTimeout(editSaveTimer);
  editSaveTimer = window.setTimeout(() => {
    saveGeneratedDraft(currentResult.titles[0] || lastGeneratedTitle || "수정된 원고");
  }, 700);
});

function openSettingsPanel(panelId = "promptSettings") {
  if (!settingsOverlay) return;
  settingsOverlay.hidden = false;
  loadCustomPrompt();
  loadLoginInfo();
  renderDraftList();
  activateSettingsPanel(panelId);
}

function closeSettingsPanel() {
  if (!settingsOverlay) return;
  settingsOverlay.hidden = true;
}

function activateSettingsPanel(panelId) {
  settingsTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.settingsPanel === panelId));
  settingsViews.forEach((view) => view.classList.toggle("active", view.id === panelId));
}

function loadCustomPrompt() {
  const prompt = getCustomPromptConfig();
  if (customPromptName) customPromptName.value = prompt.name || "";
  if (customPromptDescription) customPromptDescription.value = prompt.description || "";
  if (customPromptInput) customPromptInput.value = prompt.content || "";
  if (customPromptEnabled) customPromptEnabled.checked = prompt.enabled !== false;
  updateCustomPromptCounter();
  if (customPromptStatus) {
    customPromptStatus.textContent = prompt.content
      ? prompt.enabled === false
        ? "프롬프트 저장됨 · 비활성"
        : "저장된 프롬프트 적용 중"
      : "저장된 프롬프트 없음";
  }
  updateVoicePromptStatus(prompt);
}

function saveCustomPrompt() {
  const content = customPromptInput?.value.trim() || "";
  if (content) {
    const prompt = {
      name: customPromptName?.value.trim() || "",
      description: customPromptDescription?.value.trim() || "",
      content,
      enabled: customPromptEnabled?.checked !== false,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CUSTOM_PROMPT_KEY, JSON.stringify(prompt));
    if (customPromptStatus) customPromptStatus.textContent = "프롬프트 저장됨";
    updateVoicePromptStatus(prompt);
  } else {
    localStorage.removeItem(CUSTOM_PROMPT_KEY);
    if (customPromptStatus) customPromptStatus.textContent = "프롬프트 내용을 입력해주세요";
    updateVoicePromptStatus({ content: "", enabled: true });
  }
  updateCustomPromptCounter();
}

function clearCustomPrompt() {
  if (customPromptName) customPromptName.value = "";
  if (customPromptDescription) customPromptDescription.value = "";
  if (customPromptInput) customPromptInput.value = "";
  if (customPromptEnabled) customPromptEnabled.checked = true;
  localStorage.removeItem(CUSTOM_PROMPT_KEY);
  updateCustomPromptCounter();
  if (customPromptStatus) customPromptStatus.textContent = "저장된 프롬프트 없음";
  updateVoicePromptStatus({ content: "", enabled: true });
}

function fillCustomPromptSample() {
  if (customPromptName) customPromptName.value = CUSTOM_PROMPT_SAMPLE.name;
  if (customPromptDescription) customPromptDescription.value = CUSTOM_PROMPT_SAMPLE.description;
  if (customPromptInput) customPromptInput.value = CUSTOM_PROMPT_SAMPLE.content;
  if (customPromptEnabled) customPromptEnabled.checked = true;
  updateCustomPromptCounter();
  if (customPromptStatus) customPromptStatus.textContent = "예시가 입력되었습니다";
}

function getCustomPromptConfig() {
  const raw = localStorage.getItem(CUSTOM_PROMPT_KEY);
  if (!raw) return { name: "", description: "", content: "", enabled: true };

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        name: parsed.name || "",
        description: parsed.description || "",
        content: parsed.content || "",
        enabled: parsed.enabled !== false,
      };
    }
  } catch {
    return { name: "", description: "", content: raw, enabled: true };
  }

  return { name: "", description: "", content: "", enabled: true };
}

function getActiveCustomPrompt() {
  const prompt = getCustomPromptConfig();
  return prompt.enabled === false ? "" : prompt.content.trim();
}

function getLoginInfo() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOGIN_INFO_KEY) || "{}");
    return {
      naver: {
        id: parsed?.naver?.id || "",
        password: parsed?.naver?.password || "",
        loggedInAt: parsed?.naver?.loggedInAt || "",
      },
      tistory: {
        id: parsed?.tistory?.id || "",
        password: parsed?.tistory?.password || "",
        loggedInAt: parsed?.tistory?.loggedInAt || "",
      },
    };
  } catch {
    return {
      naver: { id: "", password: "", loggedInAt: "" },
      tistory: { id: "", password: "", loggedInAt: "" },
    };
  }
}

function loadLoginInfo() {
  const loginInfo = getLoginInfo();
  if (naverLoginId) naverLoginId.value = loginInfo.naver.id;
  if (naverLoginPassword) naverLoginPassword.value = loginInfo.naver.password;
  if (tistoryLoginId) tistoryLoginId.value = loginInfo.tistory.id;
  if (tistoryLoginPassword) tistoryLoginPassword.value = loginInfo.tistory.password;
  updateLoginInfoStatus(loginInfo);
}

function saveLoginInfo() {
  const savedAt = new Date().toISOString();
  const naverId = naverLoginId?.value.trim() || "";
  const naverPassword = naverLoginPassword?.value || "";
  const tistoryId = tistoryLoginId?.value.trim() || "";
  const tistoryPassword = tistoryLoginPassword?.value || "";
  const loginInfo = {
    naver: {
      id: naverId,
      password: naverPassword,
      loggedInAt: naverId && naverPassword ? savedAt : "",
    },
    tistory: {
      id: tistoryId,
      password: tistoryPassword,
      loggedInAt: tistoryId && tistoryPassword ? savedAt : "",
    },
    updatedAt: savedAt,
  };
  localStorage.setItem(LOGIN_INFO_KEY, JSON.stringify(loginInfo));
  updateLoginInfoStatus(loginInfo);
}

function clearLoginInfo() {
  if (naverLoginId) naverLoginId.value = "";
  if (naverLoginPassword) naverLoginPassword.value = "";
  if (tistoryLoginId) tistoryLoginId.value = "";
  if (tistoryLoginPassword) tistoryLoginPassword.value = "";
  localStorage.removeItem(LOGIN_INFO_KEY);
  updateLoginInfoStatus(getLoginInfo(), "저장된 로그인 정보 없음");
}

function updateLoginInfoStatus(loginInfo = getLoginInfo(), fallback = "") {
  if (!loginInfoStatus) return;
  const hasNaver = Boolean(loginInfo.naver.id && loginInfo.naver.password && loginInfo.naver.loggedInAt);
  const hasTistory = Boolean(loginInfo.tistory.id && loginInfo.tistory.password && loginInfo.tistory.loggedInAt);
  if (naverSessionStatus) {
    naverSessionStatus.textContent = hasNaver ? "네이버 계정 정보 저장됨" : "네이버 계정 정보 없음";
  }
  if (fallback) {
    loginInfoStatus.textContent = fallback;
  } else if (hasNaver && hasTistory) {
    loginInfoStatus.textContent = "네이버 · 티스토리 계정 정보 저장됨";
  } else if (hasNaver) {
    loginInfoStatus.textContent = "네이버 계정 정보 저장됨";
  } else if (hasTistory) {
    loginInfoStatus.textContent = "티스토리 계정 정보 저장됨";
  } else {
    loginInfoStatus.textContent = "저장된 계정 정보 없음";
  }
}

function getLoginInfoForPlatform(platform) {
  const loginInfo = getLoginInfo();
  return platform === "네이버 블로그" ? loginInfo.naver : loginInfo.tistory;
}

function updateCustomPromptCounter() {
  if (customPromptCounter) {
    customPromptCounter.textContent = `${customPromptInput?.value.length || 0}자 입력됨`;
  }
}

function updateVoicePromptStatus(prompt = getCustomPromptConfig()) {
  const status = !prompt.content
    ? "설정한 프롬프트를 선택해서 적용합니다."
    : prompt.enabled === false
      ? "저장됨 · 비활성 상태입니다."
      : "선택하면 저장한 말투로 원고를 생성합니다.";

  if (customPromptPersonaTitle) customPromptPersonaTitle.textContent = "커스텀 프롬프트";

  if (!prompt.content) {
    if (voicePromptStatus) voicePromptStatus.textContent = "저장된 프롬프트 없음";
    if (customPromptPersonaStatus) customPromptPersonaStatus.textContent = status;
    return;
  }

  if (voicePromptStatus) voicePromptStatus.textContent = prompt.enabled === false ? "저장됨 · 비활성" : prompt.name || "저장된 프롬프트 적용 중";
  if (customPromptPersonaStatus) customPromptPersonaStatus.textContent = status;
}

function getSavedDrafts() {
  try {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
    return Array.isArray(drafts) ? drafts : [];
  } catch {
    return [];
  }
}

function renderDraftList() {
  if (!draftList || !draftPreview) return;
  const drafts = getSavedDrafts();

  if (!drafts.length) {
    draftList.innerHTML = "";
    draftPreview.hidden = false;
    draftPreview.className = "draft-preview empty";
    draftPreview.innerHTML = "<p>저장된 초안이 없습니다.</p>";
    updateDraftSelectionState();
    return;
  }

  draftPreview.hidden = true;
  draftPreview.className = "draft-preview empty";
  draftPreview.innerHTML = "<p>저장된 초안을 클릭하면 내용이 표시됩니다.</p>";
  draftList.innerHTML = drafts
    .map(
      (draft, index) => `
        <div class="draft-row" data-draft-index="${index}">
          <label class="draft-checkbox-wrap" aria-label="초안 선택">
            <input class="draft-checkbox" type="checkbox" data-draft-index="${index}" />
          </label>
          <button class="draft-item" type="button" data-draft-index="${index}">
            <strong>${escapeHtml(draft.title || "제목 없는 초안")}</strong>
            <span>${escapeHtml(formatDateTime(new Date(draft.savedAt || Date.now())))}</span>
          </button>
        </div>
      `
    )
    .join("");

  draftList.querySelectorAll(".draft-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      checkbox.closest(".draft-row")?.classList.toggle("selected", checkbox.checked);
      updateDraftSelectionState();
    });
  });

  draftList.querySelectorAll(".draft-item").forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.contains("active");
      draftList.querySelectorAll(".draft-item").forEach((item) => item.classList.remove("active"));
      draftList.querySelectorAll(".draft-inline-preview").forEach((item) => item.remove());
      if (isActive) {
        return;
      }
      button.classList.add("active");
      const row = button.closest(".draft-row") || button;
      renderDraftInlinePreview(row, drafts[Number(button.dataset.draftIndex)]);
    });
  });

  collapseDraftPreview();
  updateDraftSelectionState();
}

function renderDraftInlinePreview(button, draft) {
  const preview = document.createElement("article");
  preview.className = "draft-inline-preview";
  preview.innerHTML = draft?.previewHtml || "<p>저장된 초안 내용을 불러올 수 없습니다.</p>";
  button.insertAdjacentElement("afterend", preview);
}

function getSelectedDraftIndexes() {
  if (!draftList) return [];
  return [...draftList.querySelectorAll(".draft-checkbox:checked")]
    .map((checkbox) => Number(checkbox.dataset.draftIndex))
    .filter((index) => Number.isInteger(index));
}

function updateDraftSelectionState() {
  const checkboxes = draftList ? [...draftList.querySelectorAll(".draft-checkbox")] : [];
  const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  const hasDrafts = checkboxes.length > 0;

  if (selectAllDrafts) {
    selectAllDrafts.disabled = !hasDrafts;
    selectAllDrafts.checked = hasDrafts && checkedCount === checkboxes.length;
    selectAllDrafts.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
  }

  if (deleteSelectedDraftsButton) {
    deleteSelectedDraftsButton.disabled = checkedCount === 0;
    deleteSelectedDraftsButton.title = checkedCount ? `선택한 초안 ${checkedCount}개 삭제` : "선택한 초안 삭제";
  }
}

function deleteSelectedDrafts() {
  const selectedIndexes = new Set(getSelectedDraftIndexes());
  if (!selectedIndexes.size) return;

  const remainingDrafts = getSavedDrafts().filter((_, index) => !selectedIndexes.has(index));
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(remainingDrafts));

  if (remainingDrafts[0]) {
    localStorage.setItem(LAST_DRAFT_KEY, JSON.stringify(remainingDrafts[0]));
  } else {
    localStorage.removeItem(LAST_DRAFT_KEY);
  }

  renderDraftList();
}

function renderDraftPreview(draft) {
  if (!draftPreview) return;
  draftPreview.hidden = false;
  draftPreview.className = "draft-preview";
  draftPreview.innerHTML = draft?.previewHtml || "<p>저장된 초안 내용을 불러올 수 없습니다.</p>";
}

function collapseDraftPreview() {
  if (!draftPreview) return;
  draftPreview.hidden = true;
  draftPreview.className = "draft-preview empty";
  draftPreview.innerHTML = "<p>저장된 초안을 클릭하면 내용이 표시됩니다.</p>";
}

function selectPersona(value) {
  const radio = document.querySelector(`input[name="persona"][value="${value}"]`);
  if (!radio) return;
  radio.checked = true;
  personaCards.forEach((card) => card.classList.toggle("selected", card.contains(radio)));
}

function selectPurposeChip(chip) {
  if (!chip) return;
  promptChips.forEach((item) => {
    const isActive = item === chip;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  postGoalInput.value = chip.dataset.purpose || "";
  if (goalChoiceLabel) goalChoiceLabel.textContent = chip.textContent.trim();
  if (goalChoiceText) goalChoiceText.textContent = postGoalInput.value;
}

function selectPurposeByLabel(label) {
  const chip = [...promptChips].find((item) => item.textContent.trim() === label) || promptChips[0];
  selectPurposeChip(chip);
}

function bindTrendChipEvents() {
  trendChips = document.querySelectorAll(".trend-chip");
  trendChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const isSelected = chip.getAttribute("aria-pressed") === "true";
      const selectedCount = getSelectedTrendKeywords().length;
      if (!isSelected && selectedCount >= MAX_TREND_KEYWORDS) {
        if (trendStatusLabel) trendStatusLabel.textContent = `이벤트 키워드는 최대 ${MAX_TREND_KEYWORDS}개까지 선택할 수 있습니다`;
        return;
      }
      chip.setAttribute("aria-pressed", String(!isSelected));
      if (trendStatusLabel) trendStatusLabel.textContent = "추천 트렌드 데이터 표시";
    });
  });
}

async function loadTrendFeed({ force = false } = {}) {
  if (trendStatusLabel) {
    trendStatusLabel.textContent = force ? "최신 트렌드 다시 확인 중" : "최신 트렌드 확인 중";
  }

  const payload = getSampleTrendPayload({ next: force });
  renderTrendFeed(payload);
}

function getSampleTrendPayload({ next = false } = {}) {
  if (next) {
    trendFeedIndex = (trendFeedIndex + 1) % sampleTrendFeeds.length;
  }

  const feed = sampleTrendFeeds[trendFeedIndex];
  return {
    ...feed,
    updatedAt: new Date().toISOString(),
    refreshIntervalHours: 1,
  };
}

function renderTrendFeed(payload) {
  const items = payload.items.slice(0, 12);
  trendKeywordGrid.innerHTML = items
    .map(
      (item, index) => `
        <button class="trend-chip" type="button" data-trend="${escapeHtml(item.keyword)}" data-hot="${index < 2 ? "true" : "false"}" aria-pressed="false">
          <strong>${escapeHtml(item.keyword)}</strong>
          <small>${escapeHtml(item.source || "Trend")}</small>
        </button>
      `
    )
    .join("");

  bindTrendChipEvents();
  updateTrendMeta(payload);
}

function updateTrendMeta(payload) {
  const updatedAt = payload.updatedAt ? new Date(payload.updatedAt) : new Date();
  const statusText =
    payload.status === "live"
      ? "실제 수집 데이터 반영"
      : "추천 트렌드 데이터 표시";

  if (trendStatusLabel) trendStatusLabel.textContent = statusText;
  if (trendUpdatedAt) trendUpdatedAt.textContent = formatDateTime(updatedAt);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function selectTrendKeywords(values) {
  const selected = new Set(values.slice(0, MAX_TREND_KEYWORDS));
  trendChips.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(selected.has(chip.dataset.trend)));
  });
}

function selectTrendMixMode(value) {
  const ratioMap = {
    "자연스럽게 일부만 반영": 50,
    "제목과 도입부에 반영": 70,
    "본문 사례로만 사용": 30,
  };
  if (trendMixRatio) trendMixRatio.value = String(ratioMap[value] ?? 50);
  updateTrendMixRatioLabel();
  const radio = document.querySelector(`input[name="trendMixMode"][value="${value}"]`);
  if (!radio) return;
  radio.checked = true;
  mixModeChoices.forEach((choice) => choice.classList.toggle("selected", choice.contains(radio)));
}

function updateTrendMixRatioLabel() {
  if (!trendMixRatio || !trendMixRatioValue) return;
  trendMixRatioValue.textContent = `${trendMixRatio.value}%`;
}

function getTrendMixModeFromRatio(value) {
  if (value >= 70) return "제목과 도입부에 강하게 반영";
  if (value <= 30) return "본문 사례 중심으로 약하게 반영";
  return "자연스럽게 일부만 반영";
}

function getSelectedTrendKeywords() {
  return [...trendChips]
    .filter((chip) => chip.getAttribute("aria-pressed") === "true")
    .map((chip) => chip.dataset.trend)
    .filter(Boolean);
}

function getFormData() {
  const serviceName = document.querySelector("#serviceName").value.trim() || "샘플 서비스";
  const goalLabel = goalChoiceLabel?.textContent || "서비스 소개";
  const referenceMemo = document.querySelector("#referenceMemo").value.trim();
  const referenceUrl = referenceUrlInput.value.trim();
  const persona = document.querySelector('input[name="persona"]:checked')?.value || "일상 블로거";
  const referenceFile = referenceFileInput.files[0] || null;
  const referenceImage = referenceFile?.type?.startsWith("image/")
    ? {
        name: referenceFile.name,
        type: referenceFile.type,
        src: URL.createObjectURL(referenceFile),
      }
    : null;
  const keywordInput = deriveKeywords(serviceName, goalLabel, referenceMemo);

  return {
    serviceName,
    goal: postGoalInput.value.trim(),
    referenceMemo,
    referenceUrl,
    referenceFileName: referenceFile?.name || "",
    referenceImage,
    goalLabel,
    primaryKeyword: keywordInput.primary,
    selectedKeywords: keywordInput.sub,
    trendKeywords: getSelectedTrendKeywords(),
    trendMixRatio: Number(trendMixRatio?.value || 50),
    trendMixMode: getTrendMixModeFromRatio(Number(trendMixRatio?.value || 50)),
    selectedTopicTitle: selectedTopicTitleInput.value.trim(),
    keywordCount: Number(keywordCount.value),
    persona,
    humanLevel: 55,
    platform: document.querySelector('input[name="platform"]:checked').value,
    postingMode: postingModeSelect?.value || "즉시 포스팅",
    scheduleDelayMinutes: getScheduleDelayMinutes(),
    customPrompt: persona === "커스텀 프롬프트" ? getActiveCustomPrompt() : "",
  };
}

function deriveKeywords(serviceName, goalLabel, referenceMemo) {
  const normalizedService = serviceName || "브랜드";
  const goalKeywordMap = {
    "서비스 소개": "서비스 소개",
    "사용 후기": "사용 후기",
    "전환형 콘텐츠": "상담 전환",
    "사용 방법 안내": "사용 방법",
    "비교 콘텐츠": "서비스 비교",
    "구매 가이드": "구매 가이드",
    "브랜드 신뢰": "브랜드 신뢰",
    "FAQ 정리": "자주 묻는 질문",
    "업데이트 소개": "업데이트 소식",
    "활용 사례": "활용 사례",
    "상담 유도": "상담 문의",
    "SEO 정보글": "검색 정보",
  };
  const memoKeyword = /이미지/.test(referenceMemo) ? "이미지 생성 후기" : referenceMemo ? "참고 자료 반영" : "블로그 글쓰기";
  return {
    primary: `${normalizedService} ${goalKeywordMap[goalLabel] || "블로그 콘텐츠"}`,
    sub: [goalKeywordMap[goalLabel] || "블로그 콘텐츠", memoKeyword, "콘텐츠 제작"],
  };
}

function createTopicIdeas() {
  const serviceName = document.querySelector("#serviceName").value.trim() || "샘플 서비스";
  const trends = getSelectedTrendKeywords();

  if (!trends.length) {
    return [
      { title: `${serviceName} 안 써본 사람만 모르는 블로그 제목 뽑는 법` },
      { title: `원고 쓰기 전에 ${serviceName}부터 켰더니 제목이 달라졌습니다` },
      { title: `${serviceName} 처음 쓰고 놀란 이유, 글감 막힌 사람은 꼭 보세요` },
      { title: `블로그 조회수 답답하다면 ${serviceName}로 먼저 바꿔야 할 것` },
      { title: `빈 화면 앞에서 30분 버리는 사람들, ${serviceName}로 이렇게 시작합니다` },
      { title: `${serviceName} 모르면 손해 보는 글쓰기 루틴 5가지` },
    ];
  }

  if (trends.includes("여름 다이어트")) {
    return [
      { title: `여름 다이어트 또 망하기 싫어서 ${serviceName}에게 식단을 맡겨봤습니다` },
      { title: `${serviceName}가 짜준 여름 다이어트 루틴, 생각보다 무섭게 현실적입니다` },
      { title: `여름 다이어트 시작 전 이 질문 안 하면 또 실패합니다` },
      { title: `${serviceName}로 식단과 운동 루틴 잡았더니 포기 포인트가 보였습니다` },
      { title: `혼자 다이어트 계획 세우다 망한 사람, ${serviceName} 채팅부터 보세요` },
      { title: `${serviceName}가 알려준 대로 해보니 여름 다이어트가 달라진 이유` },
      { title: `여름 다이어트 실패하는 사람들, 루틴보다 먼저 바꿔야 할 것` },
      { title: `운동 초보가 ${serviceName}로 다이어트 계획 짜고 놀란 포인트` },
    ];
  }

  const trendText = trends[0];
  const secondTrend = trends[1] || trends[0];
  const combinedTrendTitle =
    trends.length > 1
      ? `${trendText}부터 ${secondTrend}까지, 지금 안 잡으면 늦는 글감`
      : `${trendText} 하나로 조회수 노리는 블로그 글감 만드는 법`;

  return [
    { title: `${trendText} 검색하는 사람들, 지금 ${serviceName}를 봐야 하는 이유` },
    { title: `${trendText} 뜨는데 블로그 글 못 쓰고 있다면 이건 꼭 보세요` },
    { title: `${secondTrend} 글감, 이렇게 시작하면 클릭이 확 달라집니다` },
    { title: `${trendText} 놓치면 아까운 타이밍, ${serviceName}로 바로 잡는 법` },
    { title: `${serviceName} 모르면 ${trendText} 트래픽을 그냥 흘려보낼 수 있습니다` },
    { title: combinedTrendTitle },
  ];
}

function renderTopicIdeas(ideas) {
  topicResults.classList.remove("empty");
  topicResults.innerHTML = `
    <div class="topic-choice-list">
      ${ideas
        .map((idea, index) => {
          const title = typeof idea === "string" ? idea : idea.title;
          const score = typeof idea === "object" && idea.score ? idea.score : [98, 94, 91][index];
          return `
            <label class="topic-choice ${index === 0 ? "selected" : ""}" data-hot="${index < 3 ? "true" : "false"}">
              <input name="topicIdea" type="radio" value="${escapeHtml(title)}" ${index === 0 ? "checked" : ""} />
              <span class="topic-title">${escapeHtml(title)}</span>
              ${index < 3 ? `<strong class="topic-score">추천 ${score}점</strong>` : ""}
            </label>
          `;
        })
        .join("")}
    </div>
  `;
  selectedTopicTitleInput.value = typeof ideas[0] === "string" ? ideas[0] : ideas[0]?.title || "";

  topicResults.querySelectorAll(".topic-choice").forEach((choice) => {
    choice.addEventListener("click", () => {
      topicResults.querySelectorAll(".topic-choice").forEach((item) => item.classList.remove("selected"));
      choice.classList.add("selected");
      const radio = choice.querySelector("input");
      radio.checked = true;
      selectedTopicTitleInput.value = radio.value;
    });
  });
}

function setSummary(data) {
  summary.textContent = `${data.serviceName} · ${data.goalLabel} · ${data.platform} · ${data.persona} · 키워드 ${data.trendMixRatio}%${
    data.selectedTopicTitle ? ` · ${data.selectedTopicTitle}` : ""
  }`;
}

function setGeneratingState() {
  currentResult = null;
  currentContext = null;
  layoutGrid?.classList.add("is-generating");
  articleOutput.className = "article-output empty";
  articleOutput.innerHTML = `
    <div class="empty-state">
      <strong>블로그 원고를 구성하고 있습니다.</strong>
      <p>입력한 조건에 맞춰 제목과 본문 흐름을 정리하고 있습니다.</p>
    </div>
  `;

  pipelineItems.forEach((item) => {
    item.className = "pending";
  });
  statusLabel.textContent = "원고 생성 중";
}

function createVerificationReport(data) {
  const topic = data.selectedTopicTitle || `${data.serviceName} ${data.goalLabel}`;
  const trends = data.trendKeywords.length ? data.trendKeywords : ["선택한 트렌드 없음"];
  const inputInfo = [
    { label: "브랜드/서비스", value: data.serviceName },
    { label: "글 목적", value: data.goalLabel },
    { label: "선택 제목", value: data.selectedTopicTitle || "직접 선택 전" },
    { label: "선택 키워드", value: data.trendKeywords.length ? data.trendKeywords.join(", ") : "선택 없음" },
    { label: "결합 비율", value: `주제 ${100 - data.trendMixRatio}% · 키워드 ${data.trendMixRatio}%` },
    { label: "참고 URL", value: data.referenceUrl || "없음" },
    { label: "참고 파일", value: data.referenceFileName || "없음" },
    { label: "추가 자료", value: data.referenceMemo || "없음" },
  ];
  const searched = trends.map((trend, index) => ({
    title: index === 0 ? "주요 검색 내용" : "보조 검색 내용",
    query: `${data.serviceName} ${topic} ${trend}`.trim(),
    finding: trend === "선택한 트렌드 없음"
      ? "선택된 트렌드가 없어 브랜드명, 글 목적, 참고 자료 중심으로 검증합니다."
      : `"${trend}" 관련 관심사를 확인했고, 입력된 주제와 자연스럽게 연결되는 범위에서만 반영합니다.`,
    source: index === 0 ? "검색 에이전트 요약" : "관련 맥락 요약",
  }));

  return {
    topic,
    generatedAt: new Date(),
    inputInfo,
    searched,
  };
}

function openVerificationModal(data, report) {
  if (!verificationOverlay || !verificationInputList || !verificationSearchList) return Promise.resolve(true);

  verificationInputList.innerHTML = report.inputInfo
    .map(
      (item) => `
        <div>
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `
    )
    .join("");

  verificationSearchList.innerHTML = report.searched
    .map(
      (item) => `
        <article class="verification-search-item">
          <div>
            <span>${escapeHtml(item.source)}</span>
            <strong>${escapeHtml(item.title)}</strong>
          </div>
          <p>${escapeHtml(item.query)}</p>
          <small>${escapeHtml(item.finding)}</small>
        </article>
      `
    )
    .join("");

  verificationOverlay.hidden = false;
  statusLabel.textContent = "검증 내용 확인 중";

  return new Promise((resolve) => {
    verificationResolve = resolve;
  });
}

function closeVerificationModal(shouldContinue = false) {
  if (verificationOverlay) verificationOverlay.hidden = true;
  if (verificationResolve) {
    verificationResolve(Boolean(shouldContinue));
    verificationResolve = null;
  }
}

async function runWritingPipeline() {
  for (let index = 0; index < pipelineItems.length; index += 1) {
    pipelineItems.forEach((item, itemIndex) => {
      item.className = itemIndex < index ? "done" : itemIndex === index ? "active" : "pending";
    });
    await wait(220);
  }

  pipelineItems.forEach((item) => {
    item.className = "done";
  });
  steps.forEach((step) => step.classList.add("done"));
  steps[steps.length - 1]?.classList.add("active");
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getPrimaryTrend(data) {
  return data.trendKeywords[0] || data.selectedKeywords[0] || "블로그 글쓰기";
}

function createClickTitle(data) {
  const trend = getPrimaryTrend(data);
  const service = data.serviceName;
  const trendBundle = data.trendKeywords.length > 1 ? data.trendKeywords.slice(0, 2).join("·") : trend;
  const titleBank = {
    "일상 블로거": [
      `${trend} 검색하다 멈칫했습니다. ${service} 안 봤으면 진짜 손해였어요`,
      `${service} 처음 써보고 당황했습니다. 왜 다들 이걸 숨겼죠?`,
      `${trend} 뜨는 지금, 블로그 쓰는 사람은 이걸 놓치면 아깝습니다`,
      `솔직히 ${service} 별 기대 없었는데 하루 만에 생각이 바뀌었습니다`,
      `${trendBundle} 잡으려면 ${service}부터 봐야 하는 이유`,
    ],
    "IT 전문 리뷰어": [
      `${service} 직접 써보고 갈렸습니다. 추천할 사람과 말릴 사람`,
      `${trend} 콘텐츠 만들 때 ${service}, 진짜 쓸 만한지 끝까지 확인했습니다`,
      `${service} 장점만 말하지 않겠습니다. 써보고 아쉬운 점까지 공개`,
      `${service} 후기 총정리, 시간 버리기 싫은 사람만 보세요`,
      `${service} 써보기 전 꼭 보세요. 모르면 후회할 포인트 5가지`,
    ],
    "경제 분석가": [
      `${trend} 검색량 몰릴 때 ${service}를 쓰는 사람이 먼저 가져가는 것`,
      `${service}를 블로그 제작에 붙이면 결과가 달라지는 3가지`,
      `${trend} 이슈를 콘텐츠로 바꾸는 사람들은 이미 이렇게 씁니다`,
      `${service} 도입 전 모르면 손해 보는 핵심 기준`,
      `${trend} 트래픽 놓치기 싫다면 지금 봐야 할 ${service} 활용법`,
    ],
    "교육 컨설턴트": [
      `${service} 처음이면 이것부터 보세요. 어렵게 시작하면 손해입니다`,
      `${trend} 글감으로 블로그 써야 한다면 이 순서가 제일 빠릅니다`,
      `${service} 사용법 쉽게 정리, 처음 쓰는 사람도 바로 따라합니다`,
      `블로그 글 막힐 때 ${service}로 10분 안에 제목 뽑는 방법`,
      `${trend} 때문에 급하게 글 써야 한다면 ${service}로 이렇게 시작하세요`,
    ],
  };

  titleBank["건강 박사"] = titleBank["교육 컨설턴트"];
  titleBank["콘텐츠 마케터"] = titleBank["경제 분석가"];

  return pickRandom(titleBank[data.persona] || titleBank["일상 블로거"]);
}

function createTitleSet(data) {
  let primaryTitle = data.selectedTopicTitle || createClickTitle(data);
  for (let attempt = 0; !data.selectedTopicTitle && attempt < 6 && primaryTitle === lastGeneratedTitle; attempt += 1) {
    primaryTitle = createClickTitle(data);
  }
  lastGeneratedTitle = primaryTitle;

  const titles = new Set([primaryTitle]);
  while (titles.size < 3) {
    titles.add(createClickTitle(data));
  }
  return [...titles];
}

function createPersonaArticle(data, context) {
  const { trend, subKeyword, secondKeyword, reference, selectedGoal, humanNote } = context;
  const service = data.serviceName;
  const articles = {
    "일상 블로거": [
      `${trend} 때문에 이것저것 찾아보다가 ${service}를 써봤는데요. 처음엔 단순한 글쓰기 도구라고 생각했는데, 막상 써보니 글감 잡는 시간이 확 줄어서 꽤 의외였습니다.`,
      `제가 제일 좋았던 건 시작이 어렵지 않다는 점이에요. 브랜드명, 글의 목적, 참고 자료만 넣으면 바로 방향이 잡히니까 빈 화면 앞에서 멍해지는 시간이 줄어들더라고요.`,
      `이번 글의 목적은 "${selectedGoal}" 쪽에 맞춰봤습니다. 그래서 너무 광고처럼 밀어붙이기보다, 실제로 어떤 상황에서 쓰면 편한지 보여주는 느낌으로 잡는 게 더 자연스러웠어요.`,
      `${reference} 이런 정보가 있으면 글이 훨씬 덜 뜬구름 잡는 느낌이 됩니다. 그냥 좋은 서비스라고 말하는 것보다, 어떤 기능을 어디에 쓰는지 보여주는 게 읽는 사람 입장에서도 편하니까요.`,
      `특히 ${subKeyword}처럼 막연한 주제는 트렌드랑 살짝 붙였을 때 읽을 이유가 생깁니다. ${trend} 같은 키워드를 억지로 넣는 게 아니라, 사람들이 지금 궁금해할 장면에 연결하는 식이 좋았습니다.`,
      `물론 그대로 복붙해서 끝내기엔 아직 사람이 봐야 할 부분도 있어요. 브랜드 특유의 말투나 실제 가격, 정확한 기능 범위는 마지막에 한 번 더 확인하는 게 안전합니다.`,
      `${humanNote} 저는 이 부분이 꽤 중요하다고 봅니다. 완벽한 글보다 수정하기 쉬운 초안이 먼저 나오면, 그다음부터는 훨씬 가볍게 다듬을 수 있거든요.`,
      `결론적으로 ${service}는 블로그를 자주 써야 하는데 매번 시작이 막히는 사람에게 잘 맞습니다. 특히 시즌 이슈를 빠르게 잡아 글로 바꾸고 싶다면 한 번쯤 써볼 만합니다.`,
    ],
    "IT 전문 리뷰어": [
      `결론부터 말하면 ${service}는 ${subKeyword} 시간을 줄이고 싶은 사람에게 꽤 실용적인 도구입니다. 다만 모든 사람에게 무조건 맞는 도구는 아니고, 사용 목적이 분명할수록 효과가 잘 보입니다.`,
      `제가 확인한 기준은 세 가지였습니다. 글의 목적이 잘 반영되는지, 참고 자료가 본문에 자연스럽게 들어가는지, 그리고 ${trend} 같은 시즌 키워드가 억지스럽지 않은지였습니다.`,
      `좋았던 점은 입력 구조가 단순하다는 것입니다. 브랜드명과 목적을 먼저 정하고, 추가 자료와 URL을 붙인 뒤, 필요한 트렌드만 선택하면 글의 방향이 빠르게 정리됩니다.`,
      `${reference} 이 정도의 참고 정보가 있으면 결과물이 훨씬 구체적입니다. 단순한 홍보 문구보다 실제 사용 장면, 추천 대상, 주의할 점을 함께 보여주기 좋습니다.`,
      `아쉬운 점도 있습니다. ${secondKeyword}처럼 검색 노출을 노리는 글이라면 최종 제목과 첫 문단은 사람이 다시 다듬어야 합니다. 클릭을 부르는 표현과 과장 사이의 선을 맞추는 과정이 필요합니다.`,
      `추천 대상은 분명합니다. 시즌 이슈를 놓치지 않고 빠르게 블로그 글로 바꾸고 싶은 사람, 반복되는 글쓰기 구조를 줄이고 싶은 사람, 초안 작성 시간을 줄이고 싶은 사람에게 잘 맞습니다.`,
      `반대로 브랜드 정보가 아직 정리되지 않았거나, 정확한 상품 정보가 자주 바뀌는 경우에는 먼저 내부 자료를 정리한 뒤 쓰는 편이 좋습니다.`,
      `정리하면 ${service}는 빠른 초안 제작용으로 쓸 때 장점이 가장 큽니다. ${trend} 같은 이슈를 붙여 글감을 만들되, 마지막 검수는 사람이 하는 방식이 가장 안정적입니다.`,
    ],
    "경제 분석가": [
      `${trend}와 같은 기간성 검색 이슈는 블로그 콘텐츠에서 즉시성이 강한 소재입니다. ${service}는 이러한 소재를 브랜드 메시지와 연결해 원고 구조로 전환하는 데 초점을 둔 서비스입니다.`,
      `핵심은 입력 항목의 순서입니다. 브랜드명, 글의 목적, 참고 자료가 먼저 정리되고, 이후 트렌드 키워드가 결합되어 제목과 본문 흐름을 만듭니다. 이 구조는 단순 키워드 나열보다 콘텐츠 일관성을 높입니다.`,
      `이번 요청의 목적은 "${selectedGoal}"입니다. 따라서 본문은 단순 기능 설명보다 독자가 어떤 판단을 할 수 있는지에 초점을 맞추는 편이 적절합니다.`,
      `${reference} 참고 자료는 글의 신뢰도를 결정하는 요소입니다. 특히 서비스 소개나 리뷰성 글에서는 추상적인 장점보다 구체적인 기능, 사용 장면, 제한 조건이 더 큰 설득력을 갖습니다.`,
      `${subKeyword} 관점에서 보면 제목, 첫 문단, 중간 소제목, 태그가 같은 방향을 가져야 합니다. ${trend}는 유입 계기를 만들고, 브랜드 정보는 체류 이유를 만드는 역할을 합니다.`,
      `주의할 점은 트렌드 의존도입니다. 검색량이 높은 이슈를 붙이더라도 서비스와의 연결성이 약하면 클릭 이후 이탈 가능성이 높아집니다. 따라서 본문에서는 연결 근거를 명확히 제시해야 합니다.`,
      `${humanNote} 자동 생성 자체보다 중요한 것은 편집 가능한 구조입니다. 초안이 빠르게 만들어지더라도 검증 가능한 정보와 브랜드 톤을 마지막에 보정해야 합니다.`,
      `결론적으로 ${service}는 시즌 이슈를 브랜드 콘텐츠로 전환하는 과정을 단축하는 도구입니다. 특히 ${trend}처럼 짧은 기간에 관심이 몰리는 주제에서 활용 가치가 높습니다.`,
    ],
    "교육 컨설턴트": [
      `${trend} 같은 키워드가 뜰 때는 블로그 글을 빨리 준비하는 게 중요합니다. ${service}는 그런 상황에서 무엇부터 써야 할지 정리해주는 도구라고 보면 됩니다.`,
      `사용 순서는 간단합니다. 먼저 브랜드명을 적고, 글의 목적을 고릅니다. 그다음 참고할 내용이나 URL을 넣고, 지금 많이 찾는 트렌드를 선택합니다.`,
      `이번 글의 목적은 "${selectedGoal}"입니다. 이 목적이 정해져 있으면 글이 옆길로 새지 않습니다. 소개글인지, 후기인지, 비교글인지에 따라 말하는 순서가 달라지기 때문입니다.`,
      `${reference} 이런 참고 내용이 있으면 글이 더 정확해집니다. 아무 정보 없이 쓰는 글보다 독자가 믿고 읽을 만한 내용이 들어가기 쉽습니다.`,
      `${subKeyword}를 어렵게 생각할 필요는 없습니다. 제목에서는 관심을 끌고, 첫 문단에서는 왜 읽어야 하는지 알려주고, 본문에서는 실제로 어떤 도움이 되는지 설명하면 됩니다.`,
      `다만 ${trend}를 너무 많이 넣으면 어색해질 수 있습니다. 트렌드는 사람을 들어오게 하는 입구이고, 본문에서는 브랜드와 서비스 이야기가 자연스럽게 이어져야 합니다.`,
      `${humanNote} 그래서 완성된 글을 바로 끝이라고 보기보다, 초안으로 보고 한 번 다듬는 방식이 좋습니다.`,
      `정리하면 ${service}는 블로그 글을 처음부터 혼자 쓰기 막막한 사람에게 잘 맞습니다. 지금 뜨는 주제를 글감으로 바꾸고 싶을 때 특히 편하게 쓸 수 있습니다.`,
    ],
  };

  articles["건강 박사"] = articles["교육 컨설턴트"];
  articles["콘텐츠 마케터"] = articles["경제 분석가"];

  return articles[data.persona] || articles["일상 블로거"];
}

function decorateArticleForPlatform(data, article) {
  if (data.platform === "네이버 블로그") {
    const icons = ["🙂", "✨", "📌", "💬", "🙌", "✔️", "👀", "📝"];
    return article.map((paragraph, index) => {
      const icon = icons[index % icons.length];
      if (index === 0) return `${icon} ${paragraph}`;
      if (index === 2) return `${icon} 개인적으로 여기서 제일 중요하게 봐야 할 부분은 이거였어요.\n\n${paragraph}`;
      if (index === 4) return `${icon} 여기서부터는 실제로 블로그에 넣었을 때 느낌이 확 달라지는 부분입니다.\n\n${paragraph}`;
      return `${icon} ${paragraph}`;
    });
  }

  return article.map((paragraph, index) => {
    if (index === 0) return `핵심 요약: ${paragraph}`;
    if (index === 5) return `체크 포인트: ${paragraph}`;
    return paragraph;
  });
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getUrlInfo(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const pathWords = decodeURIComponent(parsed.pathname)
      .split(/[/-]/)
      .map((word) => word.trim())
      .filter((word) => word && word.length > 1)
      .slice(0, 3);
    return {
      domain,
      label: pathWords.length ? pathWords.join(" · ") : domain,
      url: parsed.href,
    };
  } catch {
    return {
      domain: url.replace(/^https?:\/\//, "").split("/")[0] || "첨부 링크",
      label: "첨부 링크",
      url,
    };
  }
}

function createGenerationProfile(data) {
  generationCount += 1;
  const authorNames = ["민지", "도윤", "하린", "재이", "서우", "유나", "지훈", "나연"];
  const authorTypes = [
    "퇴근 후 직접 써본 직장인",
    "새 서비스는 꼭 눌러보는 리뷰러",
    "블로그 소재를 매일 모으는 운영자",
    "검색해서 들어온 입장에서 보는 사용자",
    "처음 쓰는 사람 기준으로 보는 작성자",
  ];
  const reactions = [
    "생각보다 첫 화면이 빨리 이해됐습니다",
    "기대보다 설정 과정이 짧아서 놀랐습니다",
    "막히던 부분이 어디인지 바로 보였습니다",
    "처음엔 반신반의했는데 써보니 기준이 생겼습니다",
  ];
  const devices = ["노트북", "아이폰", "태블릿", "데스크톱"];
  const linkInfo = getUrlInfo(data.referenceUrl);

  return {
    id: `${Date.now()}-${generationCount}-${Math.floor(Math.random() * 10000)}`,
    authorName: pickRandom(authorNames),
    authorType: pickRandom(authorTypes),
    reaction: pickRandom(reactions),
    device: pickRandom(devices),
    linkInfo,
    reviewAngle: linkInfo
      ? `${linkInfo.domain} 링크를 열어보고 실제 사용 흐름처럼 확인했습니다`
      : `${data.serviceName}를 처음 써보는 사람의 시선으로 확인했습니다`,
  };
}

function rewriteArticleForAuthor(data, article, profile) {
  const openers = [
    `${profile.authorName} 기준으로 다시 정리해보면, ${profile.reaction}.`,
    `이번 원고는 ${profile.authorType}가 쓴 후기처럼 잡아봤습니다. ${profile.reaction}.`,
    `${profile.device}로 살펴본다는 느낌으로 보면, 첫인상은 꽤 달랐습니다.`,
  ];
  const middleNotes = [
    `실제로 눌러본 사람이라면 여기서 시간을 아낄 수 있겠다는 생각이 먼저 듭니다.`,
    `캡처를 곁들여 설명하면 말로만 좋은 서비스라고 하는 느낌이 줄어듭니다.`,
    `이 부분은 홍보 문구보다 사용 장면을 보여주는 쪽이 훨씬 설득력 있습니다.`,
  ];
  const linkNote = profile.linkInfo
    ? `${profile.linkInfo.domain}에서 확인한 내용과 연결해보면, 단순 소개보다 직접 써본 후기처럼 풀어내는 편이 자연스럽습니다.`
    : `첨부 링크가 없을 때는 브랜드명과 참고 메모를 중심으로 사용 상황을 구체화하는 편이 자연스럽습니다.`;
  const visualNote = data.referenceImage
    ? `${data.referenceImage.name} 캡처를 같이 보면서 정리하니, 실제로 사용해본 후기처럼 화면 기준 설명을 붙이기 좋았습니다.`
    : profile.linkInfo
      ? `${profile.linkInfo.domain} 첫 화면을 보면서 읽으면, 이 글이 단순 소개가 아니라 사이트를 직접 확인한 후기처럼 느껴집니다.`
      : `실제 후기처럼 보이려면 사용 화면이나 캡처 이미지를 함께 넣는 편이 훨씬 자연스럽습니다.`;
  const closers = [
    `그래서 이번 글은 정보 정리보다 "직접 써보고 남긴 기록"에 가깝게 보는 편이 맞습니다.`,
    `결국 중요한 건 기능 나열이 아니라, 읽는 사람이 지금 바로 써봐야 할 이유를 느끼게 만드는 흐름입니다.`,
    `이런 식으로 작성하면 같은 설정에서도 완전히 다른 사람이 쓴 블로그처럼 보입니다.`,
  ];

  return article.map((paragraph, index) => {
    if (index === 0) return `${pickRandom(openers)}\n\n${paragraph}`;
    if (index === 3) return `${paragraph}\n\n${linkNote}`;
    if (index === 4) return `${paragraph}\n\n${visualNote}`;
    if (index === 5) return `${pickRandom(middleNotes)}\n\n${paragraph}`;
    if (index === article.length - 1) return `${paragraph}\n\n${pickRandom(closers)}`;
    return paragraph;
  });
}

function createReferenceVisual(data, profile) {
  if (!profile.linkInfo) return null;
  const screenshotUrl = `https://image.thum.io/get/width/1400/crop/820/noanimate/${encodeURIComponent(profile.linkInfo.url)}`;
  return {
    type: "site",
    domain: profile.linkInfo.domain,
    label: profile.linkInfo.label,
    url: profile.linkInfo.url,
    src: screenshotUrl,
    service: data.serviceName,
    authorName: profile.authorName,
    caption: `${profile.linkInfo.domain}에 실제 접속한 화면을 참고 이미지로 넣었습니다. 화면이 다르게 보이면 사이트 업데이트가 반영된 것입니다.`,
  };
}

function createPhoto(src, alt, caption) {
  return { type: "photo", src, alt, caption };
}

function createUploadedVisual(data, profile) {
  if (!data.referenceImage) return null;
  return {
    type: "uploaded",
    src: data.referenceImage.src,
    alt: `${data.referenceImage.name} 참고 이미지`,
    fileName: data.referenceImage.name,
    caption: `${profile.authorName} 작성자가 직접 사용하며 첨부한 실제 캡처/사진처럼 본문에 반영했습니다.`,
  };
}

function createBlogImages(data, profile) {
  const joined = [getPrimaryTrend(data), ...data.trendKeywords, data.serviceName].join(" ");
  let theme = "content";
  if (/월드컵|축구|응원|중계/.test(joined)) theme = "soccer";
  if (/흠뻑쇼|콘서트|공연|워터밤/.test(joined)) theme = "concert";
  if (/여름|휴가|장마|데이트|물놀이/.test(joined)) theme = "summer";

  const imageSets = {
    soccer: [
      createPhoto(
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
        "축구 경기장 관중석 사진",
        `${getPrimaryTrend(data)}처럼 검색 관심이 몰리는 순간에는 첫 이미지에서 분위기를 바로 보여주는 편이 좋습니다.`
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
        "축구공과 잔디 클로즈업 사진",
        "본문 중간 이미지는 글의 흐름을 끊지 않고 키워드 분위기를 다시 잡아주는 역할을 합니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80",
        "축구 경기 중인 선수들 사진",
        `${profile.authorName} 작성자는 경기 흐름을 보다가 바로 글감으로 연결한 느낌을 강조했습니다.`
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
        "축구장 골대와 잔디 사진",
        "검색 이슈형 글은 현장감 있는 이미지가 들어가야 일반 안내문처럼 보이지 않습니다."
      ),
    ],
    concert: [
      createPhoto(
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
        "공연장 조명과 관객 사진",
        "행사형 키워드는 현장감 있는 사진을 중간에 넣었을 때 체류 시간이 더 자연스럽게 늘어납니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        "콘서트 무대 조명 사진",
        "트렌드 키워드가 공연이나 페스티벌일 때는 실제 현장 사진 느낌이 가장 덜 어색합니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
        "야외 공연을 즐기는 관객 사진",
        "준비물이나 코디 글은 실제 다녀온 사람의 시선처럼 이미지가 섞여야 설득력이 생깁니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        "공연장 무대와 조명 사진",
        `${profile.device}로 찍은 후기처럼 보이도록 현장 사진 계열을 섞었습니다.`
      ),
    ],
    summer: [
      createPhoto(
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "여름 해변 사진",
        "계절형 키워드는 이미지 하나만으로도 글의 분위기를 빠르게 전달할 수 있습니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=1200&q=80",
        "물놀이를 즐기는 사람들 사진",
        "정보성 글에서도 중간 이미지를 넣으면 모바일에서 읽는 호흡이 훨씬 편해집니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
        "여름 준비물을 정리한 가방 사진",
        "직접 준비해본 후기처럼 보이려면 풍경보다 사용 장면에 가까운 사진도 필요합니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "여름 야외 테이블 사진",
        `${profile.authorName} 작성자가 실제로 메모하며 정리한 듯한 생활감 있는 이미지입니다.`
      ),
    ],
    content: [
      createPhoto(
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
        "노트북과 글쓰기 작업 공간 사진",
        `${data.serviceName}처럼 글쓰기와 연결된 서비스는 실제 작업 장면에 가까운 이미지가 자연스럽습니다.`
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        "노트북 화면을 보며 작업하는 사진",
        "너무 만들어진 이미지보다 실제 블로그 작성 환경에 가까운 사진이 더 신뢰감 있게 보입니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        "노트와 노트북으로 업무를 정리하는 사진",
        "직접 사용 후기는 결과 화면보다 사용 전후를 정리하는 장면이 더 자연스럽습니다."
      ),
      createPhoto(
        "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
        "데스크 위 모니터 작업 화면 사진",
        `${profile.authorType} 시선에서는 실제 작업 환경에 가까운 사진이 가장 어울립니다.`
      ),
    ],
  };

  const referenceVisual = createReferenceVisual(data, profile);
  const uploadedVisual = createUploadedVisual(data, profile);
  const photos = shuffleItems(imageSets[theme])
    .slice(0, 4)
    .map((image) => ({
      ...image,
      src: `${image.src}&mockRun=${encodeURIComponent(profile.id)}`,
    }));
  return [referenceVisual, uploadedVisual, ...photos].filter(Boolean);
}

function isDietRoutineTopic(data) {
  return data.selectedTopicTitle === `${data.serviceName}로 식단과 운동 루틴 잡았더니 포기 포인트가 보였습니다`;
}

function isAionaSampleData(data) {
  return data.serviceName === "AIONA" && data.goalLabel === "사용 후기" && data.referenceUrl === "https://aiona.kr/";
}

function createAionaSamplePayload(data, profile) {
  const title = data.selectedTopicTitle || "AIONA 이미지 생성, 안 써본 사람만 모르는 블로그 썸네일 치트키";
  const tags = [
    "#AIONA",
    "#AIONA사용후기",
    "#AIONA이미지생성",
    "#AI이미지생성",
    "#이미지생성AI",
    "#블로그썸네일",
    "#콘텐츠제작",
    "#블로그글쓰기",
    "#AI도구",
    "#IT서비스리뷰",
  ];
  const finalImage = {
    type: "final",
    src: "./assets/aiona-sample-footer.png",
    alt: "엄지를 든 캐릭터 이미지",
  };
  const benefitImage = {
    type: "inline",
    src: "./assets/aiona-benefit-ai-image.png",
    alt: "AI 이미지 생성 결과 편집 화면",
  };
  const article = [
    `요즘 AI 이미지 생성 서비스가 워낙 많아서 처음에는 AIONA도 비슷한 기능 중 하나라고 생각했다.
그런데 직접 사용해보니 단순히 “이미지를 만들어준다”는 느낌보다는, 원하는 분위기를 빠르게 잡고 결과물을 확인해볼 수 있는 도구에 가까웠다.

특히 블로그나 콘텐츠 작업을 할 때 참고 이미지가 필요하거나, 썸네일 느낌을 먼저 잡아보고 싶을 때 꽤 유용하게 쓸 수 있을 것 같았다.`,
    `AIONA 이미지 생성 기능을 사용하면서 가장 먼저 느낀 건 생각보다 진입 장벽이 낮다는 점이었다.

AI 이미지 생성이라고 하면 프롬프트를 길고 복잡하게 입력해야 할 것 같은 부담이 있는데, AIONA는 원하는 이미지의 방향을 정하고 스타일을 선택하는 흐름이 비교적 단순했다.
그래서 처음 사용하는 사람도 “뭘 눌러야 하지?” 하고 오래 헤매는 느낌은 덜했다.

물론 결과물을 잘 뽑으려면 결국 어떤 이미지를 원하는지 어느 정도는 구체적으로 적어야 한다.
예를 들어 단순히 “예쁜 배경 이미지”라고 입력하는 것보다, “연보라색 배경에 깔끔한 IT 서비스 소개용 썸네일 이미지”처럼 목적과 분위기를 같이 적는 편이 훨씬 결과가 좋았다.`,
    `가장 좋았던 부분은 결과물을 빠르게 확인할 수 있다는 점이었다.

블로그 글을 쓰거나 서비스 소개 콘텐츠를 만들 때 이미지가 하나 필요할 때가 많은데, 매번 무료 이미지 사이트에서 찾다 보면 시간이 꽤 걸린다.
원하는 분위기와 딱 맞는 이미지를 찾기도 어렵고, 상업적 사용 가능 여부도 확인해야 해서 번거로운 경우가 많다.

그런데 AIONA 이미지 생성 기능을 사용하면 내가 원하는 방향을 먼저 정하고 이미지를 만들어볼 수 있어서, 콘텐츠 작업의 시작 속도가 빨라지는 느낌이 있었다.

특히 이런 상황에서 쓸 만했다.

* 블로그 썸네일 이미지가 필요할 때
* 서비스 소개용 이미지 분위기를 잡고 싶을 때
* 발표 자료나 카드뉴스에 넣을 참고 이미지가 필요할 때
* 직접 촬영한 사진이 없지만 비슷한 느낌의 이미지가 필요할 때

완성된 이미지를 바로 최종 결과물로 쓰기보다는, 초안이나 방향성을 잡는 용도로 쓰면 더 만족도가 높을 것 같다.`,
    `아쉬운 점도 있었다.

AI 이미지 생성 특성상 한 번에 원하는 결과물이 정확히 나오는 경우도 있지만, 애매하게 어긋나는 경우도 있다.
예를 들어 분위기는 괜찮은데 디테일이 조금 어색하거나, 내가 생각한 구도와 다르게 나오는 경우가 있었다.

그래서 결과물을 그대로 쓰기보다는 몇 번 다시 생성해보면서 원하는 느낌에 가까운 이미지를 고르는 과정이 필요했다.

또 블로그나 브랜드 콘텐츠에 사용할 이미지라면 마지막 검수는 꼭 필요하다.
이미지가 예쁘게 나왔다고 해도 글의 주제와 잘 맞는지, 너무 AI 이미지처럼 보이지는 않는지, 독자가 봤을 때 자연스럽게 느껴지는지는 한 번 더 확인하는 게 좋다.`,
    `개인적으로 AIONA 이미지 생성 기능은 “이미지 작업을 완전히 대신해주는 도구”라기보다는, 콘텐츠 제작 시간을 줄여주는 보조 도구에 가깝다고 느꼈다.

특히 블로그를 운영하거나, SNS 콘텐츠를 만들거나, 서비스 소개 글을 자주 작성하는 사람이라면 꽤 유용하게 쓸 수 있을 것 같다.

예를 들어 글 주제는 정해졌는데 썸네일 이미지가 없을 때, 또는 특정 분위기의 이미지를 빠르게 만들어보고 싶을 때 도움이 된다.
반대로 브랜드의 정확한 제품 사진이나 실제 인물, 실제 장소를 보여줘야 하는 콘텐츠라면 AI 생성 이미지보다는 직접 촬영한 이미지나 공식 자료를 쓰는 편이 더 적합하다.`,
    `AIONA 이미지 생성 기능을 사용해보면서 느낀 건, 콘텐츠 작업에서 “이미지 때문에 막히는 시간”을 줄여줄 수 있다는 점이었다.

물론 한 번에 완벽한 결과물을 기대하기보다는, 원하는 분위기를 잡고 여러 번 수정하면서 결과물을 고르는 방식으로 사용하는 게 좋다.
특히 블로그 글, 카드뉴스, 서비스 소개 자료처럼 시각적인 요소가 필요한 콘텐츠를 만들 때 활용도가 높아 보였다.

결국 중요한 건 AI가 이미지를 만들어준다는 것보다, 내가 만들고 싶은 콘텐츠의 방향을 얼마나 잘 잡아주느냐인 것 같다.
그런 점에서 AIONA는 이미지 생성이 처음인 사람도 부담 없이 사용해볼 만한 도구라고 느꼈다.`,
  ];
  const outline = ["처음 사용했을 때 느낀 점", "좋았던 점", "아쉬웠던 점", "실제로 어디에 활용하면 좋을까?", "정리"];
  const markdownSections = outline.map((heading, index) => {
    const benefitImageMarkdown = index === 1 ? `\n\n![${benefitImage.alt}](${benefitImage.src})` : "";
    const finalImageMarkdown = index === 3 ? `\n\n![${finalImage.alt}](${finalImage.src})` : "";
    const imageMarkdown = `${benefitImageMarkdown}${finalImageMarkdown}`;
    return `## ${heading}\n\n${article[index + 1]}${imageMarkdown}`;
  });
  const sampleMarkdownContent = [`# ${title}`, article[0], ...markdownSections, tags.join("\n")].join("\n\n");

  return {
    research: {
      recommended_characters: 3200,
      length_reason: "샘플 채우기용 AIONA 이미지 생성 후기 원고입니다.",
    },
    result: {
      keyword_status: "샘플 원고",
      titles: [title],
      outline,
      article,
      images: [],
      profile,
      tags,
      thumbnails: ["AIONA 이미지 생성 기능 후기", "AI 이미지 생성 서비스 리뷰", "블로그 썸네일 제작 활용"],
      checklist: [],
      inlineImages: [{ afterIndex: 2, image: benefitImage }],
      finalImage,
      finalImageAfterIndex: 4,
      hideMeta: true,
      markdownContent: sampleMarkdownContent,
    },
  };
}

function createDietRoutineArticle(data) {
  const service = data.serviceName;

  return [
    `여름 다이어트를 해야겠다고 마음먹고 제일 먼저 든 생각은 "이번에도 너무 무리하게 시작하면 금방 포기하겠다"였습니다. 그래서 이번에는 막연히 식단표를 검색하기보다 ${service} 채팅 기능에 제 상황을 먼저 적어봤습니다.`,
    `제가 입력한 내용은 생각보다 단순했습니다. 평일에는 오래 앉아서 일하고, 운동은 주 2~3회 정도만 가능하고, 저녁 약속이 가끔 있다는 정도였습니다. ${service}는 이 조건을 바탕으로 식단과 운동 루틴을 너무 빡세게 잡지 않고, 지킬 수 있는 쪽으로 나눠줬습니다.`,
    `가장 마음에 들었던 부분은 아침, 점심, 저녁을 완벽하게 통제하라는 식이 아니었다는 점입니다. 예를 들어 아침은 단백질을 챙기되 준비가 쉬운 메뉴로 두고, 점심은 일반식을 먹더라도 밥 양과 사이드 선택을 조절하는 식으로 제안했습니다. 그래서 처음부터 실패했다는 느낌이 덜했습니다.`,
    `운동 루틴도 현실적이었습니다. 매일 1시간씩 운동하라는 계획이 아니라, 주 3회는 근력 운동과 가벼운 유산소를 섞고, 운동을 못 하는 날에는 20분 걷기나 스트레칭으로 대체하는 방식이었습니다. 바쁜 날에도 아예 포기하지 않게 만든 점이 좋았습니다.`,
    `실제로 며칠 따라 해보니 가장 큰 변화는 몸무게보다 생활 리듬이었습니다. 식사 시간을 조금 더 의식하게 됐고, 야식이 당길 때도 그냥 참는 게 아니라 다음 끼니를 어떻게 조절할지 생각하게 됐습니다. ${service}가 알려준 계획이 완벽해서라기보다, 계속 수정하면서 쓸 수 있다는 점이 편했습니다.`,
    `물론 ${service}가 알려준 내용을 그대로 의학적인 조언처럼 받아들이면 안 된다고 봅니다. 건강 상태나 질환이 있다면 전문가 상담이 우선이고, 너무 빠른 감량을 목표로 잡는 것도 위험할 수 있습니다. 다만 일반적인 생활 루틴을 정리하고, 내가 지킬 수 있는 계획을 만드는 데는 꽤 도움이 됐습니다.`,
    `블로그 글감으로 봐도 괜찮았습니다. 단순히 "다이어트 시작했습니다"라고 쓰는 것보다, ${service}에 어떤 조건을 입력했고 어떤 답변을 받았는지, 실제로 어떤 부분이 지키기 쉬웠는지 정리하니 후기처럼 읽히는 흐름이 생겼습니다.`,
    `정리하면 ${service} 채팅 기능은 여름 다이어트를 대신 해주는 도구라기보다, 내가 시작할 수 있는 수준으로 계획을 낮춰주는 도구에 가까웠습니다. 무리한 목표보다 지속 가능한 식단과 운동 루틴이 필요하다면 한 번쯤 활용해볼 만했습니다.`,
  ];
}

function buildMockPayload(data) {
  const profile = createGenerationProfile(data);
  if (isAionaSampleData(data)) {
    return createAionaSamplePayload(data, profile);
  }

  const titles = createTitleSet(data);
  const trends = data.trendKeywords.length ? data.trendKeywords.join(", ") : data.selectedKeywords[0] || "블로그 글쓰기";
  const trend = getPrimaryTrend(data);
  const subKeyword = data.selectedKeywords[0] || "블로그 글쓰기";
  const secondKeyword = data.selectedKeywords[1] || "SEO 글쓰기";
  const referenceParts = [
    data.referenceMemo,
    data.referenceUrl ? `참고 URL은 ${data.referenceUrl}입니다.` : "",
    data.customPrompt ? `커스텀 프롬프트: ${data.customPrompt}` : "",
  ].filter(Boolean);
  const reference = referenceParts.join(" ") || "반복되는 콘텐츠 준비 시간을 줄이는 데 초점을 둔 서비스입니다.";
  const selectedGoal = data.goal || "서비스를 처음 접하는 사람이 핵심 기능을 쉽게 이해하도록 소개 글을 만드는 목적입니다.";
  const humanNote =
    data.humanLevel >= 65
      ? "실제로 글감을 정리하는 흐름을 따라가듯 경험 중심으로 보여주는 편이 잘 맞습니다."
      : "기능 설명과 활용 장면을 균형 있게 나누는 편이 잘 맞습니다.";
  const dietRoutineTopic = isDietRoutineTopic(data);

  const article = decorateArticleForPlatform(
    data,
    dietRoutineTopic
      ? createDietRoutineArticle(data)
      : rewriteArticleForAuthor(
          data,
          createPersonaArticle(data, {
            trend,
            subKeyword,
            secondKeyword,
            reference,
            selectedGoal,
            humanNote,
          }),
          profile
        )
  );

  const tags = createTags(data);
  const images = createBlogImages(data, profile);
  const outline = dietRoutineTopic
    ? [
        "처음에는 무리하지 않는 계획이 필요했습니다",
        "AIONA에 입력한 조건과 받은 답변",
        "식단 계획이 현실적이라고 느낀 이유",
        "운동 루틴을 실제로 따라 해본 느낌",
        "다이어트 후기 글감으로도 괜찮았던 부분",
      ]
    : [
        "처음 사용할 때 느끼는 막막함",
        "입력값을 바탕으로 구성되는 원고 흐름",
        "좋았던 점과 확인이 필요한 점",
        "검색 노출을 고려한 구조",
        "실제로 활용할 때 느껴지는 차이",
      ];
  const checklist = dietRoutineTopic
    ? [
        "AIONA 채팅 기능을 사용한 상황이 첫 문단에 드러나는지 확인",
        "식단과 운동 루틴이 너무 과장되거나 의학 조언처럼 보이지 않는지 확인",
        "실제로 따라 해본 후기처럼 장점과 주의점을 함께 정리",
        "여름 다이어트 키워드가 제목, 본문, 해시태그에 자연스럽게 반영되는지 확인",
        "건강 상태에 따라 전문가 상담이 필요할 수 있다는 뉘앙스를 유지",
      ]
    : [
        "제목과 첫 문단에 브랜드명과 글의 목적이 자연스럽게 보이는지 확인",
        "참고 자료가 본문에 과장 없이 반영되는지 확인",
        "플랫폼별 문단 길이가 읽기 좋은지 확인",
        "복사 버튼으로 Markdown과 HTML을 가져갈 수 있는지 확인",
        "실제 발행 전 검증이 필요한 정보가 구분되는지 확인",
      ];

  return {
    research: {
      recommended_characters: 2600,
      length_reason: "블로그에서 읽기 좋은 분량으로 제목과 본문 흐름을 구성했습니다.",
    },
    result: {
      keyword_status: "추천 키워드 반영",
      titles,
      outline,
      article,
      images,
      profile,
      tags,
      thumbnails: [
        dietRoutineTopic ? `${data.serviceName} 채팅 다이어트 루틴 화면` : `${data.serviceName} 블로그 원고 자동화 화면`,
        dietRoutineTopic ? "여름 다이어트 계획 결과 미리보기" : `${data.primaryKeyword} 결과 미리보기`,
        dietRoutineTopic ? "식단과 운동 루틴을 정리한 후기 흐름" : "글쓰기 시간을 줄이는 콘텐츠 제작 흐름",
      ],
      checklist,
    },
  };
}

function createTags(data) {
  const base = [
    data.primaryKeyword,
    ...data.selectedKeywords,
    ...data.trendKeywords,
    data.serviceName,
    data.platform,
    data.goalLabel,
    data.persona,
    ...data.trendKeywords.map((keyword) => `${keyword} 블로그`),
    ...data.trendKeywords.map((keyword) => `${keyword} 정보`),
    ...data.trendKeywords.map((keyword) => `${keyword} 후기`),
    ...data.selectedKeywords.map((keyword) => `${data.serviceName} ${keyword}`),
    "블로그 글쓰기",
    "콘텐츠 제작",
    "블로그 글쓰기",
    "검색 노출",
    "네이버 블로그",
    "티스토리",
    "브랜드 콘텐츠",
    "콘텐츠 마케팅",
    "정보성 글쓰기",
    "후기 콘텐츠",
    "서비스 소개",
    "블로그 소재",
    "트렌드 키워드",
    "시즌 이슈",
    "행사 트렌드",
    "블로그 초안",
    "콘텐츠 기획",
    "SEO",
  ];

  return [...new Set(base.map((tag) => normalizeTag(tag)).filter(Boolean))].slice(0, data.keywordCount);
}

function getImageSlots(data) {
  return data.platform === "네이버 블로그" ? [1, 4, 6] : [2, 5];
}

function createImageFigure(image) {
  if (image.type === "final") {
    return `
      <figure class="article-photo article-final-image">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
      </figure>
    `;
  }

  if (image.type === "site") {
    return `
      <figure class="article-photo article-site-shot">
        <div class="reference-browser">
          <div class="browser-top">
            <span></span><span></span><span></span>
            <em>${escapeHtml(image.domain)}</em>
          </div>
          <a class="site-shot-link" href="${escapeHtml(image.url)}" target="_blank" rel="noreferrer">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.domain)} 실제 사이트 화면" loading="lazy" />
          </a>
        </div>
      </figure>
    `;
  }

  if (image.type === "uploaded") {
    return `
      <figure class="article-photo article-user-shot">
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
      </figure>
    `;
  }

  return `
    <figure class="article-photo">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />
    </figure>
  `;
}

function renderArticleBlocks(result, data) {
  const imageSlots = getImageSlots(data);
  const platformClass = data.platform === "네이버 블로그" ? "naver-style" : "tistory-style";

  return result.article
    .map((paragraph, index) => {
      const heading = index > 0 ? result.outline[index - 1] : "";
      const paragraphHtml = escapeHtml(paragraph).replace(/\n/g, "<br />");
      const imageSlotIndex = imageSlots.indexOf(index);
      const image = imageSlotIndex >= 0 && result.images.length ? result.images[imageSlotIndex % result.images.length] : null;
      const inlineImages = (result.inlineImages || []).filter((item) => item.afterIndex === index).map((item) => item.image);
      const finalImage = result.finalImageAfterIndex === index ? result.finalImage : null;

      return `
        ${heading ? `<h2>${escapeHtml(data.platform === "네이버 블로그" ? `${heading} ✨` : heading)}</h2>` : ""}
        <p class="${platformClass}">${paragraphHtml}</p>
        ${image ? createImageFigure(image) : ""}
        ${inlineImages.map((inlineImage) => createImageFigure(inlineImage)).join("")}
        ${finalImage ? createImageFigure(finalImage) : ""}
      `;
    })
    .join("");
}

function renderArticle(data, payload) {
  const { result, research } = payload;
  layoutGrid?.classList.remove("is-generating");
  currentResult = result;
  currentContext = data;
  const title = result.titles[0];
  const articleBlocks = renderArticleBlocks(result, data);
  const tags = result.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const metaHtml = result.hideMeta
    ? ""
    : `
      <p class="article-kicker">${escapeHtml(data.platform)} · ${research.recommended_characters.toLocaleString()}자 구성</p>
      <p class="article-byline">${escapeHtml(result.profile.authorName)} · ${escapeHtml(result.profile.authorType)} · ${escapeHtml(result.profile.device)}로 확인</p>
    `;
  const finalImageHtml = result.finalImage && result.finalImageAfterIndex === undefined ? createImageFigure(result.finalImage) : "";

  articleOutput.className = "article-output";
  articleOutput.innerHTML = `
    <div class="edit-notice">본문을 클릭해 바로 수정할 수 있습니다.</div>
    <div class="blog-article ${data.platform === "네이버 블로그" ? "blog-article-naver" : "blog-article-tistory"}" contenteditable="true" spellcheck="true">
      <h1>${escapeHtml(title)}</h1>
      ${metaHtml}
      ${articleBlocks}
      <div class="article-tags">${tags}</div>
      ${finalImageHtml}
    </div>
  `;

  saveGeneratedDraft(title);
  statusLabel.textContent = "원고 완료";
  if (postingStatus) postingStatus.textContent = "포스팅할 준비가 완료되었습니다.";
  updateScheduleDelayVisibility();
}

function syncEditedArticleFromDom() {
  if (!currentResult) return;
  const article = articleOutput.querySelector(".blog-article");
  if (!article) return;

  const title = article.querySelector("h1")?.innerText.trim();
  const paragraphs = [...article.querySelectorAll("p.naver-style, p.tistory-style")]
    .map((paragraph) => paragraph.innerText.trim())
    .filter(Boolean);
  const headings = [...article.querySelectorAll("h2")]
    .map((heading) => heading.innerText.replace(/\s*✨$/, "").trim())
    .filter(Boolean);
  const tags = [...article.querySelectorAll(".article-tags span")]
    .map((tag) => normalizeTag(tag.innerText))
    .filter(Boolean);

  if (title) currentResult.titles[0] = title;
  if (paragraphs.length) currentResult.article = paragraphs;
  if (headings.length) currentResult.outline = headings;
  if (tags.length) currentResult.tags = [...new Set(tags)];
}

function getEditedArticleHtml() {
  const article = articleOutput?.querySelector(".blog-article");
  if (!article || articleOutput.classList.contains("empty")) return "";
  const clone = article.cloneNode(true);
  clone.removeAttribute("contenteditable");
  clone.removeAttribute("spellcheck");
  return `<article class="${clone.className}">${clone.innerHTML}</article>`;
}

function getScheduleDelayMinutes() {
  const rawValue = Number(scheduleDelayMinutes?.value || 30);
  const normalizedValue = Number.isFinite(rawValue) ? rawValue : 30;
  const clampedValue = Math.min(1440, Math.max(5, normalizedValue));
  const roundedValue = Math.round(clampedValue / 5) * 5;
  if (scheduleDelayMinutes) scheduleDelayMinutes.value = String(roundedValue);
  return roundedValue;
}

function updateScheduleDelayVisibility() {
  const isScheduled = postingModeSelect?.value === "예약 포스팅";
  if (scheduleDelayRow) scheduleDelayRow.hidden = !isScheduled;
  if (!postingStatus) return;

  if (!currentResult || !currentContext) {
    postingStatus.textContent = isScheduled
      ? "예약 시간을 설정한 뒤 원고를 생성해주세요."
      : "원고 생성 후 포스팅할 수 있습니다.";
    return;
  }

  postingStatus.textContent = isScheduled
    ? "예약 시간을 설정한 뒤 포스팅을 시작하세요."
    : "포스팅할 준비가 완료되었습니다.";
}

function getPostingTarget(platform) {
  if (platform === "네이버 블로그") {
    const writeUrl = "https://blog.naver.com/GoBlogWrite.naver";
    return {
      name: "네이버 블로그",
      url: `https://nid.naver.com/nidlogin.login?mode=form&url=${encodeURIComponent(writeUrl)}`,
      writeUrl,
    };
  }

  return {
    name: "티스토리",
    url: "https://www.tistory.com/auth/login",
    writeUrl: "https://www.tistory.com/",
  };
}

async function startPosting() {
  if (!currentResult || !currentContext) {
    if (postingStatus) postingStatus.textContent = "먼저 원고를 생성해주세요.";
    return;
  }

  const postingMode = postingModeSelect?.value || "즉시 포스팅";
  const delayMinutes = getScheduleDelayMinutes();
  const target = getPostingTarget(currentContext.platform);
  const loginInfo = getLoginInfoForPlatform(currentContext.platform);

  if (currentContext.platform === "네이버 블로그") {
    const postingWindow = window.open(target.url, "_blank");
    postingWindow?.focus();
    const popupBlocked = !postingWindow;
    await copyText(buildMarkdown(currentResult, currentContext));
    startPostingButton.disabled = true;

    if (postingStatus) {
      postingStatus.textContent = popupBlocked
        ? "목업: 팝업 차단을 해제하면 네이버 로그인 창이 열립니다."
        : "목업: 네이버 로그인 창이 열렸습니다. 실제 구현에서는 저장된 계정으로 자동 로그인 후 글쓰기 화면으로 이동합니다.";
    }

    startPostingButton.disabled = false;
    return;
  }

  if (!loginInfo.id || !loginInfo.password || !loginInfo.loggedInAt) {
    if (postingStatus) postingStatus.textContent = `${target.name} 로그인을 먼저 완료해주세요.`;
    openSettingsPanel("loginSettings");
    return;
  }

  const postingWindow = window.open(target.url, "_blank");
  postingWindow?.focus();
  const popupBlocked = !postingWindow;
  const postContent =
    currentContext.platform === "티스토리" ? buildHtml(currentResult, currentContext) : buildMarkdown(currentResult, currentContext);
  const copied = await copyText(postContent);

  startPostingButton.disabled = true;
  if (postingStatus) {
    postingStatus.textContent = popupBlocked
      ? "브라우저 팝업 차단을 해제하면 포스팅 화면이 열립니다."
      : postingMode === "예약 포스팅"
        ? `${target.name} 로그인 화면이 열렸습니다. 로그인 버튼을 누르면 ${delayMinutes}분 뒤 예약 포스팅 준비로 이어집니다.`
        : `${target.name} 로그인 화면이 열렸습니다. 로그인 버튼을 누르면 글쓰기 화면으로 이동합니다.`;
  }

  await wait(650);

  if (postingStatus) {
    postingStatus.textContent = popupBlocked
      ? "팝업이 차단되어 새 창을 열지 못했습니다."
      : postingMode === "예약 포스팅"
        ? `${target.name} 원고가 복사되었습니다. 열린 창에서 로그인 버튼을 누른 뒤 ${delayMinutes}분 뒤 예약으로 설정해주세요.`
        : copied
          ? `${target.name} 원고가 클립보드에 복사되었습니다. 열린 창에서 로그인 버튼을 눌러주세요.`
          : `${target.name} 로그인 화면이 열렸지만 원고 복사는 실패했습니다.`;
  }
  startPostingButton.disabled = false;
}

function saveGeneratedDraft(title) {
  if (!currentResult || !currentContext) return;

  try {
    const savedAt = new Date();
    const draft = {
      savedAt: savedAt.toISOString(),
      title,
      previewHtml: articleOutput.innerHTML,
      markdown: buildMarkdown(currentResult, currentContext),
      html: buildHtml(currentResult, currentContext),
      customPrompt: currentContext.customPrompt || "",
    };
    const drafts = [draft, ...getSavedDrafts()].slice(0, 10);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    localStorage.setItem(LAST_DRAFT_KEY, JSON.stringify(draft));
    if (draftStatus) draftStatus.textContent = `* 자동 저장됨 ${formatDateTime(savedAt)}`;
    renderDraftList();
  } catch {
    if (draftStatus) draftStatus.textContent = "* 자동 저장 실패";
  }
}

function buildMarkdown(result, data) {
  syncEditedArticleFromDom();
  if (result.markdownContent) return result.markdownContent;

  const title = result.titles[0];
  const imageSlots = getImageSlots(data);
  const sections = result.outline.map((heading, index) => {
    const paragraph = result.article[index + 1] || "";
    const paragraphIndex = index + 1;
    const imageSlotIndex = imageSlots.indexOf(paragraphIndex);
    const image = imageSlotIndex >= 0 ? result.images[imageSlotIndex % result.images.length] : null;
    const imageMarkdown =
      image?.type === "site"
        ? `\n\n[첨부 링크 확인 화면: ${image.domain}](${image.url})`
        : image?.type === "uploaded"
          ? `\n\n![직접 사용 캡처: ${image.fileName}](${image.src})`
          : image
            ? `\n\n![${image.alt}](${image.src})`
            : "";
    return `## ${heading}\n\n${paragraph}${imageMarkdown}`;
  });

  const output = [
    `# ${title}`,
    `작성자 관점: ${result.profile.authorName} · ${result.profile.authorType} · ${result.profile.device}로 확인`,
    result.article[0],
    ...sections,
    "## 체크리스트",
    ...result.checklist.map((item) => `- ${item}`),
    "",
    result.tags.join(" "),
  ];
  if (result.finalImage && result.finalImageAfterIndex === undefined) output.push(`![${result.finalImage.alt}](${result.finalImage.src})`);
  return output.join("\n\n");
}

function buildHtml(result, data) {
  syncEditedArticleFromDom();
  const editedHtml = getEditedArticleHtml();
  if (editedHtml) return editedHtml;

  const title = result.titles[0];
  const imageSlots = getImageSlots(data);
  const lines = [
    '<article class="blog-post">',
    `  <h1>${escapeHtml(title)}</h1>`,
    `  <p class="byline">${escapeHtml(result.profile.authorName)} · ${escapeHtml(result.profile.authorType)} · ${escapeHtml(result.profile.device)}로 확인</p>`,
  ];
  result.article.forEach((paragraph, index) => {
    if (index > 0 && result.outline[index - 1]) {
      lines.push(`  <h2>${escapeHtml(result.outline[index - 1])}</h2>`);
    }
    lines.push(`  <p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`);
    const imageSlotIndex = imageSlots.indexOf(index);
    const image = imageSlotIndex >= 0 ? result.images[imageSlotIndex % result.images.length] : null;
    if (image) {
      if (image.type === "site") {
        lines.push(`  <figure class="site-shot">`);
        lines.push(`    <div class="reference-browser">`);
        lines.push(`      <a href="${escapeHtml(image.url)}" target="_blank" rel="noreferrer">`);
        lines.push(`        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.domain)} 실제 사이트 화면" loading="lazy" />`);
        lines.push(`      </a>`);
        lines.push(`    </div>`);
        lines.push(`  </figure>`);
      } else if (image.type === "uploaded") {
        lines.push(`  <figure class="user-shot">`);
        lines.push(`    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />`);
        lines.push(`  </figure>`);
      } else {
        lines.push(`  <figure>`);
        lines.push(`    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy" />`);
        lines.push(`  </figure>`);
      }
    }
    if (result.finalImage && result.finalImageAfterIndex === index) {
      lines.push(`  <figure class="final-image">`);
      lines.push(`    <img src="${escapeHtml(result.finalImage.src)}" alt="${escapeHtml(result.finalImage.alt)}" loading="lazy" />`);
      lines.push(`  </figure>`);
    }
    (result.inlineImages || [])
      .filter((item) => item.afterIndex === index)
      .forEach((item) => {
        lines.push(`  <figure>`);
        lines.push(`    <img src="${escapeHtml(item.image.src)}" alt="${escapeHtml(item.image.alt)}" loading="lazy" />`);
        lines.push(`  </figure>`);
      });
  });
  lines.push('  <div class="tags">');
  result.tags.forEach((tag) => {
    lines.push(`    <span>${escapeHtml(tag)}</span>`);
  });
  if (result.finalImage && result.finalImageAfterIndex === undefined) {
    lines.push("  </div>");
    lines.push(`  <figure class="final-image">`);
    lines.push(`    <img src="${escapeHtml(result.finalImage.src)}" alt="${escapeHtml(result.finalImage.alt)}" loading="lazy" />`);
    lines.push(`  </figure>`);
    lines.push("</article>");
    return lines.join("\n");
  }
  lines.push("  </div>", "</article>");
  return lines.join("\n");
}

async function copyGenerated(format) {
  if (!currentResult || !currentContext || articleOutput.classList.contains("empty")) return;

  const isHtml = format === "html";
  const button = isHtml ? htmlButton : markdownButton;
  const original = button.textContent;
  const content = isHtml ? buildHtml(currentResult, currentContext) : buildMarkdown(currentResult, currentContext);

  const copied = await copyText(content);
  button.textContent = copied ? "복사됨" : "복사 실패";
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the file:// friendly fallback below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

function normalizeTag(tag) {
  const text = String(tag || "").trim().replace(/\s+/g, "");
  if (!text) return "";
  return text.startsWith("#") ? text : `#${text}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

if (window.location.hash === "#demo") {
  window.setTimeout(() => {
    generateButton.click();
  }, 300);
}

loadTrendFeed();
loadCustomPrompt();
loadLoginInfo();
updateScheduleDelayVisibility();
updateTrendMixRatioLabel();
window.setInterval(() => loadTrendFeed({ force: true }), 60 * 60 * 1000);
