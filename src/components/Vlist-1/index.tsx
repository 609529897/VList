import { useMemo, useRef, useState } from "react";
import "./index.css";

interface VlistProps {
    list: any[];
}

const itemSize = 100;
const N = 10;

const Vlist = ({ list }: VlistProps) => {
    const viewport = useRef<HTMLDivElement>(null);

    const [startIndex, setStartIndex] = useState(0);
    const [startOffset, setStartOffset] = useState(0);
    const endIndex = useMemo(() => startIndex + N, [startIndex]);

    const getStartIndex = (scrollTop: number) => {
        // 滚动距离 / 每个元素的高度
        return Math.floor(scrollTop / itemSize);
    };

    const getStartOffset = (startIndex: number) => {
        // 第一个显示的元素 * 每个元素的高度
        return startIndex * itemSize;
    };

    const onScroll = () => {
        const scrollTop = viewport.current?.scrollTop; // 滚动距离
        const startIndex = getStartIndex(scrollTop!);
        console.log(startIndex, 'startIndex')
        setStartIndex(startIndex);
        const startOffset = getStartOffset(startIndex);
        console.log(startOffset, 'startOffset')
        setStartOffset(startOffset);
    };

    return (
        <div className="viewport" onScroll={onScroll} ref={viewport}>
            <div
                className="list-phantom"
                style={{ height: list.length * itemSize }}
            ></div>
            <div
                className="list-area"
                style={{ transform: `translate3d(0,${startOffset}px,0)` }}
            >
                {list.map((item, index) => {
                    if (index >= startIndex && index <= endIndex) {
                        return (
                            <div key={index} className="list-item">
                                {item.value}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Vlist;
