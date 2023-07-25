import type { ComponentType } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"
import { randomColor } from "https://framer.com/m/framer/utils.js@^0.9.0"
import Tilt from "react-parallax-tilt"
import { motion } from "framer-motion"

export function addTilt(Component): ComponentType {
    return (props) => {
        return (
            <Tilt className="parallax-effect" perspective={700} scale={1.04}>
                <Component {...props} />
            </Tilt>
        )
    }
}
