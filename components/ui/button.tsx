import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-body text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-expo focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-creme disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "border-creme bg-creme text-ink hover:bg-transparent hover:text-creme",
        glass:
          "glass text-creme hover:bg-creme/10 hover:border-creme/20",
        outline:
          "border-creme/30 text-creme hover:bg-creme hover:text-ink",
        link: "rounded-none border-0 p-0 text-creme underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
