// ============================================================
// 每日練聲計劃 — Training Content Data
// 18 days of vocal training, 5 phases, Traditional Chinese
// ============================================================

export interface Exercise {
  id: string;
  title: string;
  duration: string;
  steps: string[];
  commonMistakes: string[];
  verification: string;
  videos?: { title: string; url: string; embedId: string | null }[];
}

export interface DayContent {
  day: number;
  phase: 'breath' | 'chest' | 'head' | 'range' | 'mixed';
  phaseName: string;
  phaseSubtitle: string;
  goal: string;
  solution: string;
  review?: string;
  warmup: string[];
  warmupVideos?: { label: string; url: string; embedId: string | null }[];
  exercises: Exercise[];
  schedule: { time: string; content: string }[];
  totalTime: string;
  closingTip?: string;
}

// ============================================================
// GOLDEN RULES
// ============================================================

export const GOLDEN_RULES: string[] = [
  '永遠用肚子唱歌 — 喉嚨只是通道，不是發力點',
  '放鬆比用力更重要 — 下巴、舌頭、肩膀、脖子全程放鬆',
  '寧可小聲唱對，不要大聲唱錯 — 先追求正確的共鳴位置，再追求音量',
  '喝水！喝水！喝水！ — 練習前後喝溫水，練習中保持喉嚨濕潤',
  '累了就停 — 喉嚨不舒服立刻休息，不要硬撐',
  '錄音回聽 — 每天錄一段自己練習的聲音，對比進步',
  '鏡子是好朋友 — 對著鏡子練，觀察嘴型、下巴、喉頭位置',
];

// ============================================================
// PHASE CONFIG (for day selector colors)
// ============================================================

export interface PhaseConfig {
  name: string;
  days: string;
  color: string;
  className: string;
}

export const PHASES: Record<DayContent['phase'], PhaseConfig> = {
  breath: { name: '氣息基礎', days: 'Day 1–4', color: '#60a5fa', className: 'breath' },
  chest: { name: '胸腔共鳴', days: 'Day 5–8', color: '#fbbf24', className: 'chest' },
  head: { name: '頭腔共鳴', days: 'Day 9–12', color: '#a78bfa', className: 'head' },
  range: { name: '高低音轉換', days: 'Day 13–15', color: '#34d399', className: 'range' },
  mixed: { name: '混聲整合', days: 'Day 16–18', color: '#fb923c', className: 'mixed' },
};

// ============================================================
// WARMUP (shared across all phases)
// ============================================================

const WARMUP: string[] = [
  '轉動肩膀：向前 5 圈，向後 5 圈',
  '左右轉頭：慢慢轉，感受頸部拉伸',
  '張大嘴巴 3 次，再收緊 3 次（打開牙關）',
  '閉嘴，用氣息震動嘴唇，發出「噗嚕嚕嚕～」的聲音，從舒適的中音區開始慢慢上下滑',
  '保持唇顫，跟著音階上下行：「嘟～嚕～嚕～嚕～」C4 → C5 → C4',
];

// ============================================================
// EXERCISES
// ============================================================

const EXERCISE_1: Exercise = {
  id: 'ex1',
  title: '呼吸與氣息控制練習',
  duration: '5 min',
  steps: [
    '躺著練腹式呼吸（2 分鐘）：平躺，一隻手放在肚臍上方，一隻手放在胸口；用鼻子吸氣 4 秒 → 感受肚子鼓起（胸腔保持不動）；用嘴巴吐氣 8 秒，發出「嘶～」聲 → 感受肚子慢慢縮回；重複 10 次',
    '坐著 / 站著腹式呼吸（3 分鐘）：坐直或站直，肩膀放鬆下沉；吸氣 4 秒（肚子鼓起）→ 憋氣 4 秒 → 吐氣 8 秒（「嘶～」聲）；進階：吐氣延長到 12 秒、16 秒；重複 8–10 次',
  ],
  commonMistakes: [
    '吸氣時肩膀聳起 → 肩膀保持放鬆下沉',
    '吸氣時胸腔鼓起 → 只有肚子動',
    '吐氣時氣息一下子衝出來 → 均勻、穩定地釋放',
  ],
  verification: '能穩定地用「嘶～」聲吐氣 16 秒以上。',
  videos: [
    { title: '腹式呼吸超簡單練習', url: 'https://www.youtube.com/watch?v=N3pT51rCMD0', embedId: 'N3pT51rCMD0' },
    { title: '三個最關鍵歌唱呼吸訓練', url: 'https://www.youtube.com/watch?v=b4_k0WIN6Fg', embedId: 'b4_k0WIN6Fg' },
  ],
};

const EXERCISE_2: Exercise = {
  id: 'ex2',
  title: '氣息穩定性練習',
  duration: '5 min',
  steps: [
    '紙片練習（2 分鐘）：面對牆壁，距離約 15 公分；拿一張薄紙巾貼在牆上，用平穩的氣息吹住它；目標：讓紙巾貼在牆上 15–20 秒不掉落；氣息必須極度均勻——太強紙會飛走，太弱紙會掉落',
    '蠟燭練習（3 分鐘）：點一根蠟燭，距離約 15–20 公分；用平穩氣息吹向火焰，讓火焰傾斜但不熄滅；保持 15 秒 → 20 秒 → 30 秒；安全替代方案：用手機手電筒 App，感受氣息推送的均勻度',
  ],
  commonMistakes: [
    '一開始氣息很強，後面沒氣了 → 從頭到尾保持相同力道',
    '用喉嚨擠壓控制氣息 → 用橫膈膜（肚子）控制',
  ],
  verification: '紙巾貼牆 20 秒不掉；火焰持續傾斜 20 秒不熄滅。',
  videos: [
    { title: '10分鐘學會氣息穩定支撐', url: 'https://www.youtube.com/watch?v=CXsA3oZ3G7Y', embedId: 'CXsA3oZ3G7Y' },
    { title: '一次搞懂唱歌氣息支撐', url: 'https://www.youtube.com/watch?v=-Yr66Tc4DyI', embedId: '-Yr66Tc4DyI' },
  ],
};

const EXERCISE_3: Exercise = {
  id: 'ex3',
  title: '氣息流動性練習',
  duration: '5 min',
  steps: [
    '跳音練習（Staccato）（2 分鐘）：用「哈！哈！哈！哈！哈！」短促有力地發聲；每一下都由肚子（橫膈膜）彈跳推動；5 個一組，做 5 組；感受：肚子像被輕輕揍了一拳，自然地收縮彈出',
    '長短音交替（3 分鐘）：用「嘶～」聲做：短-短-短-長～～～（重複循環）；節奏：「嘶 嘶 嘶 嘶～～～～～」；短音用肚子彈跳，長音保持穩定輸出；做 2 分鐘，休息 30 秒，再做 1 分鐘',
  ],
  commonMistakes: [
    '跳音時喉嚨用力 → 力量來自肚子，喉嚨完全放鬆',
    '長音時氣息越來越弱 → 保持橫膈膜持續支撐',
  ],
  verification: '跳音清晰有力，每個音之間有明顯的斷開；長音平穩不抖。',
  videos: [
    { title: '歌手必做唇顫音彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
    { title: '唇顫音必學教學', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
  ],
};

const EXERCISE_4: Exercise = {
  id: 'ex4',
  title: '胸腔共鳴之喉位穩定性練習',
  duration: '5 min',
  steps: [
    '打哈欠找喉位（1 分鐘）：深深打一個哈欠，感受喉頭（喉結）向下移動；保持這個「半打哈欠」的低喉位狀態；這就是唱歌時喉頭的理想位置',
    '低喉位「喔」長音（2 分鐘）：保持低喉位，用「喔～～」唱一個舒適的低音；一隻手輕放在喉結位置，確保它不往上跑；維持 8–10 秒，重複 5 次',
    '下行音階保持喉位（2 分鐘）：從中音區開始，用「喔」唱下行音階：sol-fa-mi-re-do；每往下一階，確保喉頭不跟著往下壓過頭（保持穩定）；重複 3 組',
  ],
  commonMistakes: [
    '為了低喉位，刻意用舌根壓喉 → 放鬆地打開，像半打哈欠',
    '唱低音時喉頭往上跑 → 保持空間感，想像聲音往胸腔沉',
  ],
  verification: '唱下行音階時，喉頭穩定不亂動。',
  videos: [
    { title: '腹式呼吸與喉位放鬆', url: 'https://www.youtube.com/watch?v=Cf4_bnBf6sA', embedId: 'Cf4_bnBf6sA' },
    { title: '哼鳴大小事 — 打哈欠喉位', url: 'https://www.youtube.com/watch?v=WW94DYoQylY', embedId: 'WW94DYoQylY' },
  ],
};

const EXERCISE_5: Exercise = {
  id: 'ex5',
  title: '胸腔共鳴練習',
  duration: '7 min',
  steps: [
    '「嗡」胸腔震動感知（2 分鐘）：閉嘴發出「Mmmm～～～」（像在說「嗯～好吃」）；一隻手放在胸口，感受胸腔的震動；從舒適的低音開始，慢慢往下走；目標：讓胸腔明顯震動',
    '「叭」音胸腔共鳴（2 分鐘）：用「叭～（Ba～～）」唱長音，嘴唇放鬆；從中低音區開始：C3 → G3 → C3；手放在胸口確認震動；每個音保持 6–8 秒',
    '胸腔共鳴音階下行（3 分鐘）：用「喔」唱下行音階：Do-Si-La-Sol-Fa-Mi-Re-Do；從 C4 開始，每次下行半音，直到你舒服的最低音；保持胸腔震動感，聲音沉下去但不壓迫；做 3 組',
  ],
  commonMistakes: [
    '為了胸腔震動刻意壓喉嚨 → 自然放鬆，氣息推動',
    '聲音悶在喉嚨裡 → 想像聲音從胸口「射」出去',
  ],
  verification: '唱低音時胸口明顯震動，聲音渾厚不虛。',
  videos: [
    { title: '胸腔共鳴發聲練習', url: 'https://www.youtube.com/watch?v=ASgUkdxv2Ys', embedId: 'ASgUkdxv2Ys' },
    { title: '共鳴深入應用教學', url: 'https://www.youtube.com/watch?v=G3u38yDHg6U', embedId: 'G3u38yDHg6U' },
  ],
};

const EXERCISE_6: Exercise = {
  id: 'ex6',
  title: '頭腔共鳴的哼鳴練習',
  duration: '6 min',
  steps: [
    '閉嘴哼鳴找位置（2 分鐘）：閉嘴，發出「嗯～～～（Mmmm）」；感受聲音在鼻子後方、眉心附近的震動；用手指輕觸眉心、鼻樑兩側——應該感受到震動；從舒適音開始，慢慢往上滑',
    '哼鳴音階上行（2 分鐘）：保持閉嘴哼鳴，唱上行音階：Do-Re-Mi-Fa-Sol-Fa-Mi-Re-Do；從 C4 開始，每組升半音；關鍵：越高音，越要感受聲音「往前、往上」送到眉心；做 5 組',
    '「Mmm → Ma」轉換（2 分鐘）：哼鳴 3 秒 → 張嘴變成「Ma～～」保持相同位置 5 秒；從閉嘴到張嘴，共鳴位置不能掉；在舒適的中高音區練習',
  ],
  commonMistakes: [
    '哼鳴時鼻子完全堵住（過度鼻音）→ 氣息從鼻子和口腔同時流通',
    '張嘴變成「Ma」時，聲音位置掉到喉嚨 → 保持哼鳴時的眉心震動感',
    '高音時下巴收緊 → 下巴完全放鬆，像含著一口水',
  ],
  verification: '哼鳴時眉心有明顯震動感；Mmm → Ma 轉換時位置不掉。',
  videos: [
    { title: '為什麼要哼鳴？作用與位置判斷', url: 'https://www.youtube.com/watch?v=hDVLpZGhAK0', embedId: 'hDVLpZGhAK0' },
    { title: '哼鳴的深入應用', url: 'https://www.youtube.com/watch?v=9i_aiWADI3I', embedId: '9i_aiWADI3I' },
  ],
};

const EXERCISE_7: Exercise = {
  id: 'ex7',
  title: '頭腔共鳴的聲音平衡練習',
  duration: '6 min',
  steps: [
    '「Nay～」鼻音練習（2 分鐘）：用尖銳但放鬆的「Nay～～～」（像卡通人物的聲音）；從中音區上行到高音區，保持聲音集中、明亮；感受聲音像一條線，直直地從頭頂穿出去；C4 → C5 上行',
    '「Mum」頭腔共鳴（2 分鐘）：用「Mum～～」唱長音（M 起頭，m 收尾）；在中高音區練習：G4 → C5 → G4；保持聲音在頭腔，不要掉到喉嚨；每個音 6–8 秒',
    '開閉音交替平衡（2 分鐘）：「Mmmm（閉）→ Aaaa（開）」交替；確保開口的「Aaaa」和閉口的「Mmmm」在同一個共鳴位置；上行音階練習',
  ],
  commonMistakes: [
    '頭腔聲音太「飄」太虛 → 保持氣息支撐，不要放棄橫膈膜',
    '頭腔聲音太「擠」太尖 → 放鬆下巴和舌根',
    '聲音悶在鼻子裡 → 想像聲音從眉心「射」向前方',
  ],
  verification: '頭腔聲音明亮、集中、不費力；從閉口到開口位置一致。',
  videos: [
    { title: '哼鳴練習讓聲音集中有共鳴', url: 'https://www.youtube.com/watch?v=aVY5wG5_kZ0', embedId: 'aVY5wG5_kZ0' },
    { title: '歌唱共鳴技巧合集', url: 'https://www.youtube.com/playlist?list=PLVhWnCDolQxzUVQAdw7enQyBzviBeGhw9', embedId: 'videoseries?list=PLVhWnCDolQxzUVQAdw7enQyBzviBeGhw9' },
  ],
};

const EXERCISE_8: Exercise = {
  id: 'ex8',
  title: '高低音轉換的喉位穩定練習',
  duration: '6 min',
  steps: [
    '滑音練習（Siren）（2 分鐘）：用「嗚～～～」從最低音慢慢滑到最高音，再滑回來；像救護車的警笛聲；全程喉頭保持穩定，不要往上衝或往下壓；做 5 次來回；關鍵：中間不能斷，像一條平滑的曲線',
    '八度跳躍（2 分鐘）：用「啊」唱：Do（低）→ Do（高八度）→ Do（低）；從 C3-C4-C3 開始，每次升半音；跳躍時喉頭不能動；做 5 組',
    '五度音階來回（2 分鐘）：用「嗚」唱：Do-Re-Mi-Fa-Sol-Fa-Mi-Re-Do；從低音區開始，慢慢往上提高起音；觀察喉頭在整個過程中是否穩定',
  ],
  commonMistakes: [
    '往高音滑時喉頭往上跑 → 保持半打哈欠的低喉位',
    '往低音滑時喉頭往下壓過頭 → 放鬆，讓聲音自然下沉',
    '八度跳躍中間有「斷層」→ 氣息持續供給，不要中斷',
  ],
  verification: '滑音平滑無斷層；八度跳躍喉頭穩定。',
  videos: [
    { title: 'Lip trill 幫你輕鬆唱高低音', url: 'https://www.youtube.com/shorts/6aZhTBywL28', embedId: '6aZhTBywL28' },
    { title: '滑音練習 Say or Sing', url: 'https://www.youtube.com/playlist?list=PLzANh4rNycJWYDyQVjx4_mmkYuPc8vHFc', embedId: 'videoseries?list=PLzANh4rNycJWYDyQVjx4_mmkYuPc8vHFc' },
  ],
};

const EXERCISE_9: Exercise = {
  id: 'ex9',
  title: '高低音轉換的平衡練習',
  duration: '7 min',
  steps: [
    '漸強漸弱（Messa di Voce）（3 分鐘）：選一個舒適的中音，用「啊」唱；從極弱 (pp) → 慢慢漸強到最強 (ff) → 再慢慢漸弱到極弱 (pp)；整個過程氣息穩定，聲音不抖；在低音、中音、高音各做一次；每個音保持 15–20 秒',
    '跨音區滑音（2 分鐘）：用「咿～～啊～～」從胸腔音區滑到頭腔音區；感受聲音從胸口慢慢「爬」到頭頂；中間不能有斷層或音色突變；做 5 次來回',
    '實際歌曲片段練習（2 分鐘）：選一首有高低音跨度大的歌（如《洋蔥》、《泡沫》）；只唱副歌中高低音轉換的那一句；反覆練習，確保轉換順暢',
  ],
  commonMistakes: [
    '漸強時變成「吼叫」→ 是氣息加量，不是喉嚨加力',
    '漸弱時氣息斷掉 → 橫膈膜持續支撐',
    '跨音區時音色突變 → 想像聲音是一條絲帶，平滑過渡',
  ],
  verification: '漸強漸弱平穩不抖；跨音區滑音無斷層。',
  videos: [
    { title: '流行唱法系統課程', url: 'https://www.youtube.com/watch?v=lo0oxUT9Iyg', embedId: 'lo0oxUT9Iyg' },
    { title: '張喜秋談換聲技術', url: 'https://www.youtube.com/watch?v=wDq0bnSfMUc', embedId: 'wDq0bnSfMUc' },
  ],
};

const EXERCISE_10: Exercise = {
  id: 'ex10',
  title: '混聲的閉口音練習',
  duration: '7 min',
  steps: [
    '「Goog」閉口混聲定位（2 分鐘）：發出「Goog」（像 Google 的 goog），感受聲音同時在胸腔和頭腔震動；閉口時（g 收尾），聲音集中在鼻腔後方；從中音區開始，慢慢上行；做 8–10 次',
    '「Nay」混聲音階（2 分鐘）：用「Nay～」唱上行五度音階：Do-Re-Mi-Fa-Sol-Fa-Mi-Re-Do；從 C4 開始，每組升半音，直到你的換聲區附近；關鍵：在換聲區（E4–G4 附近），讓聲音自然地「混」起來；不要刻意推擠或放虛',
    '閉口混聲長音（3 分鐘）：用「Mmm」在換聲區附近（F4–A4）唱長音；保持 8–10 秒；感受聲音在臉部前方的集中點；同時保持胸腔的輕微震動',
  ],
  commonMistakes: [
    '到換聲區時聲音突然變虛（假聲）→ 保持氣息支撐，不要放棄',
    '到換聲區時聲音突然變喊（扯喉嚨）→ 放鬆喉頭，讓共鳴自然混合',
    '閉口音太「鼻」→ 氣息從口腔和鼻腔同時流出',
  ],
  verification: '在換聲區附近，聲音自然混合，沒有突然的「斷層」或「變虛」。',
  videos: [
    { title: '混声练习，告別声音断层', url: 'https://www.youtube.com/watch?v=Kwwd9kAKRPc', embedId: 'Kwwd9kAKRPc' },
    { title: '闭口哼鸣转开口哼鸣', url: 'https://www.youtube.com/watch?v=uxWBOEO9TiQ', embedId: 'uxWBOEO9TiQ' },
  ],
};

const EXERCISE_11: Exercise = {
  id: 'ex11',
  title: '混聲的開口音練習',
  duration: '8 min',
  steps: [
    '「Mah」開口混聲定位（2 分鐘）：用「Mah～」在換聲區附近（E4–G4）唱長音；嘴巴自然張開（約兩指寬），下巴放鬆；感受聲音從眉心 + 胸口同時震動；保持 8–10 秒，做 5 次',
    '混聲音階上行（3 分鐘）：用「啊」唱完整八度音階，從 C4 到 C5：Do-Re-Mi-Fa-Sol-La-Si-Do-Si-La-Sol-Fa-Mi-Re-Do；在換聲區時，讓聲音自然混合；過了換聲區後，保持混聲不要掉回純頭聲；每組升半音，挑戰自己的最高混聲音',
    '力量混聲練習（3 分鐘）：用「Yeah！」像搖滾歌手一樣有力地喊出來；短促、有力，但不傷喉嚨；力量來自肚子（橫膈膜彈跳），不是喉嚨；在換聲區附近練習：5 個一組，做 5 組；然後用「Yeah～～～」拉長音，保持力量感',
  ],
  commonMistakes: [
    '開口音時嘴巴張太大，聲音散掉 → 嘴巴放鬆自然張開',
    '追求力量變成「喊」→ 力量來自氣息支撐',
    '過了換聲區聲音變虛 → 保持混聲狀態，不要退縮',
  ],
  verification: '在 C5 以下都能用混聲穩定發聲；混聲有力不虛、不喊。',
  videos: [
    { title: '开口音闭口音基本功练习', url: 'https://www.youtube.com/watch?v=5t-sYIJVm3s', embedId: '5t-sYIJVm3s' },
    { title: '真假混声练习详细过程', url: 'https://www.youtube.com/watch?v=DGLrUso1SZg', embedId: 'DGLrUso1SZg' },
  ],
};

// ============================================================
// DAY CONTENT
// ============================================================

// --- Phase 1: 氣息基礎 (Days 1–4) ---

const phase1DayContent: Omit<DayContent, 'day'> = {
  phase: 'breath',
  phaseName: '氣息基礎',
  phaseSubtitle: 'Day 1–4',
  goal: '建立正確的呼吸習慣，讓氣息成為唱歌的「油箱」。',
  solution: '氣息不夠用、聲音虛弱無力',
  warmup: WARMUP,
  warmupVideos: [
    { label: '唇顫音示範', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
    { label: '彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
  ],
  exercises: [EXERCISE_1, EXERCISE_2, EXERCISE_3],
  schedule: [
    { time: '3 min', content: '熱身' },
    { time: '5 min', content: '練習一：呼吸與氣息控制練習' },
    { time: '5 min', content: '練習二：氣息穩定性練習' },
    { time: '5 min', content: '練習三：氣息流動性練習' },
    { time: '3 min', content: '用「啊～～」長音唱一個舒適的音，感受氣息支撐' },
  ],
  totalTime: '20–21 min',
};

// --- Phase 2: 胸腔共鳴 (Days 5–8) ---

const phase2DayContent: Omit<DayContent, 'day'> = {
  phase: 'chest',
  phaseName: '胸腔共鳴',
  phaseSubtitle: 'Day 5–8',
  goal: '打開胸腔共鳴，讓低音渾厚有力，聲音不再虛弱。',
  solution: '聲音虛弱無力、低音下不來',
  review: '每天前 3 分鐘做腹式呼吸（練習一）',
  warmup: WARMUP,
  warmupVideos: [
    { label: '唇顫音示範', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
    { label: '彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
  ],
  exercises: [EXERCISE_4, EXERCISE_5],
  schedule: [
    { time: '3 min', content: '熱身 + 腹式呼吸複習' },
    { time: '5 min', content: '練習四：胸腔共鳴之喉位穩定性練習' },
    { time: '7 min', content: '練習五：胸腔共鳴練習' },
    { time: '3 min', content: '練習一複習' },
    { time: '3 min', content: '用「喔」唱一首簡單的低音旋律' },
  ],
  totalTime: '21 min',
};

// --- Phase 3: 頭腔共鳴 (Days 9–12) ---

const phase3DayContent: Omit<DayContent, 'day'> = {
  phase: 'head',
  phaseName: '頭腔共鳴',
  phaseSubtitle: 'Day 9–12',
  goal: '打開頭腔共鳴，讓高音明亮、輕鬆，不再「卡住」。',
  solution: '高音上不去、聲音悶／聲音飄',
  review: '每天前 2 分鐘腹式呼吸 + 2 分鐘胸腔共鳴',
  warmup: WARMUP,
  warmupVideos: [
    { label: '唇顫音示範', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
    { label: '彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
  ],
  exercises: [EXERCISE_6, EXERCISE_7],
  schedule: [
    { time: '4 min', content: '熱身 + 腹式呼吸複習 + 胸腔共鳴複習' },
    { time: '6 min', content: '練習六：頭腔共鳴的哼鳴練習' },
    { time: '6 min', content: '練習七：頭腔共鳴的聲音平衡練習' },
    { time: '3 min', content: '用「啊」唱上行音階' },
    { time: '3 min', content: '選一首喜歡的歌只用哼鳴唱主旋律' },
  ],
  totalTime: '22 min',
};

// --- Phase 4: 高低音轉換 (Days 13–15) ---

const phase4DayContent: Omit<DayContent, 'day'> = {
  phase: 'range',
  phaseName: '高低音轉換',
  phaseSubtitle: 'Day 13–15',
  goal: '讓高低音之間無縫切換，消除「斷層」感。',
  solution: '高音上不去、低音下不來',
  review: '每天前複習氣息 + 胸腔 + 頭腔各 1–2 分鐘',
  warmup: WARMUP,
  warmupVideos: [
    { label: '唇顫音示範', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
    { label: '彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
  ],
  exercises: [EXERCISE_8, EXERCISE_9],
  schedule: [
    { time: '5 min', content: '熱身 + 氣息 + 胸腔 + 頭腔快速複習' },
    { time: '6 min', content: '練習八：高低音轉換的喉位穩定練習' },
    { time: '7 min', content: '練習九：高低音轉換的平衡練習' },
    { time: '5 min', content: '用一首歌的副歌練習高低音轉換' },
  ],
  totalTime: '23 min',
};

// --- Phase 5: 混聲整合 (Days 16–18) ---

const phase5DayContent: Omit<DayContent, 'day'> = {
  phase: 'mixed',
  phaseName: '混聲整合',
  phaseSubtitle: 'Day 16–18',
  goal: '掌握混聲技巧，讓聲音有力量、有穿透力，高低音無縫連接。',
  solution: '聲音斷層、力量不足',
  review: '全身熱身 + 氣息 + 胸腔 + 頭腔快速複習',
  warmup: WARMUP,
  warmupVideos: [
    { label: '唇顫音示範', url: 'https://www.youtube.com/watch?v=Ilo4763GuTw', embedId: 'Ilo4763GuTw' },
    { label: '彈唇練習', url: 'https://www.youtube.com/watch?v=x71n8O2hPOM', embedId: 'x71n8O2hPOM' },
  ],
  exercises: [EXERCISE_10, EXERCISE_11],
  schedule: [
    { time: '5 min', content: '全身熱身 + 氣息 + 胸腔 + 頭腔快速複習' },
    { time: '7 min', content: '練習十：混聲的閉口音練習' },
    { time: '8 min', content: '練習十一：混聲的開口音練習' },
    { time: '5 min', content: '完整唱一首有挑戰性的歌，專注混聲段落' },
  ],
  totalTime: '25 min',
};

// ============================================================
// ALL DAYS (1–18) — assembled from phase templates
// ============================================================

function makeDays(base: Omit<DayContent, 'day'>, dayNumbers: number[]): DayContent[] {
  return dayNumbers.map((day) => ({ ...base, day }));
}

export const ALL_DAYS: DayContent[] = [
  ...makeDays(phase1DayContent, [1, 2, 3, 4]),
  ...makeDays(phase2DayContent, [5, 6, 7, 8]),
  ...makeDays(phase3DayContent, [9, 10, 11, 12]),
  ...makeDays(phase4DayContent, [13, 14, 15]),
  ...makeDays(phase5DayContent, [16, 17, 18]),
];

// Convenience lookup by day number
export function getDayContent(day: number): DayContent | undefined {
  return ALL_DAYS.find((d) => d.day === day);
}

// Get all days for a given phase
export function getDaysByPhase(phase: DayContent['phase']): DayContent[] {
  return ALL_DAYS.filter((d) => d.phase === phase);
}
