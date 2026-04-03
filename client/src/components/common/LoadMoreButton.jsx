import React from "react";

const LoadMoreButton = props => {
    return (
        <button
            style={props.style || { width: "20%", marginTop: -25 }}
            className="button full"
            onClick={props.onClick}>
            Load more
        </button>
    )
}

export default LoadMoreButton;