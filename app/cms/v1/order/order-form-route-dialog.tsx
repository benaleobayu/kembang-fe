import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props{
    text: string
    title?: string,
    description?: string,
    children: React.ReactNode
    footer?: string
}

export function OrderFormRouteDialog({text, title, description, children, footer}: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button >{text}</button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    {title && (
                        <DialogTitle>{text}</DialogTitle>
                    )}
                    {description && (
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
                {footer && (
                    <DialogFooter>
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
