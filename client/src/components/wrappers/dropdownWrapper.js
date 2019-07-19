import React from "react";
import EventListener from 'react-event-listener';

class DropdownWrapper extends React.Component {
    constructor(props){
        super(props);
        this.childrenRef = React.createRef();
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(e){
        if (!this.childrenRef) return; 
        if (
            !this.props.toggleButton || (this.props.toggleButton.current && !this.props.toggleButton.current.contains(e.target)) 
        ){
            if (!this.childrenRef.current.contains(e.target) && this.props.displayed){
                this.props.toggleDropdown();
            }
        }
    }
    render(){   
        return (
            <React.Fragment>
                <EventListener
                    target="window"
                    onMouseUp={this.handleClick}
                    onMouseDown={this.handleClick}
                />
                <div ref={this.childrenRef}>
                    {React.cloneElement(this.props.children,this.props)}
                </div>
            </React.Fragment>
        )
    }
}

export default DropdownWrapper;