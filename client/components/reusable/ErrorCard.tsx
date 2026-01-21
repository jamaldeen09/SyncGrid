import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";

const ErrorCard = ({ messageDescription, messageHeader }: {
    messageHeader: string;
    messageDescription: string;
}) => {
    return (
        <Card className="w-full max-w-xl px-4 bg-muted/5">
            <CardHeader className="text-xl p-0">{messageHeader}</CardHeader>
            <CardDescription className="text-xs">{messageDescription}</CardDescription>

            <CardContent className="p-0">
                <Link href="/">
                    <Button className="text-xs">
                        <ArrowLeftIcon />
                        Go back
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}

export default ErrorCard