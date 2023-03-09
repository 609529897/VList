import { useMemo, useRef, useState } from "react";
import "./index.css";

interface VlistProps {
    list: any[];
    children: any;
}

const defaultItemSize = 100;
const N = 10;

type Position = {
    top: number;
    bottom: number;
    index: number;
    height: number;
};

const Vlist = ({ list, children }: VlistProps) => {
    const viewport = useRef<HTMLDivElement>(null);
    const listArea = useRef<HTMLDivElement>(null); // 渲染区域

    const [positions, setPosition] = useState<Position[]>(
        list.map((_, index) => {
            return {
                top: index * defaultItemSize,
                bottom: (1 + index) * defaultItemSize,
                index,
                height: defaultItemSize,
            };
        })
    );

    const [startIndex, setStartIndex] = useState(0);
    const [startOffset, setStartOffset] = useState(0);
    const endIndex = useMemo(() => startIndex + N, [startIndex]);

    const getStartIndex = (scrollTop: number) => {
        let item = positions.find((i) => i && i.bottom > scrollTop);
        return item!.index;
    };

    const getStartOffset = (startIndex: number) => {
        return startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
    };

    const onScroll = () => {
        const scrollTop = viewport.current?.scrollTop; // 滚动距离
        const startIndex = getStartIndex(scrollTop!);
        setStartIndex(startIndex);

        const startOffset = getStartOffset(startIndex);
        setStartOffset(startOffset);
    };

    const phantomHeight = useMemo(() => {
        return positions.reduce((total, item) => total + item.height, 0);
    }, [positions]);

    const measure = (index: number, height: number) => {
        if (height === undefined) {
            if (!listArea.current) return;
            height =
                listArea.current.querySelector(`[data-index="${index}"]`)
                    ?.clientHeight || defaultItemSize;
        } else {
            positions.forEach((item) => {
                if (item.index === index) {
                    let oldHeight = item.height;
                    let dHeight = oldHeight - height;

                    // 向下更新
                    if (dHeight) {
                        item.height = height;
                        item.bottom = item.bottom - dHeight;

                        for (let k = index + 1; k < positions.length; k++) {
                            positions[k].top = positions[k - 1].bottom;
                            positions[k].bottom = positions[k].bottom - dHeight;
                        }
                    }
                }
            });
            setPosition(positions);
        }
    };

    return (
        <div className="viewport" onScroll={onScroll} ref={viewport}>
            <div
                className="list-phantom"
                style={{ height: phantomHeight }}
            ></div>
            <div
                className="list-area"
                ref={listArea}
                style={{ transform: `translate3d(0,${startOffset}px,0)` }}
            >
                {list.map((item, index) => {
                    if (index >= startIndex && index <= endIndex) {
                        return children({
                            index,
                            measure,
                            item,
                        });
                    }
                })}
            </div>
        </div>
    );
};

export default Vlist;
