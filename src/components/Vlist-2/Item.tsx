import React, { useEffect, useRef } from "react";
import "./index.css";

interface ItemProps {
    index: number;
    measure: (index: number, height: number) => void;
    children: React.ReactNode;
}

export default function Item(props: ItemProps) {
    const { index, measure } = props;
    const element = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = element.current;
        if (item?.clientHeight) {
            measure(index, item.clientHeight);
        }
    }, []);

    return (
        <div data-index={index} className="list-item" ref={element}>
            {props.children}
        </div>
    );
}
