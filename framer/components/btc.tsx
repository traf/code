import { useState, useEffect } from "react"

export function BitcoinPrice({ className }) {
    const [price, setPrice] = useState(null)

    useEffect(() => {
        fetchPrice()
        const interval = setInterval(fetchPrice, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchPrice = () => {
        fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
            .then((response) => response.json())
            .then((data) => setPrice(data.bpi.USD.rate_float))
            .catch((error) => console.error(error))
    }

    return (
        <div
            className={className}
            style={{
                font: "Albert Sans",
                fontWeight: "bold",
                color: "White",
                fontSize: "56px",
            }}
        >
            ${price?.toFixed(0)}
        </div>
    )
}
