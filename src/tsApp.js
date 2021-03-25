"use strict";
var _a;
var exports = { __esModule: true };
var react_1 = require("react");
var walletconnect_connector_1 = require("@web3-react/walletconnect-connector");
var walletlink_connector_1 = require("@web3-react/walletlink-connector");
var portis_connector_1 = require("@web3-react/portis-connector");
var network_connector_1 = require("@web3-react/network-connector");
var injected_connector_1 = require("@web3-react/injected-connector");
var frame_connector_1 = require("@web3-react/frame-connector");
var fortmatic_connector_1 = require("@web3-react/fortmatic-connector");
var units_1 = require("@ethersproject/units");
var hooks_1 = require("./hooks");
var Spinner_1 = require("./components/Spinner");
var jazzicon_1 = require("./components/jazzicon");
var core_1 = require("@web3-react/core");
var providers_1 = require("@ethersproject/providers");
var POLLING_INTERVAL = 12000;
var RPC_URLS = {
  1: process.env.REACT_APP_RPC_URL_1,
  4: process.env.REACT_APP_RPC_URL_4,
};
var walletconnect = new walletconnect_connector_1.WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
var injected = new injected_connector_1.InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
var network = new network_connector_1.NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1,
});
var fortmatic = new fortmatic_connector_1.FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  chainId: 4,
});
var walletlink = new walletlink_connector_1.WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "web3-react example",
});
var portis = new portis_connector_1.PortisConnector({
  dAppId: process.env.REACT_APP_PORTIS_DAPP_ID,
  networks: [1, 100],
});
var ConnectorNames;
(function (ConnectorNames) {
  ConnectorNames["Injected"] = "Injected";
  ConnectorNames["Network"] = "Network";
  ConnectorNames["WalletConnect"] = "WalletConnect";
  ConnectorNames["WalletLink"] = "WalletLink";
  ConnectorNames["Portis"] = "Portis";
  ConnectorNames["Fortmatic"] = "Fortmatic";
})(ConnectorNames || (ConnectorNames = {}));
var connectorsByName =
  ((_a = {}),
  (_a[ConnectorNames.Injected] = injected),
  (_a[ConnectorNames.Network] = network),
  (_a[ConnectorNames.WalletConnect] = walletconnect),
  (_a[ConnectorNames.WalletLink] = walletlink),
  (_a[ConnectorNames.Portis] = portis),
  (_a[ConnectorNames.Fortmatic] = fortmatic),
  _a);
function getErrorMessage(error) {
  if (error instanceof injected_connector_1.NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof core_1.UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof injected_connector_1.UserRejectedRequestError ||
    error instanceof walletconnect_connector_1.UserRejectedRequestError ||
    error instanceof frame_connector_1.UserRejectedRequestError
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}
function getLibrary(provider) {
  var library = new providers_1.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
var children;
function So() {
  return (
    <core_1.Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </core_1.Web3ReactProvider>
  );
}
export default So;
function CopyAddress(account) {
  var temp = document.createElement("INPUT");
  temp.value = account;
  var body = document.querySelector("body");
  body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  alert("Address copied");
  body.removeChild(temp);
}
function ChainId() {
  var chainId = core_1.useWeb3React().chainId;
  return (
    <div>
      <span>Chain Id : </span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId !== null && chainId !== void 0 ? chainId : ""}</span>
      <hr></hr>
    </div>
  );
}
function Account() {
  var account = core_1.useWeb3React().account;
  return (
    <div>
      <span>{"  "}Account : </span>
      <span>
        <jazzicon_1.default />
        {"  "}
      </span>
      <span
        onClick={function () {
          CopyAddress(account);
        }}
      >
        {account === null
          ? "-"
          : account
          ? account.substring(0, 6) +
            "..." +
            account.substring(account.length - 4)
          : ""}
      </span>
      <hr></hr>
    </div>
  );
}
function Balance() {
  var _a = core_1.useWeb3React(),
    account = _a.account,
    library = _a.library,
    chainId = _a.chainId;
  var _b = react_1.useState(),
    balance = _b[0],
    setBalance = _b[1];
  react_1.useEffect(
    function () {
      if (!!account && !!library) {
        var stale_1 = false;
        library
          .getBalance(account)
          .then(function (balance) {
            if (!stale_1) {
              setBalance(balance);
            }
          })
          ["catch"](function () {
            if (!stale_1) {
              setBalance(null);
            }
          });
        return function () {
          stale_1 = true;
          setBalance(undefined);
        };
      }
    },
    [account, library, chainId]
  ); // ensures refresh if referential identity of library doesn't change across chainIds
  return (
    <div>
      <span>Balance : </span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null
          ? "Error"
          : balance
          ? "\u039E" + units_1.formatEther(balance)
          : ""}
      </span>
      <hr></hr>
    </div>
  );
}
function BlockNumber() {
  var _a = core_1.useWeb3React(),
    chainId = _a.chainId,
    library = _a.library;
  var _b = react_1.useState(),
    blockNumber = _b[0],
    setBlockNumber = _b[1];
  react_1.useEffect(
    function () {
      if (!!library) {
        var stale_2 = false;
        library
          .getBlockNumber()
          .then(function (blockNumber) {
            if (!stale_2) {
              setBlockNumber(blockNumber);
            }
          })
          ["catch"](function () {
            if (!stale_2) {
              setBlockNumber(null);
            }
          });
        var updateBlockNumber_1 = function (blockNumber) {
          setBlockNumber(blockNumber);
        };
        library.on("block", updateBlockNumber_1);
        return function () {
          stale_2 = true;
          library.removeListener("block", updateBlockNumber_1);
          setBlockNumber(undefined);
        };
      }
    },
    [library, chainId]
  ); // ensures refresh if referential identity of library doesn't change across chainIds
  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>
        {blockNumber === null
          ? "Error"
          : blockNumber !== null && blockNumber !== void 0
          ? blockNumber
          : ""}
      </span>
      <hr></hr>
    </>
  );
}
function Header() {
  var _a = core_1.useWeb3React(),
    active = _a.active,
    error = _a.error;
  return (
    <div>
      <h1 style={{ margin: "1rem", textAlign: "right" }}>
        {active ? "🟢" : error ? "🔴" : "🟠"}
      </h1>
      <h3>
        <hr></hr>
        <Account />

        <Balance />

        <BlockNumber />

        <ChainId />
        <hr></hr>
      </h3>
    </div>
  );
}
function App() {
  var context = core_1.useWeb3React();
  var connector = context.connector,
    library = context.library,
    chainId = context.chainId,
    account = context.account,
    activate = context.activate,
    deactivate = context.deactivate,
    active = context.active,
    error = context.error;
  var _a = react_1.useState(),
    activatingConnector = _a[0],
    setActivatingConnector = _a[1];
  react_1.useEffect(
    function () {
      if (activatingConnector && activatingConnector === connector) {
        setActivatingConnector(undefined);
      }
    },
    [activatingConnector, connector]
  );
  var triedEager = hooks_1.useEagerConnect();
  hooks_1.useInactiveListener(!triedEager || !!activatingConnector);
  return (
    <>
      <Header />
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {Object.keys(connectorsByName).map(function (name) {
          var currentConnector = connectorsByName[name];
          var activating = currentConnector === activatingConnector;
          var connected = currentConnector === connector;
          var disabled =
            !triedEager || !!activatingConnector || connected || !!error;
          return (
            <>
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  borderColor: activating
                    ? "orange"
                    : connected
                    ? "green"
                    : "unset",
                  cursor: disabled ? "unset" : "pointer",
                  position: "relative",
                }}
                key={name}
                onClick={function () {
                  setActivatingConnector(currentConnector);
                  activate(connectorsByName[name]);
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    margin: "0 0 0 1rem",
                  }}
                >
                  {activating && (
                    <Spinner_1.Spinner
                      color={"black"}
                      style={{ height: "25%", marginLeft: "-1rem" }}
                    />
                  )}
                  {connected && (
                    <span role="img" aria-label="check">
                      ✅
                    </span>
                  )}
                </div>
                {name}
              </button>
              <br />
            </>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {(active || error) && (
          <button
            style={{
              height: "3rem",
              marginTop: "2rem",
              borderRadius: "1rem",
              borderColor: "red",
              cursor: "pointer",
            }}
            onClick={function () {
              deactivate();
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && (
          <h4 style={{ marginTop: "1rem", marginBottom: "0" }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </div>
      <hr style={{ margin: "2rem" }} />
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: "fit-content",
          maxWidth: "20rem",
          margin: "auto",
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={function () {
              library
                .getSigner(account)
                .signMessage("👋")
                .then(function (signature) {
                  window.alert("Success!\n\n" + signature);
                })
                ["catch"](function (error) {
                  window.alert(
                    "Failure!" +
                      (error && error.message ? "\n\n" + error.message : "")
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
        {!!(
          connector === connectorsByName[ConnectorNames.Network] && chainId
        ) && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={function () {
              connector.changeChainId(chainId === 1 ? 4 : 1);
            }}
          >
            Switch Networks
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={function () {
              connector.close();
            }}
          >
            Kill WalletConnect Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletLink] && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={function () {
              connector.close();
            }}
          >
            Kill WalletLink Session
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.Fortmatic] && (
          <button
            style={{
              height: "3rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={function () {
              connector.close();
            }}
          >
            Kill Fortmatic Session
          </button>
        )}

        {connector === connectorsByName[ConnectorNames.Portis] && (
          <>
            {chainId !== undefined && (
              <button
                style={{
                  height: "3rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                onClick={function () {
                  connector.changeNetwork(chainId === 1 ? 100 : 1);
                }}
              >
                Switch Networks
              </button>
            )}
            <button
              style={{
                height: "3rem",
                borderRadius: "1rem",
                cursor: "pointer",
              }}
              onClick={function () {
                connector.close();
              }}
            >
              Kill Portis Session
            </button>
          </>
        )}
      </div>
    </>
  );
}
