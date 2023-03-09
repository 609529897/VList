import { useMemo, useRef, useState } from "react";
import "./index.css";

interface VlistProps {
    list: any[];
    children: any;
}

const defaultItemSize = 100;
// 列表前后缓存条数
const buffered = 10;
// 渲染数量
const viewCount = 10;

type Position = {
    top: number;
    bottom: number;
    index: number;
    height: number;
};

//二分法查找
const binarySearch = (positions: Position[], value: number) => {
    let start = 0; //开始
    let end = positions.length - 1; //结束位置
    let temp = null; //记录当前的高度临时值
    //当开始位置小于结束的位置的时候，就一直往下找
    while (start <= end) {
        //找到中间的位置
        let middleIndex = parseInt(`${(start + end) / 2}`);
        //中间位置bottom位置
        let middleValue = positions[middleIndex].bottom;
        //如果当前的middleValue与value相等，则可进行
        if (middleValue === value) {
            return middleIndex + 1;
        } else if (middleValue < value) {
            //当前要查找的在右边
            start = middleIndex + 1;
        } else if (middleValue > value) {
            //当前要查找的在左边
            //  temp为存储的临时数据 如果不存在middleValue == value的时候 返回这个临时的数据
            if (temp == null || temp > middleIndex) {
                temp = middleIndex; //找到范围
            }
            end = middleIndex - 1;
        }
    }
    return temp;
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
    const endIndex = useMemo(
        () => Math.min(startIndex + viewCount + buffered, list.length),
        [startIndex, list.length]
    );

    // 获取startIndex 二分查找法
    const getStartIndex = (scrollTop: number) => {
        let item = binarySearch(positions, scrollTop);
        return Math.max(0, item! - buffered);
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
