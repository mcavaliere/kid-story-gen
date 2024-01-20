"use server"

import { generation } from "@/lib/server/stabilityai";

export async function createImage(storyTitle: string) {
  return await generation(storyTitle);
}