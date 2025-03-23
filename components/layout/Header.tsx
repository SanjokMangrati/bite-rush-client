"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth.context";
import { useOrder } from "@/lib/context/order.context";
import Container from "./Container";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { currentOrder } = useOrder();

  const cartItemCount =
    currentOrder?.orderItems?.reduce(
      (total, item) => total + item.quantity,
      0,
    ) || 0;

  return (
    <Container>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl">
              BiteRush
            </Link>
          </div>

          {isAuthenticated ? (
            <nav className="flex items-center gap-6">
              <Link
                href="/restaurants"
                className={`text-sm font-medium ${pathname.startsWith("/restaurants") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Restaurants
              </Link>
              <Link
                href="/payment-methods"
                className={`text-sm font-medium ${pathname.startsWith("/payment-methods") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Payment Methods
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link href="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </Container>
  );
}
