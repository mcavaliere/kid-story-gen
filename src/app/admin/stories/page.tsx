import { getStories } from '@/app/actions';
import { Heading } from '@/components/Heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dayjs from 'dayjs';
import Link from 'next/link';

export default async function StoriesListPage() {
  const stories = await getStories();

  return (
    <div className="flex flex-col items-center">
      <Heading size="h1" className="mb-8">
        Stories
      </Heading>

      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold">Synopsis</TableHead>
              <TableHead className="font-bold">Characters</TableHead>
              <TableHead className="font-bold">
                Character Descriptions
              </TableHead>
              <TableHead className="font-bold">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories?.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <Link href={`stories/${story.id}`} className="underline">
                    {story.title}
                  </Link>
                </TableCell>
                <TableCell>{story.synopsis}</TableCell>
                <TableCell>{story.characters}</TableCell>
                <TableCell>{story.characterDescriptions}</TableCell>
                <TableCell>
                  {dayjs(story.createdAt).format('MM/DD/YYYY')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
