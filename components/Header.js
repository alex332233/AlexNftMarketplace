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
                {/* <Link href="https://drive.google.com/file/d/1R05Sw1YxGB4YqAd-yJq07vum6JP90Znx/view?usp=sharing">
                    <a className="mr-4 p-4">Docs</a>
                </Link> */}
                <a
                    href="https://drive.google.com/file/d/1R05Sw1YxGB4YqAd-yJq07vum6JP90Znx/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferer"
                    className="mr-4 p-4"
                >
                    Docs
                </a>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
