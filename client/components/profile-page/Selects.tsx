import React, { useEffect, useState } from "react";
import { selects } from "@/lib/utils";
import { GetGamesData } from "@shared/index";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Component props
interface SelectsProps {
    filters: GetGamesData;
    disabled: boolean;
    setAccumulatedFilters: React.Dispatch<React.SetStateAction<GetGamesData>>;
};

const Selects = ({
    setAccumulatedFilters,
    disabled,
    filters
}: SelectsProps): React.ReactElement => {
    // States
    const [innerKey, setInnerKey] = useState(0);

    // Watch for global filter reset
    useEffect(() => {
        // If filters only contain page/limit, they have been cleared
        const isReset = Object.keys(filters).length <= 2 && filters.page === 1;
        if (isReset) setInnerKey(prev => prev + 1);
    }, [filters]);

    // OnValueChange
    const onValueChange = (val: string, field: keyof GetGamesData) => {
        setAccumulatedFilters((prev) => ({
            ...prev,
            [field]: val
        }));
    };
    return (
        <div className="flex flex-col gap-4" key={innerKey}>
            {selects.map((select) => (
                <Select 
                    disabled={disabled}
                    onValueChange={(val) => onValueChange(val, select.field)} 
                    key={select.id}
                >
                    <SelectTrigger className="w-full text-[10px]">
                        <SelectValue placeholder={select.placeholder} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectGroup>
                            {select.items.map((item) => (
                                <SelectItem key={item.id} value={item.value} className="text-[10px]!">
                                    {item.content}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            ))}
        </div>
    );
};

export default Selects;