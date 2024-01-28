import { prisma } from '@/lib/server/prismaClientInstance';

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const story = await prisma.story.create({
      data,
    });

    return Response.json({ storyId: story.id }, { status: 201 });
  } catch (error: any) {
    throw new Error(`story create error:  `, error.toString());
  }
}
