// import "./styles.css";
import VList from "./components/Vlist-2";
// import Item from "./components/Item";
import faker from "faker";
import Item from "./components/Vlist-2/Item";

const data: any[] = [];
for (let id = 0; id < 100; id++) {
    const item = {
        id,
        value: faker.lorem.paragraphs(), // 长文本
        src: "",
    };

    if (id % 10 === 1) {
        item.src = faker.image.image();
    }
    data.push(item);
}

export default function App() {
    // 开启图片
    const enableImag = true;

    return (
        <div className="App">
            <VList list={data}>
                {({ index, item, measure }: any) => (
                    <Item index={index} key={item.id} measure={measure}>
                        <>
                            {item.value}
                            {enableImag && item.src && (
                                <img
                                    src={item.src}
                                    onLoad={() => measure(index)}
                                    alt=""
                                />
                            )}
                        </>
                    </Item>
                )}
            </VList>
        </div>
    );
}
