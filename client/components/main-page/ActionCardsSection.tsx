import React from "react";
import { Badge } from "../ui/badge";
import { LightningIcon } from "@phosphor-icons/react";

const ActionCardsSection = (): React.ReactElement => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Quick Actions</h2>
                <Badge variant="outline" className="gap-2">
                    <LightningIcon weight="fill" className="h-3 w-3" />
                    <span>Live</span>
                </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {/* {actionCards.map((actionCard) => (<ActionCard key={actionCard.id} {...actionCard} />))} */}
            </div>
        </section>
    );
};

export default ActionCardsSection;