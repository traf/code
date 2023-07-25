import type { ComponentType } from "react"

export function hero(Component): ComponentType {
    return (props) => {
        const heroStyle = {
            background: "#000",
        }
        return <Component style={heroStyle} {...props} />
    }
}
