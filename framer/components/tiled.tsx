import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    image: string
}

export function Tiled(props: Props) {
    const style = {
        backgroundImage: `url(${props.image})`,
        backgroundPosition: "center top",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        height: "100%",
        width: "100%",
    }
    return <div style={style} />
}

addPropertyControls(Tiled, {
    image: {
        type: ControlType.Image,
        title: "Image",
    },
})
