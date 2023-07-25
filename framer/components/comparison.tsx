import { addPropertyControls, ControlType } from "framer"
import {
    propertyControls,
    BeforeAfter as Component,
} from "https://boosters.flowbase.co/before-after-framer.js#Pi7ExYI4gXmQ"

addPropertyControls(BeforeAfter, propertyControls)

export default function BeforeAfter(props) {
    return <Component {...props} />
}