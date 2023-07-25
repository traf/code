import type { ComponentType } from "react"

export function grid4(Component): ComponentType {
    return (props) => {
        const gridStyle = {
            columnCount: "4",
            columnGap: "4px",
            display: "block",
        }
        return <Component style={gridStyle} {...props} />
    }
}

export function grid3(Component): ComponentType {
    return (props) => {
        const gridStyle = {
            columnCount: "3",
            columnGap: "4px",
            display: "block",
        }
        return <Component style={gridStyle} {...props} />
    }
}

export function grid2(Component): ComponentType {
    return (props) => {
        const gridStyle = {
            columnCount: "2",
            columnGap: "4px",
            display: "block",
        }
        return <Component style={gridStyle} {...props} />
    }
}
