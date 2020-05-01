export type Faq = {
  question: string,
  answer: string,
};

export const faqs: Faq [] = [
  {
    question: 'How do I Swap?',
    answer:
      'Unlock your wallet by clicking "Add Wallet" at the top of the page.\n\nSelect your testnet keystore to upload and enter your password to unlock.\n\nOnce your wallet is unlocked, navigate to the swap page and click the green "Swap" button.\n\nEnter the amount of the token you wish to swap from, and drag the slider to confirm.\n\nEnter your password to confirm the transaction. The swap will be completed in 2-3 seconds!',
  },
  {
    question: 'How do I Swap and Send?',
    answer:
      'To swap & send simply select the swap & send toggle on the swap page. Enter the tbnb address where you want to receive the swapped tokens. Enter the amount you want to swap from and drag the slider to confirm. Once your password is accepted the swap will be performed!',
  },
  {
    question: 'How do I Stake?',
    answer: 'Staking will be unveiled soon. Check back for updates!',
  },
  {
    question: 'How do I withdraw?',
    answer:
      'Once staking is enabled you will be able to stake to existing pools and withdraw with just a click! Check back for updates!',
  },
];
