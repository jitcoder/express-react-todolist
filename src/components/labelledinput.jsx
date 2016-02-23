import React from 'react';
import ReactDOM from 'react-dom';
import 'labelledinput.scss';

export default class LabelledInput extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return <div className="labelledinput">
                <label>{this.props.label}</label>
                <input {...this.props} />
            </div>;
    }
    
}
