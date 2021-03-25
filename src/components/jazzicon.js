import React from "react";
// import Jazzicon from "@metamask/jazzicon";
import Jazzicon from "react-jazzicon";
import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";

function JazzIcon(props) {
  var account = useWeb3React().account;

  return (
    <>
      <Jazzicon diameter={25} seed={parseInt(account?.slice(2, 10), 16)} />
    </>
  );
}

export default JazzIcon;
