import type { ComponentType } from "react"

export function snapWrapper(Component): ComponentType {
    return (props) => {
        return (
            <Component
                {...props}
                style={{
                    scrollSnapType: "y mandatory",
                }}
            />
        )
    }
}
