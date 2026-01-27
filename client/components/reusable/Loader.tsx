"use client"
import React from "react";

const Loader = ({ message = "Loading..." }: {
    message?: string
}): React.ReactElement => {
    return (
        <div className="flex flex-col text-center justify-center items-center gap-4">
            <div className="dot-spinner">
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
                <div className="dot-spinner__dot"></div>
            </div>
            <p className="text-primary text-xs font-semibold ml-2">{message}</p>
        </div>
    );
};

export default Loader;