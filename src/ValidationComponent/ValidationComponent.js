import React from 'react';

const ValidationComponent = (props) => {
    const str = props.character < 5 ? 'Text too short !!' : 'Text long enough';
    return (<p>{str}</p>);
}

export default ValidationComponent;