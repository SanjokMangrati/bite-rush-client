"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/lib/context/auth.context";
import Container from "@/components/layout/Container";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner size="medium" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Name:
                  </span>
                  <span className="ml-1">{user.name}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>
                  <span className="ml-1">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Role:
                  </span>
                  <span className="ml-1">
                    {user.userRoles.map((ur) => ur.role.name).join(", ")}
                  </span>
                </div>
                {user.userCountries && user.userCountries.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Country:
                    </span>
                    <span className="ml-1">
                      {user.userCountries
                        .map((uc) => uc.country.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
