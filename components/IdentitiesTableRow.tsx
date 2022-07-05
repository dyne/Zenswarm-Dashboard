import React, {useState} from 'react';
import useSWR from "swr";
import PingChecker from "./PingChecker";
import SubscriptionsCell from "./SubscriptionsCell";
import IdentityBtn from "./IdentityBtn";
import {ClipboardCheckIcon, ClipboardCopyIcon} from "@heroicons/react/solid";
import axios from "axios";

const IdentityTableRow = ({node}: { node: string }) => {
    const {data} = useSWR(`${node}/api/zenswarm-oracle-get-identity`);
    const [isCopied, setIsCopied] = useState(false);
    const ecdh_public_key = `did:dyne:id:${data?.identity?.ecdh_public_key}`

    async function copyTextToClipboard(text: string) {
        return await navigator.clipboard.writeText(text);
    }

    const resolveDidData = {
        "data": {
            "id": ecdh_public_key
        },
        "keys": {}
    }

    function didPost(e: any) {
        e.preventDefault()
        axios.post('http://did.dyne.org:12000/api/W3C-DID-resolve-did', resolveDidData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => console.log(res.data))
            .catch((error) => console.log(error));
    }

    const handleCopyClick = () => {
        copyTextToClipboard(ecdh_public_key)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
    }
    const copyIcon = isCopied ? <ClipboardCheckIcon className="w-5 h-5"/> : <ClipboardCopyIcon className="w-5 h-5"/>
    return (data && <>
        <tr>
            <td><PingChecker uid={node}/></td>
            <td className="whitespace-normal w-60 break-words">
                <div className="tooltip w-full" data-tip={ecdh_public_key}>
                    <a className="mr-2 bold flex flex-col">
                        <span>{ecdh_public_key.slice(0, 30)}...</span>
                        <div className="grid grid-cols-5">
                            <button className={`btn btn-ghost text-xs col-span-2 ${isCopied && "text-success"}`}
                                    onClick={handleCopyClick}>
                                {copyIcon}
                            </button>
                            <button className="btn btn-primary btn-xs mt-3 col-span-3" onClick={didPost}>resolve</button>
                        </div>
                    </a>
                </div>
            </td>
            <td>
                <div className="flex flex-col">
                    <p className="font-bold">{data.identity.Country}</p>
                    <p className="text-xs text-gray-400">{data.identity.State}</p>
                </div>
            </td>
            <td>{data.identity.description}</td>
            <td>
                <SubscriptionsCell data={data}/>
            </td>
            <td className="flex flex-col space-y-3 py-6">
                <IdentityBtn uid={node}/>
                <a href={`${node}/docs`} rel="noreferrer" target="_blank"
                   className="btn btn-xs btn-success">openapi</a>
            </td>
        </tr>
    </>)
}


export default IdentityTableRow;