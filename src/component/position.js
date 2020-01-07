import React, { createRef, useState, useEffect } from 'react';
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
 * @param {title:string, moreUrl:string, items:Array<{id:string, position:string, url:string, city:string, time:number}>, getItems:Function} props 
 */
function Position(props) {
    // Ref
    const positionListRef = createRef();

    // State

    const [items, setItems] = useState(props.items || []);

    // Handler Function

    function mouseEnterList() {
        clearInterval(timer);
        timer = null;
    }

    function mouseLeaveList() {
        typeof runSrcoll === 'function' && runSrcoll();
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
                    clearInterval(timer);
                    timer = null;

                    //更新 items
                    if (typeof props.getItems === 'function') {
                        new Promise((res, rej) => {
                            res(props.getItems(items.length / 2, items.slice(0, items.length / 2)))
                        }).then((newItems) => {
                            if (newItems instanceof Array) {
                                setItems((items) => {
                                    let result = items.slice(items.length / 2);
                                    result = result.concat(newItems);
                                    return result;
                                })
                            }
                        })
                    }
                }
            }, props.speed || 10);
        };

        runSrcoll();

        return () => {
            list.style.top = `${defaultTop}px`;
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
                                <a className="position" href={item.url} title={item.position}> 
                                    {item.position}
                                </a>
                                <em className="time">{item.time}</em>
                                <em className="city">{item.city}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Position;