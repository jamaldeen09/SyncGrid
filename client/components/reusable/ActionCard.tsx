import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";


interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    buttonText: string;
    funcToExecuteOnButtonClick: () => void;
}


export const ActionCard = ({
    title,
    description,
    icon,
    gradient,
    buttonText,
    funcToExecuteOnButtonClick,
}: ActionCardProps) => {
    return (
        <Card className="group relative overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
            <div className="p-6 space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${gradient}`}>
                    <div className="text-white">{icon}</div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                <Button onClick={() => {
                    funcToExecuteOnButtonClick();
                }} className={`w-full bg-linear-to-r ${gradient}`}>
                    {buttonText}
                </Button>
            </div>
        </Card>
    );
};
