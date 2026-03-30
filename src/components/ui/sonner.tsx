import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          error: "group-[.toast]:border-destructive",
        },
      }}
    />
  );
}

export { Toaster };
