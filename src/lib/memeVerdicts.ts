export interface MemeVerdict {
  score: number;
  verdict: string;
  emoji: string;
  shareText: string;
  scoreEmojis: string;
}

// Multiple verdicts per score range for variety
const verdictsByScore: { [key: number]: Array<{ verdict: string; emoji: string }> } = {
  10: [
    { verdict: "Foot model material. Quentin Tarantino would approve.", emoji: "👑" },
    { verdict: "These feet belong in a museum. Perfect specimen.", emoji: "🏛️" },
    { verdict: "God-tier feet. Michelangelo would carve these.", emoji: "✨" },
    { verdict: "Certified foot royalty. Bow down to these toes.", emoji: "👑" }
  ],
  9: [
    { verdict: "Cinderella-ready. Glass slipper approved.", emoji: "🥿" },
    { verdict: "These feet could sell sandals. Model material.", emoji: "🩴" },
    { verdict: "Foot goals achieved. Instagram worthy.", emoji: "📸" },
    { verdict: "Almost perfect. Just missing the crown.", emoji: "👑" }
  ],
  8: [
    { verdict: "Pretty decent feet. Sandal season ready.", emoji: "🩴" },
    { verdict: "Solid foot game. No shame in these toes.", emoji: "👍" },
    { verdict: "Good looking feet. Beach approved.", emoji: "🏖️" },
    { verdict: "Respectable feet. Could do much worse.", emoji: "👌" }
  ],
  7: [
    { verdict: "Not bad at all. Could do worse.", emoji: "👍" },
    { verdict: "Decent feet. Nothing to hide here.", emoji: "😊" },
    { verdict: "Acceptable foot situation. Moving on.", emoji: "✅" },
    { verdict: "Fine feet. No complaints from me.", emoji: "👍" }
  ],
  6: [
    { verdict: "Average feet. Would pass unnoticed in sandals.", emoji: "😐" },
    { verdict: "Meh feet. They exist, that's something.", emoji: "🤷" },
    { verdict: "Standard issue feet. Nothing special.", emoji: "📦" },
    { verdict: "Basic feet. At least they work.", emoji: "😐" }
  ],
  5: [
    { verdict: "Meh. At least they're attached to your legs.", emoji: "🤷" },
    { verdict: "Questionable feet. But functional.", emoji: "❓" },
    { verdict: "Not great, not terrible. Just... feet.", emoji: "😕" },
    { verdict: "Mediocre feet. Could be worse, could be better.", emoji: "🤷" }
  ],
  4: [
    { verdict: "Yikes. Time for some TLC.", emoji: "😬" },
    { verdict: "These feet need therapy. And maybe a spa day.", emoji: "🧖" },
    { verdict: "Foot situation: concerning. But fixable.", emoji: "⚠️" },
    { verdict: "Not the worst, but definitely not the best.", emoji: "😬" }
  ],
  3: [
    { verdict: "Ouch. Walking must be painful.", emoji: "😵" },
    { verdict: "These feet have seen things. Dark things.", emoji: "😱" },
    { verdict: "Foot emergency. Call the foot doctor.", emoji: "🚑" },
    { verdict: "Painful to look at. Probably painful to walk on.", emoji: "😵" }
  ],
  2: [
    { verdict: "Looks like you walk on Legos daily.", emoji: "💀" },
    { verdict: "Certified Crocs-only feet.", emoji: "🩴" },
    { verdict: "AI said: hide those toes 😭", emoji: "😭" },
    { verdict: "These feet need witness protection.", emoji: "🕵️" },
    { verdict: "Foot crime scene. Evidence of neglect.", emoji: "🚨" },
    { verdict: "These toes have been through war.", emoji: "⚔️" }
  ],
  1: [
    { verdict: "Emergency podiatrist appointment needed.", emoji: "🚨" },
    { verdict: "These feet are a medical mystery.", emoji: "🔬" },
    { verdict: "Foot apocalypse. End times for toes.", emoji: "💥" },
    { verdict: "These feet need an exorcism.", emoji: "👻" },
    { verdict: "Foot disaster. Call FEMA.", emoji: "🌪️" },
    { verdict: "These feet are a war crime.", emoji: "⚖️" }
  ]
};

// Score emojis for different ranges
const getScoreEmojis = (score: number): string => {
  if (score >= 9.5) return "🔥👑✨";
  if (score >= 8.5) return "🔥👑";
  if (score >= 7.5) return "🔥👍";
  if (score >= 6.5) return "👍😊";
  if (score >= 5.5) return "😐🤷";
  if (score >= 4.5) return "😕❓";
  if (score >= 3.5) return "😬⚠️";
  if (score >= 2.5) return "😵😱";
  if (score >= 1.5) return "💀😭";
  return "🚨💥";
};

export const getMemeVerdict = (score: number): MemeVerdict => {
  const roundedScore = Math.round(score);
  const scoreKey = Math.max(1, Math.min(10, roundedScore));
  const verdicts = verdictsByScore[scoreKey] || verdictsByScore[1];
  
  // Randomly select a verdict for variety
  const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  
  return {
    score: scoreKey,
    verdict: randomVerdict.verdict,
    emoji: randomVerdict.emoji,
    scoreEmojis: getScoreEmojis(score),
    shareText: `AI roasted my feet ${randomVerdict.emoji} Got a ${scoreKey}/10 on FootRate AI 👣 footrateai.com`
  };
};

export const getOverallMemeVerdict = (score: number): MemeVerdict => {
  return getMemeVerdict(score);
};
