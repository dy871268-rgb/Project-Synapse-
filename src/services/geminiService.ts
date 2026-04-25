import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateSkillTree(topic: string) {
  const prompt = `
    Create a technical skill tree for the topic: "${topic}".
    Output a JSON object with "nodes" and "edges" suitable for React Flow.
    Nodes should include data with: label (string), type ('core'|'advanced'|'expert'), description (string).
    Keep it to 8-12 nodes. Ensure a logical hierarchy (source to target).
    JSON format only, no markdown.
    
    Structure:
    {
      "nodes": [{ "id": "1", "data": { "label": "...", "type": "...", "description": "..." }, "position": { "x": 0, "y": 0 } }],
      "edges": [{ "id": "e1-2", "source": "1", "target": "2" }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text || '';
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}

export async function expandNode(parentNodeLabel: string, parentNodeId: string, currentNodes: string[]) {
  const prompt = `
    Based on the technical node "${parentNodeLabel}", suggest 3 new related technical sub-skills or specialized areas.
    The current existing skills in this tree are: [${currentNodes.join(', ')}].
    Output a JSON object with "nodes" and "edges" to connect each new node to the parent node with ID "${parentNodeId}".
    Use unique IDs starting from "new-${Date.now()}".
    Align the positions relative to the parent (which is at some internal x,y - provide relative offsets if possible, or just x/y).
    JSON format only, no markdown.
    
    Structure:
    {
      "nodes": [{ "id": "...", "data": { "label": "...", "type": "advanced", "description": "..." }, "position": { "x": 100, "y": 100 } }],
      "edges": [{ "id": "...", "source": "${parentNodeId}", "target": "..." }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || '';
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Expansion Error:", error);
    throw error;
  }
}
