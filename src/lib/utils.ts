/**
 * Utility function for combining Tailwind CSS classes
 * shadcn/ui uses this for conditional styling
 *
 * Example:
 * cn("text-base", isActive && "font-bold", "text-red-500")
 * → "text-base font-bold text-red-500" (if isActive is true)
 *
 * clsx:
 * A library that takes any number of arguments (strings, arrays, objects)
 *  and combines them into a single string of class names.
 * 
 * twMerge:
 * A library that merges Tailwind CSS classes, removing duplicates
 *  and resolving conflicts.

 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
