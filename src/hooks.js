"use strict";
exports.__esModule = true;
exports.useInactiveListener = exports.useEagerConnect = void 0;
var react_1 = require("react");
var core_1 = require("@web3-react/core");
var injected_connector_1 = require("@web3-react/injected-connector");
var injected = new injected_connector_1.InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
function useEagerConnect() {
    var _a = core_1.useWeb3React(), activate = _a.activate, active = _a.active;
    var _b = react_1.useState(false), tried = _b[0], setTried = _b[1];
    react_1.useEffect(function () {
        injected.isAuthorized().then(function (isAuthorized) {
            if (isAuthorized) {
                activate(injected, undefined, true)["catch"](function () {
                    setTried(true);
                });
            }
            else {
                setTried(true);
            }
        });
    }, []); // intentionally only running on mount (make sure it's only mounted once :))
    // if the connection worked, wait until we get confirmation of that to flip the flag
    react_1.useEffect(function () {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);
    return tried;
}
exports.useEagerConnect = useEagerConnect;
function useInactiveListener(suppress) {
    if (suppress === void 0) { suppress = false; }
    var _a = core_1.useWeb3React(), active = _a.active, error = _a.error, activate = _a.activate;
    react_1.useEffect(function () {
        var ethereum = window.ethereum;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            var handleConnect_1 = function () {
                console.log("Handling 'connect' event");
                activate(injected);
            };
            var handleChainChanged_1 = function (chainId) {
                console.log("Handling 'chainChanged' event with payload", chainId);
                activate(injected);
            };
            var handleAccountsChanged_1 = function (accounts) {
                console.log("Handling 'accountsChanged' event with payload", accounts);
                if (accounts.length > 0) {
                    activate(injected);
                }
            };
            var handleNetworkChanged_1 = function (networkId) {
                console.log("Handling 'networkChanged' event with payload", networkId);
                activate(injected);
            };
            ethereum.on("connect", handleConnect_1);
            ethereum.on("chainChanged", handleChainChanged_1);
            ethereum.on("accountsChanged", handleAccountsChanged_1);
            ethereum.on("networkChanged", handleNetworkChanged_1);
            return function () {
                if (ethereum.removeListener) {
                    ethereum.removeListener("connect", handleConnect_1);
                    ethereum.removeListener("chainChanged", handleChainChanged_1);
                    ethereum.removeListener("accountsChanged", handleAccountsChanged_1);
                    ethereum.removeListener("networkChanged", handleNetworkChanged_1);
                }
            };
        }
    }, [active, error, suppress, activate]);
}
exports.useInactiveListener = useInactiveListener;
