"use client"

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Container from "@/components/layout/Container";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useOrder } from "@/lib/context/order.context";
import { OrderCancelButton } from "@/components/order/OrderCancelButton";
import { useAuth } from "@/lib/context/auth.context";

export default function OrderPage() {
    const { id: orderId } = useParams();
    const { currentOrder, fetchOrder, isLoading, error, loggingOut } = useOrder();
    const { isAuthenticated, isLoading: isAuthenticating } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && !isAuthenticating) {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        console.log('outside')
        if (!orderId || loggingOut || !isAuthenticated) return;

        console.log('inside')
        fetchOrder(orderId as string).catch(() => toast.error("Failed to fetch order details"));
    }, [orderId, fetchOrder, isAuthenticated, loggingOut]);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "PLACED":
                return "success";
            case "CANCELLED":
                return "destructive";
            default:
                return "default";
        }
    };

    if (isLoading || isAuthenticating) {
        return (
            <Container>
                <div className="container py-8 flex justify-center items-center h-screen">
                    <LoadingSpinner size="medium" />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="container py-8 text-center">
                    <p className="text-destructive">{error}</p>
                </div>
            </Container>
        );
    }

    if (!currentOrder || !(currentOrder.status === "PLACED" || currentOrder.status === "CANCELLED")) {
        return (
            <Container>
                <div className="container py-8 text-center">
                    <p>No order found.</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Order #{currentOrder.id.slice(0, 8)}</span>
                            <Badge variant={getStatusBadgeVariant(currentOrder.status) as any}>{currentOrder.status}</Badge>
                        </CardTitle>
                        <CardDescription>{currentOrder.restaurant?.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <h3 className="font-medium">Order Items</h3>
                            <ul className="space-y-2">
                                {(currentOrder.orderItems ?? []).map((item) => (
                                    <li key={item.id} className="flex justify-between">
                                        <span>
                                            {item.quantity} x {item.menuItem.name}
                                        </span>
                                        <span className="font-medium">
                                            ${(Number(item.price_at_order) * item.quantity).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${Number(currentOrder.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end items-center">
                                <OrderCancelButton orderId={currentOrder.id} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
}
