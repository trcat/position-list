import React from 'react';
import ReactDOM from 'react-dom';
import Position from './component/position';

const title = '最新职位';
const speed = 30;
let count = 0;
function getItemsSource(begin, end) {
    const result = [];

    for (let i = begin; i < begin + end; i++) {
        const contents = [`这是第 ${i + 1} 个岗位`, `这是第 ${i + 1} 个岗位的城市`, `不知道多久`];
        result.push({
            id: i.toString(),
            url: 'https://job.alibaba.com/zhaopin/positionList.html?',
            contents: contents
        })
    }

    count = begin + end;

    return result;
}

const items = getItemsSource(0, 40);

const getItems = function (askNum, showed) {
    const begin = count + 1;
    const result = getItemsSource(begin, askNum);

    return result;
}
function tool(props) {
    return <a href={'https://job.alibaba.com/zhaopin/positionList.html?'}>更多</a>;
}

ReactDOM.render(
    <Position title={title} tool={tool} speed={speed} items={items} getItems={getItems}/>,
    document.getElementById('root')
);
