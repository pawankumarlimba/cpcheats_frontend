import { Button } from '@/components/ui/button';

interface PaginationProps {
  prevname: string | null;
  nextname: string | null;
  onNext: () => void;
  onPrev: () => void;
}

export default function Pagination({
  prevname,
  nextname,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center mt-5 mb-5 gap-4 md:gap-x-28">
      <Button
        variant="outline"
        
        onClick={onPrev}
        disabled={prevname === null}
        className="rounded-md bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] hover:from-[#6B7ADBCC] hover:to-[#0F2377] text-white shadow-xl hover:text-white px-4 py-2 mr-auto transition-all duration-300  disabled:opacity-50"
      >
        {prevname ? prevname : "Previous"}
      </Button>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={nextname === null}
        className="rounded-md bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] hover:from-[#6B7ADBCC] hover:to-[#0F2377] text-white hover:text-white shadow-xl px-4 py-2 ml-auto "
      >
        {nextname ? nextname : "Next"}
      </Button>
    </div>
  );
}
