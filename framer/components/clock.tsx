import * as React from "react"
import { ControlType, addPropertyControls } from "framer"
import { useState, useEffect } from "react"
import {
    fontStack,
    fontSizeOptions,
    useFontControls,
} from "https://framer.com/m/framer/default-utils.js@^0.45.0"
import { allTimezones } from "react-timezone-select"
import Fonts from "./Fonts.tsx"

const baseInputStyles: React.CSSProperties = {
    fontFamily: fontStack,
}

export interface Props {
    style?: React.CSSProperties

    textColor?: string

    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    lineHeight?: number

    timezone?: string
    hideSeconds?: boolean
    use24HourFormat?: boolean
}

export const Clock: React.ComponentType<Props> = function Clock(props) {
    const [date, setDate] = useState(new Date())
    const {
        textColor,
        fontFamily,
        lineHeight,
        style,
        timezone,
        hideSeconds,
        use24HourFormat,
    } = props
    const fontStyles = useFontControls(props)

    function refreshClock() {
        const newDate = new Date()
        const options = { timezone: timezone }
        setDate(new Date(newDate.toLocaleString("en-US", options)))
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000)
        return function cleanup() {
            clearInterval(timerId)
        }
    }, [timezone])

    return (
        <div
            style={{
                ...baseInputStyles,

                color: textColor,
                lineHeight,

                ...style,

                flex: "auto",
                width: "",
                display: "block",

                ...fontStyles,
            }}
        >
            {date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: hideSeconds ? undefined : "numeric",
                hour12: !use24HourFormat,
            })}
        </div>
    )
}

Clock.defaultProps = {
    textColor: "#fff",
    fontFamily: Fonts[Fonts.indexOf("Space Mono")],
    fontSize: 39,
    fontWeight: 400,
    lineHeight: 1.0,
    timezone: Object.keys(allTimezones)[2],
    hideSeconds: false,
    use24HourFormat: false,
}

addPropertyControls(Clock, {
    textColor: { type: ControlType.Color, title: "Color" },
    fontFamily: {
        type: ControlType.Enum,
        title: "Font Family",
        options: Fonts,
        optionTitles: Fonts,
    },
    fontSize: {
        ...(fontSizeOptions as any),
    },
    fontWeight: {
        type: ControlType.Enum,
        title: "Font Weight",
        options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        optionTitles: [
            "Thin",
            "Extra Light",
            "Light",
            "Normal",
            "Medium",
            "Semi Bold",
            "Bold",
            "Extra Bold",
            "Black",
        ],
        hidden(props) {
            return props.toggleFont === false
        },
    },
    lineHeight: {
        type: ControlType.Number,
        min: 0,
        step: 0.1,
        max: 2,
        displayStepper: true,
    },
    timezone: {
        type: ControlType.Enum,
        title: "Timezone",
        options: Object.keys(allTimezones),
        optionTitles: Object.keys(allTimezones),
    },
    hideSeconds: {
        type: ControlType.Boolean,
        title: "Hide Seconds",
    },
    use24HourFormat: {
        type: ControlType.Boolean,
        title: "24-Hour Format",
    },
} as any)
