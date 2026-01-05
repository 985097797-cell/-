
import { GoogleGenAI } from "@google/genai";
import { PlayerConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePlayerPower(player: PlayerConfig) {
  const configSummary = Object.keys(player.configs).map(cat => ({
    category: cat,
    count: player.configs[cat].length
  }));

  const totalImages = configSummary.reduce((acc, curr) => acc + curr.count, 0);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一位精通《QQ三国》战力评估的军师。请根据以下打手的配置信息，给出一句极其简短且霸气的古风战力评价（15字以内）。
      
      角色名：${player.name || '无名小卒'}
      职业：${player.role || '未定'}
      等级：${player.level || '未知'}
      已上传备战截图总数：${totalImages}张
      详细分布：${JSON.stringify(configSummary)}
      
      评价要求：
      1. 如果截图总数少于3张，评价要带点督促和严厉。
      2. 如果截图总数多于10张，评价要充满崇拜和震撼。
      3. 必须包含一个具体的战力称号（如：神威大将军、初出茅庐、万夫莫敌）。
      4. 语言风格：冷峻、古风、霸气。`,
    });

    return response.text.trim().replace(/["']/g, "");
  } catch (error) {
    console.error("Analysis failed:", error);
    return "战况不明，速速上报截图！";
  }
}
