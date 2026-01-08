import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface Filters {
    played_as?: "X" | "O";
    disabled_comments?: boolean;
    visibility?: "private" | "public"
    time_setting_ms?: number
    limit?: number;
}

export interface SelectSchema {
    // The field name this select controls
    field: keyof Filters | "clear_all";

    // Select trigger
    triggerClassNames?: string;
    valuePlaceholder: string;

    // Select items
    items: {
        id: number;
        value: string;
        label: string;
        className?: string;
    }[]
}

interface FilterProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    select: SelectSchema;
}

export const getSelects = (): SelectSchema[] => {
    return (
        [
            // ===== Played as select ===== \\
            {
                field: "played_as",
                triggerClassNames: "w-full lg:w-36",
                valuePlaceholder: "Played As",
                items: [
                    { id: 1, value: "all", label: "All" },
                    { id: 2, value: "X", label: "Played as X" },
                    { id: 3, value: "O", label: "Played as O" },
                ]
            },

            // ===== Comments select ===== \\
            {
                field: "disabled_comments",
                triggerClassNames: "w-full lg:w-44",
                valuePlaceholder: "Comments",
                items: [
                    { id: 1, value: "all", label: "All Comments" },
                    { id: 2, value: "false", label: "Comments Enabled" },
                    { id: 3, value: "true", label: "Comments Disabled" },
                ]
            },

            // ===== Visibility select ===== \\
            {
                field: "visibility",
                triggerClassNames: "w-full lg:w-30",
                valuePlaceholder: "Visibility",
                items: [
                    { id: 1, value: "all", label: "All Games" },
                    { id: 2, value: "public", label: "Public" },
                    { id: 3, value: "private", label: "Private" },
                ]
            },

            // ===== Time setting select ===== \\
            {
                field: "time_setting_ms",
                triggerClassNames: "w-full lg:w-36",
                valuePlaceholder: "Time Setting",
                items: [
                    { id: 1, value: "all", label: "Any Time" },
                    { id: 2, value: "30000", label: "30 seconds" },
                    { id: 3, value: "60000", label: "1 minute" },
                    { id: 4, value: "120000", label: "2 minutes" },
                    { id: 5, value: "180000", label: "3 minutes" }
                ]
            },
        ]
    )
}

const Filter = (props: FilterProps): React.ReactElement => {
    const getCurrentValue = (): string => {
        const field = props.select.field;

        // Handle "clear_all" field (if you have a clear all option)
        if (field === "clear_all") return "";

        const value = props.filters[field];

        if (value === undefined || value === null) return "all";

        if (field === "disabled_comments") {
            return value ? "true" : "false";
        }

        if (field === "time_setting_ms") {
            return value.toString();
        }

        return value.toString();
    };

    const handleValueChange = (selectedValue: string) => {
        const field = props.select.field;
        // Don't process if it's the clear_all field
        if (field === "clear_all") return;

        const newFilters = { ...props.filters };

        // Handle "all" value (clear this filter)
        if (selectedValue === "all") delete newFilters[field];
        else if (field === "disabled_comments") newFilters.disabled_comments = selectedValue === "true";
        else if (field === "time_setting_ms") newFilters.time_setting_ms = parseInt(selectedValue);
        else if (field === "played_as") newFilters.played_as = selectedValue as "X" | "O";
        else if (field === "visibility") newFilters.visibility = selectedValue as "private" | "public";

        props.setFilters(newFilters);
        localStorage.setItem("filters", JSON.stringify(newFilters));
    };

    return (
        <Select
            value={getCurrentValue()}
            onValueChange={handleValueChange}
        >
            <SelectTrigger className={props.select.triggerClassNames}>
                <SelectValue placeholder={props.select.valuePlaceholder} />
            </SelectTrigger>
            <SelectContent
                position="popper"
                sideOffset={5}
                align="start"
                className="w-(--radix-select-trigger-width)"
            >
                {props.select.items.map((item) => (
                    <SelectItem
                        key={item.id}
                        value={item.value}
                        className={item.className}
                    >
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default Filter;