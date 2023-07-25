import type { ComponentType } from "react"

export function snapSection(Component): ComponentType {
    return (props) => {
        return (
            <Component
                {...props}
                style={{
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                }}
            />
        )
    }
}
