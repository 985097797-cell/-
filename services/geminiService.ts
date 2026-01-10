import { GoogleGenAI } from "@google/genai";
import { PlayerConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzePlayerPower(player: PlayerConfig) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一位精通《QQ三国》战力评估的军师。请根据以下打手的配置信息，给出一句极其简短且霸气的古风战力评价（15字以内）。
      
      角色名：${player.name || '无名小卒'}
      职业：${player.role || '未定'}
      等级：${player.level || '未知'}
      定位：${(player.positions || []).join('、') || '尚未明确'}
      
      评价要求：
      1. 必须包含一个具体的战力称号（如：神威大将军、铁甲校尉、绝世舞姬）。
      2. 语言风格：冷峻、古风、霸气。`,
    });

    return response.text.trim().replace(/["']/g, "");
  } catch (error) {
    console.error("Analysis failed:", error);
    return "纵横三国，莫敢不从！";
  }
}