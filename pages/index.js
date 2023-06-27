import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import NFTBox from "../components/NFTBox"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = parseInt(chainId).toString()
    console.log(`chain string is: ${chainString}`)
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null
    console.log(`marketplaceAddress is: ${marketplaceAddress}`)

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            console.log(nft)
                            // information to be shown on the webpage
                            const { price, nftAddress, tokenId, seller } = nft
                            console.log(`price is: ${price}`)
                            console.log(`nftAddress is: ${nftAddress}`)
                            console.log(`tokenId is: ${tokenId}`)
                            console.log(`marketplaceAddress is: ${marketplaceAddress}`)
                            console.log(`seller is: ${seller}`)
                            return (
                                <div>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled (Wallet not connected)</div>
                )}
            </div>
        </div>
    )
}
