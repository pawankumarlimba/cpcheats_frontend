
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={currentPage === 1}
        className="rounded-full bg-gray-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-full bg-gray-300"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
