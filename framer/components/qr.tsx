import { QRCodeCanvas } from "qrcode.react"
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

type QRCodeSVGProps = {
    value: string
    color: string
    size: number
    level: "L" | "M" | "Q" | "H"
    includeMargin: boolean
    marginSize: number
    imageSettings: {
        src: string
        x: number
        y: number
        height: number
        width: number
        excavate: boolean
    }
}

export default function QR(props) {
    const { color, value, size } = props
    return (
        <QRCodeCanvas
            id={"qrcanvas"}
            bgColor="transparent"
            fgColor={color}
            level={"M"}
            size={size}
            value={value}
        />
    )
}

addPropertyControls(QR, {
    color: {
        type: ControlType.Color,
        title: "Color",
        defaultValue: "#fff",
    },
    size: {
        type: ControlType.Number,
        title: "Size",
        defaultValue: 120,
        displayStepper: true,
        step: 20,
        min: 80,
        max: 400,
    },
    value: {
        type: ControlType.String,
        title: "URL",
        placeholder: "https://framer.com",
        defaultValue: "https://framer.com",
    },
})
