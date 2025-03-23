"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PermissionEnum } from "@/lib/types/user.types"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog"
import { usePermission } from "@/lib/hooks/usePermission.hook"
import { useOrder } from "@/lib/context/order.context"

interface OrderCancelButtonProps {
    orderId: string
}

export function OrderCancelButton({ orderId }: OrderCancelButtonProps) {
    const { hasPermission } = usePermission()
    const { cancel, currentOrder, isOrderBeingCancelled } = useOrder()

    const canCancelOrder = hasPermission(PermissionEnum.CANCEL_ORDER)

    if (!canCancelOrder || currentOrder?.status === 'CANCELLED') {
        return null
    }

    const handleCancelOrder = async () => {
        try {
            await cancel(orderId)
            toast.success('Order canceled')
        } catch (error) {
            toast.error('Failed to cancel order')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isOrderBeingCancelled} className="w-full md:w-auto">
                    {isOrderBeingCancelled ? "Cancelling..." : "Cancel Order"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No, keep order</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelOrder}>Yes, cancel order</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

