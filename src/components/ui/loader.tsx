import { cn } from '@/lib/utils'

export type LoaderProps = {
  className?: string
}

export function Loader({className=""}) {
  return <div className={cn("loader", className)} />
}