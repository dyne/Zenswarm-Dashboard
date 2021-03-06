import Link from "next/link";

const IdentityBtn = ({ uid }: { uid: string }) => {
    const url: string = `/identities/${encodeURIComponent(uid)}`

    return <Link href={url} passHref><a rel="noreferrer" target="_blank" className="btn btn-primary btn-xs">Details</a></Link>
}

export default IdentityBtn;
