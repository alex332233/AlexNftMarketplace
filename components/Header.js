import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">Alex's NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-4">Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-4 p-4">Sell NFT</a>
                </Link>
                <Link href="/PDF/NFTMarketplace_Eng.pdf">
                    <a className="mr-4 p-4">Docs</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
