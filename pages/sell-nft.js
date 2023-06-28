import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import { useState, useEffect } from "react"

export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    console.log(`chainId is: ${chainId}`)
    const chainString = parseInt(chainId).toString()
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null

    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
        console.log("Time to list...")
        await tx.wait()
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: (tx) => handleListSuccess(tx),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT Listing on page!",
            title: "NFT Listed",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    async function handleWithdrawSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Withdraw proceeds success!",
            title: "Withdraw proceeds",
            position: "topR",
        })
    }

    return (
        <div className="container mx-auto">
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price in ETH",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFTs!"
                id="Main Form"
            />
            <h1 className="py-2 px-4 font-bold text-2xl">Proceeds</h1>
            {proceeds != "0" ? (
                <div className="px-4">
                    <div className="px-6 py-2">
                        withdraw {ethers.utils.formatUnits(proceeds)} ETH
                    </div>
                    <Button
                        onClick={() => {
                            runContractFunction({
                                params: {
                                    abi: nftMarketplaceAbi,
                                    contractAddress: marketplaceAddress,
                                    functionName: "withdrawProceeds",
                                    params: {},
                                },
                                onError: (error) => console.log(error),
                                onSuccess: (tx) => handleWithdrawSuccess(tx),
                            })
                        }}
                        text="Withdraw"
                        type="button"
                    />
                </div>
            ) : (
                <div className="px-4">No proceeds to withdraw</div>
            )}
        </div>
    )
}
