"use client"

// just to make sure these are installed (?)
import "@rainbow-me/rainbowkit"
import "wagmi"
import "viem"

// actual imports
import type { ComponentType, children } from "react"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { mainnet, arbitrum, optimism, polygon, zora, base } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import ENV from "https://raw.githubusercontent.com/traf/traf.github.io/master/web3/env.ts"

export const { chains, publicClient } = configureChains(
    [mainnet, arbitrum, optimism, polygon, zora, base],
    [alchemyProvider({ apiKey: ENV.alchemyApiKey }), publicProvider()]
)

export const { connectors } = getDefaultWallets({
    appName: "Connect",
    projectId: ENV.walletConnectProjectId,
    chains,
})

export const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
})

export function VVeb3Config({ children, ...props }) {
    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider
                chains={chains}
                theme={props?.theme}
                modalSize={props?.modalSize}
                coolMode={props?.coolMode}
            >
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
