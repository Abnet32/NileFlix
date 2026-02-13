import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function BreadcrumbUi({
  Links,
  page,
}: {
  Links?: string[];
  page?: string;
}) {
  return (
    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {Links?.map((link, index) => (
            <div key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard" className="text-base">
                  {link}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== Links.length - 1 && (
                <BreadcrumbSeparator
                  className="hidden md:block"
                  key={index + 1000}
                />
              )}
            </div>
          ))}
          <BreadcrumbItem>
            {Links && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbPage className="text-base">{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
