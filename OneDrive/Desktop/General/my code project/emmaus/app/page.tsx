import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";
export default function Home() {
  return (
    <div className="gap-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl p-10">Emmaus Diary</h1>
      <Button>Emmaus</Button>
      <ModeToggle/>
    </div>
  );
}
