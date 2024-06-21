import 'dotenv/config';
import pkg from 'cosmwasm';
const { SigningCosmWasmClient, Secp256k1HdWallet } = pkg;

import * as fs from "fs";
import { Decimal } from "@cosmjs/math";

// This is your rpc endpoint
const rpcEndpoint = "https://testnet-rpc.orai.io";

const mnemonic = process.env.MNEMONIC;



async function main() {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "orai" })
    const client = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        wallet,
        {
            gasPrice: {
                denom: "orai",
                //minimum fee per gas
                amount: Decimal.fromUserInput("0.001", 6)
            }
        }
    );
    
    
    
    const account = await wallet.getAccounts()
    console.log(account)
    const address = account[0].address
    console.log(address)
    // get orai balance

    // địa chỉ ví contract sau khi đã deploy
    const contract_address = process.env.CONTRACT_ADDRESS

    const fee = "auto"
    //=====================================DEPLOY========================================

    // //wasm -> wasmCode
    // const path = "./artifacts/cw_starter.wasm"
    // const wasmCode = new Uint8Array(fs.readFileSync(path))

    // //upload code on chain
    // const upload = await client.upload(address, wasmCode, fee)
    // console.log(upload)

    // //instantiate msg
    // const instantiate_msg = {
    //     owner: address
    // }
    // const res = await client.instantiate(address, upload.codeId, instantiate_msg, "cw_stater", fee)
    // console.log(res)

    //===================================================================================


    //=====================================EXECUTE=======================================

    // const execute_example = await client.execute(
    //     address, contract_address, { 
    //         vote: {
    //             poll_id: 'poll1',
    //             vote: "Red",
    //         }}, fee)
    // console.log(execute_example)

    //===================================================================================

    //======================================QUERY========================================
    const queryExample = await client.queryContractSmart(
        contract_address,
        { poll: { poll_id: "poll1" } }
    );

    console.log("Query response:");
    console.log(formatPollQueryResponse(queryExample));

    // Close the connection
    await client.disconnect();
}

function formatPollQueryResponse(queryResponse) {
    if (!queryResponse || !queryResponse.poll || !queryResponse.poll.options) {
        return queryResponse;
    }
    // Format options into array of arrays [ [String, u64], [String, u64], ... ]
    const formattedOptions = queryResponse.poll.options.map(option => [option[0], option[1]]);
    const formattedPoll = {
        creator: queryResponse.poll.creator,
        question: queryResponse.poll.question,
        options: formattedOptions
    };
    return formattedPoll;
}


    

    //===================================================================================


main();