import React, { useRef, useState, useEffect } from 'react';
import '../css/position.css'

const newPositionStyle = {
    height: '364px',
    width: '100%',
    overflow: 'hidden'
};
const newPositionContentStyle = {
    width: '1180px',
    height: '300px',
    margin: '32px auto'
}
const newPositionListStyle= {
    width: '850px',
    height: '300px'
}
let defaultTop = 0;
let timer = null;
let runSrcoll = null;

/**
 * position component
 * @param {title:string, moreUrl:string, items:Array<{id:string, url:string, contents:Array}>, getItems:Function} props 
 */
function Position(props) {
    // Ref
    const positionListRef = useRef(null);

    // State

    const [items, setItems] = useState(props.items || []);

    // Handler Function

    function clearTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function mouseEnterList() {
        if (positionListRef) {
            clearTimer();
        }
    }

    function mouseLeaveList() {
        if (positionListRef && timer === null) {
            typeof runSrcoll === 'function' && runSrcoll();
        }
    }

    // Effect

    useEffect(() => {
        const list = positionListRef.current;
        const listRect = list.getBoundingClientRect();
        const listHeight = listRect.bottom - listRect.top;
        defaultTop = list.offsetTop;
        let top = defaultTop;
        list.style.top = `${top}px`;
        const limit = top - (listHeight / 2);

        runSrcoll = () => {
            timer = setInterval(() => {
                if (top !== limit && items.length > 0) {
                    top -= 1;
                    list.style.top = `${top}px`;
                } else {
                    //更新 items
                    new Promise((res, rej) => {
                        if (typeof props.getItems === 'function') {
                            res(props.getItems(items.length / 2, items.slice(0, items.length / 2)))
                        } else {
                            res([]);
                        }
                    }).then((newItems) => {
                        if (newItems instanceof Array && newItems.length > 0) {
                            setItems((items) => {
                                let result = items.slice(items.length / 2);
                                result = result.concat(newItems);
                                return result;
                            })
                        } else {
                            // 如果没有新的内容，就把旧的内容重新轮播一遍
                            setItems((items) => {
                                let result = items.slice(items.length / 2);
                                result = result.concat(items.slice(0, items.length / 2));
                                return result;
                            })
                        }
                    })
                }
            }, props.speed || 10);
        };

        runSrcoll();

        return () => {
            list.style.top = `${defaultTop}px`;

            if (timer) {
                clearTimer();
            }
        }
    })

    return (
        <div className="newPosition" style={newPositionStyle}>
            <div className="newPosition-content" style={newPositionContentStyle}>
                <div className="newPosition-list" style={newPositionListStyle}>
                    <div className="more-positon">
                        {props.title}
                        {props.tool && <props.tool/>}
                    </div>
                    <ul className="position-list" 
                        onMouseEnter={mouseEnterList}
                        onMouseLeave={mouseLeaveList}
                        ref={positionListRef}>
                        {items.map((item, index) => (
                            <li key={`${item.id}`}>
                                <a className="title" href={item.url} title={item.contents[0]}> 
                                    {item.contents[0]}
                                </a>
                                <em className="gray">{item.contents[2]}</em>
                                <em className="text">{item.contents[1]}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Position;