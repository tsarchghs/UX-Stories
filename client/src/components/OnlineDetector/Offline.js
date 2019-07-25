import React, { useState, useEffect } from "react";


const Offline = props => {
    const [online, setOnline] = useState(true);
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)

    useEffect(() => {
        window.addEventListener("online", onOnline)
        window.addEventListener("offline", onOffline)
        return () => {
            window.removeEventListener("online", onOnline)
            window.removeEventListener("offline", onOffline)
        }
    })

    return !online && props.children
}

export default Offline;