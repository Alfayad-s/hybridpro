"use client";

import { cn } from "@/lib/utils";
import {
  useParticleDelete,
  type ParticleDeleteOptions,
} from "@/lib/particle-delete";
import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from "react";

export type ParticleDeleteContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  onDelete?: () => void;
  options?: ParticleDeleteOptions;
  children:
    | ReactNode
    | ((args: { isDeleting: boolean; handleDelete: () => void }) => ReactNode);
};

export const ParticleDeleteContainer = forwardRef<
  HTMLDivElement,
  ParticleDeleteContainerProps
>(function ParticleDeleteContainer(
  { onDelete, options, children, className, ...props },
  ref,
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const { isDeleting, triggerDelete } = useParticleDelete(options);

  const handleDelete = () => {
    const el =
      (ref && typeof ref !== "function" ? ref.current : null) || localRef.current;
    if (el) triggerDelete(el, onDelete);
    else onDelete?.();
  };

  return (
    <div
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn("relative data-[deleting=true]:invisible", className)}
      data-deleting={isDeleting || undefined}
      {...props}
    >
      {typeof children === "function"
        ? children({ isDeleting, handleDelete })
        : children}
    </div>
  );
});
