// save image as a state variable on this component
// modify Image display mechnism
import React from "react"
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
// import nftAbi from "../constants/BasicNft.json"
import basicNftAbi from "../constants/BasicNft.json"
import randomNftAbi from "../constants/RandomIpfsNft.json"
// import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    let separatorLength = separator.length
    const charsToShow = strLen - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    // Modal default to NOT be show
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    // Add randomNft to marketplace
    const basicNftAddress1 = "0x8a09ad0e27bf18d7170099cb37d5dfeae1281633"
    const basicNftAddress2 = "0xcf1dfded219abb3635b646bdd2eb5e739c1544d6"
    const basicNftAddress3 = "0xcfd788128e855ffcb375faa6b9e3aaf778f92726"
    const randomNftAddress1 = "0x8f2ea6bfaaf1627b6bdd915571dc7efd993a1edb"
    const randomNftAddress2 = "0xf5ff5352a214f03771a58067663f753066396ee3"
    let nftAbi, nftName

    if (nftAddress == basicNftAddress1) {
        console.log(`nft is basicNFT`)
        nftAbi = basicNftAbi
    } else if (nftAddress == basicNftAddress2) {
        console.log(`nft is basicNFT`)
        nftAbi = basicNftAbi
    } else if (nftAddress == basicNftAddress3) {
        console.log(`nft is basicNFT`)
        nftAbi = basicNftAbi
    } else if (nftAddress == randomNftAddress1) {
        console.log(`nft is randomNft`)
        nftAbi = randomNftAbi
    } else if (nftAddress == randomNftAddress2) {
        console.log(`nft is randomNft`)
        nftAbi = randomNftAbi
    }
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    //add getDogTokenUri
    const { runContractFunction: getDogTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "getDogTokenUris",
        params: {
            index: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        // add if else for tokenURI or DogTokenURI
        let tokenURI
        if (nftAddress == randomNftAddress1) {
            console.log(`now is randomNFT, address is:${nftAddress}`)
            tokenURI = await getDogTokenURI()
        } else if (nftAddress == randomNftAddress2) {
            console.log(`now is randomNFT, address is:${nftAddress}`)
            tokenURI = await getDogTokenURI()
        } else {
            tokenURI = await getTokenURI()
        }
        console.log(`tokenURI is here:${tokenURI}`)
        //get the tokenURI with web3Contract
        if (tokenURI) {
            // IPFS Gateway
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            // console.log(`requestURL is: ${requestURL}`)
            const tokenURIResponse = await (await fetch(requestURL)).json()
            // console.log(`tokenURIResponse is: ${tokenURIResponse}`)
            const imageURI = tokenURIResponse.image
            // console.log(`imageURI is: ${imageURI}`)
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            console.log(`imageURIURL is: ${imageURIURL}`)
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            console.log(`token name is: ${tokenURIResponse.name}`)
            console.log(`token description is: ${tokenURIResponse.description}`)
        }
    }

    // to make sure the updateUI is called
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    const formattedNftAddress = truncateStr(nftAddress, 11)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  // don't use onSuccess: () => handleBuyItemSuccess, it won't give you tx
                  onSuccess: handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        // wait for bought success
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div>
                {" "}
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            onClose={hideModal}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-1">
                                <div className="flex flex-col items-center gap-1">
                                    <div>NFT Addr:{formattedNftAddress}</div>
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    {/* <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    /> */}
                                    <div className="flex justify-center">
                                        <img
                                            src={imageURI}
                                            alt="NFT"
                                            style={{ height: "100px", width: "auto" }}
                                        />
                                    </div>
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
