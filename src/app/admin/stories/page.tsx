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
              <TableHead>Title</TableHead>
              <TableHead>Synopsis</TableHead>
              <TableHead>Characters</TableHead>
              <TableHead>Character Descriptions</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories?.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.title}</TableCell>
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
