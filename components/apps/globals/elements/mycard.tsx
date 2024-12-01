import * as React from "react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"

type Props = {
    children: React.ReactNode
    footer?: React.ReactNode
    title?: string
    titleDesc?: string
    className?: string
}

export function __MyCard({children, footer, title, titleDesc, className}: Props) {
    return (
        <Card className={`${className} w-full`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{titleDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {footer && (
                <CardFooter className="flex justify-between">
                    {footer}
                </CardFooter>
            )}
        </Card>
    )
}
