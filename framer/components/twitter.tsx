import React, { useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

function TwitterCount({ username, number }) {
    const [followerCount, setFollowerCount] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`https://twittercounter.onrender.com/followercount/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .then((data) => setFollowerCount(data.count))
            .catch((error) => setError(error.message))
    }, [username])

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: number.size,
                fontFamily: number.fontFamily,
                color: number.color,
                fontWeight: number.fontWeight,
                height: 32,
            }}
        >
            {followerCount === null ? (
                <p>...</p>
            ) : (
                <p>{followerCount.toLocaleString()}</p>
            )}
        </div>
    )
}

addPropertyControls(TwitterCount, {
    username: {
        title: "Twitter ID",
        type: ControlType.String,
        defaultValue: "jorisrood",
    },
    number: {
        type: ControlType.Object,
        title: "Number",
        controls: {
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#fff",
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: 28,
                min: 12,
                max: 144,
                step: 1,
                displayStepper: true,
            },
            fontFamily: {
                type: ControlType.String,
                title: "Font Family",
                defaultValue: "Inter",
            },
            fontWeight: {
                type: ControlType.Number,
                title: "Font Weight",
                defaultValue: 600,
                min: 100,
                max: 900,
                step: 100,
                displayStepper: true,
            },
        },
    },
})
export default TwitterCount
