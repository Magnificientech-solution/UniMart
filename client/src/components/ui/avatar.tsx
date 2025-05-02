import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Custom UserAvatar component that displays user's initials as fallback
const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & {
    user?: { firstName?: string; lastName?: string; username?: string; avatarUrl?: string } | null;
    fallback?: string;
  }
>(({ user, fallback, ...props }, ref) => {
  // Generate initials from user data or use provided fallback
  const getInitials = () => {
    if (!user) return fallback || "?";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user.firstName) {
      return user.firstName[0];
    } else if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return fallback || "?";
  };

  return (
    <Avatar ref={ref} {...props}>
      {user?.avatarUrl ? (
        <AvatarImage src={user.avatarUrl} alt={user.username || "User"} />
      ) : null}
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
});
UserAvatar.displayName = "UserAvatar";

export { Avatar, AvatarImage, AvatarFallback, UserAvatar }
