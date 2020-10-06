/* eslint-disable quotes */
export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: 'What is BEPSwap?',
    answer: `BEPSwap is a interface for the THORChain decentralised liquidity network and enables BEP2 assets to be swapped across liquidity pools on THORChain's decentralised liquidity network. Asset holders can also add their unproductive assets and earn fees on swaps. THORNodes operate the network and split the responsibility of operating exchange infrastructure, asset management and trading software to enable assets to be swapped in a decentralised way.\n\nMore information can be found at https://docs.thorchain.org/ or https://rebase.foundation/network/thorchain/.`,
  },
  {
    question: 'What assets are supported?',
    answer:
      'THORChain currently only supports BEP2 assets on Binance Chain however support for Bitcoin and Ethereum networks will follow soon with the release of Asgard Wallet. THORChain is blockchain agnostic and can be connected to almost any blockchain & support a wide array of assets. BEPSwap is the first go-to-market product for THORChain, and thus will only support BEP2 and eventually will be retired.',
  },
  {
    question: 'Is BEPSwap custodial?',
    answer:
      'THORChain is a decentralised exchange that is non custodial, permissionless and trustlesss. This means no permission is needed to use the network, and nobody can confiscate your assets or block withdrawals. The THORChain protocol you dont need to trust any intermediary, and the network is Byzantine Fault Tolerant & can handle up to one third malicious nodes. THORNodes secure the network by bonding RUNE which can be slashed for disruptive and malicious behaviour, and no single node operator can interfere with your transactions.',
  },
  {
    question: 'How do I obtain testnet assets?',
    answer:
      'A BEP2 testnet faucet is available via the BEPSwap telegram bot (https://t.me/BEPSwapBot). Start the bot and click GET WALLET. Instructions will be provided on how to save your keystore, dont forget to remember or save your password.',
  },
  {
    question: 'How do I connect my new wallet?',
    answer:
      'Click the ADD WALLET pill on the header and select KEYSTORE from the options. Browse your local disk and find the testnet keystore saved from the telegram bot. Enter the password and click OK. Your wallet will now be loaded and your binance chain address shown on the wallet button on the header. Click the wallet button to open the wallet drawer, your BEP2 assets will be shown.',
  },
  {
    question: 'How do I swap?',
    answer:
      'Once your wallet is connected, click SWAP from the header and then click SWAP against the pool you wish to swap across, for example BNB<>RUNE. Enter the amount you wish to swap and then simply DRAG TO SWAP, after entering your wallet password the swap will commence. When the swap has completed youll receive a confirmation and the assets can be verified in your wallet. For your protection a slip limit of 3% is enforced to avoid loss of funds. Simply click the lock icon to remove this restriction to increase the slip limit to 30%.',
  },
  {
    question: 'What is staking?',
    answer:
      'On THORChain, swappers access liquidity provided by agents who add their unproductive assets to earn fees on every swap. Anyone can contribute liquidity to the pools by staking in the pool of their choice. BEPSwap will provide a live view of your returns and how much fees are being earned by providing liquidity. In this way assets become productive to the pool member.',
  },
  {
    question: 'How do I add liquidity?',
    answer:
      'Click on ADD from the header menu and select the pool you wish to add liquidity in. eg. BNB. Use the slider to select the amount of asset you wish to add liquidity, or enter an amount. BEPSwap will select the optimal ratio based on the current ratio (pool price) of assets in the pool; however you can override this if you want. Drag to add, enter your password and youre done! Your liquidity should appear within a few minutes and can be viewed on the add liquidity screen or within the wallet drawer.',
  },
  {
    question: 'BEPSwap is in testnet, when will mainnet go live?',
    answer:
      'Mainnet will launch once the public testnet concludes and results from the mainnet dress rehearsal "Chaosnet" show the network is ready for launch. In the meantime you can help the team test BEPSwap and get familiar with the product.',
  },
  {
    question: 'Where can I provide feedback?',
    answer:
      'Feedback is always appreciated and we encourage you to submit issues to gitlab (https://gitlab.com/thorchain/bepswap) or in telegram (https://t.me/thorchain_org).',
  },
  {
    question: 'How can I get involved?',
    answer:
      'If youre a talented engineer or believe you can bring value to the project, talk to one of the admins on telegram or join https://t.me/thorchain_dev.',
  },
];
