import axios from "axios";
import Big from "big.js";

// Define custom error class
class ZanoError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ZanoError";
    this.code = code;
  }
}

// Configuration
const walletUrl = "http://127.0.0.1:10500/json_rpc";
const daemonUrl = "http://127.0.0.1:12111/json_rpc";

// Fetch the list of all assets registered in the Zano blockchain
const getAssetsList = async () => {
  const headers = { "Content-Type": "application/json" };
  const count = 100; // Number of items to fetch per request
  let offset = 0;
  let allAssets = [];
  let keepFetching = true;

  while (keepFetching) {
    const data = {
      jsonrpc: "2.0",
      id: 0,
      method: "get_assets_list",
      params: { count, offset },
    };

    try {
      const response = await axios.post(daemonUrl, data, { headers });
      const assets = response.data.result.assets;
      if (assets.length < count) {
        keepFetching = false;
      }
      allAssets = allAssets.concat(assets);
      offset += count;
    } catch (error) {
      throw new ZanoError("Failed to fetch assets list", "ASSETS_FETCH_ERROR");
    }
  }

  return allAssets;
};

// Fetch details of a specific asset by asset ID
const getAssetDetails = async (assetId) => {
  const assets = await getAssetsList();
  const asset = assets.find((a) => a.asset_id === assetId);
  if (!asset)
    throw new ZanoError(
      `Asset with ID ${assetId} not found`,
      "ASSET_NOT_FOUND"
    );
  return asset;
};

// Fetch asset descriptor by asset ID
const getAssetInfo = async (assetId) => {
  const headers = { "Content-Type": "application/json" };
  const data = {
    jsonrpc: "2.0",
    id: 0,
    method: "get_asset_info",
    params: { asset_id: assetId },
  };

  try {
    const response = await axios.post(daemonUrl, data, { headers });
    if (response.data.result) {
      return response.data.result;
    } else {
      throw new ZanoError(
        `Error fetching info for asset ID ${assetId}`,
        "ASSET_INFO_ERROR"
      );
    }
  } catch (error) {
    console.error(error);
    throw new ZanoError("Failed to fetch asset info", "ASSET_INFO_FETCH_ERROR");
  }
};

// Send a transfer of a specific asset
const sendTransfer = async (assetId, address, amount) => {
  let decimalPoint;
  if (
    assetId ===
    "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
  ) {
    decimalPoint = 12;
  } else {
    const asset = await getAssetDetails(assetId);
    decimalPoint = asset.decimal_point;
  }
  const headers = { "Content-Type": "application/json" };
  const bigAmount = new Big(amount)
    .times(new Big(10).pow(decimalPoint))
    .toString();
  const data = {
    jsonrpc: "2.0",
    id: 0,
    method: "transfer",
    params: {
      destinations: [{ address, amount: bigAmount, asset_id: assetId }],
      fee: "10000000000",
      mixin: 15,
    },
  };

  try {
    const response = await axios.post(walletUrl, data, { headers });
    if (response.data.result) {
      return response.data.result;
    } else if (
      response.data.error &&
      response.data.error.message === "WALLET_RPC_ERROR_CODE_NOT_ENOUGH_MONEY"
    ) {
      throw new ZanoError("Not enough funds", "NOT_ENOUGH_FUNDS");
    } else {
      throw new ZanoError("Error sending transfer", "TRANSFER_ERROR");
    }
  } catch (error) {
    if (error instanceof ZanoError) {
      throw error; // Re-throw the custom error
    } else {
      throw new ZanoError("Failed to send transfer", "TRANSFER_SEND_ERROR");
    }
  }
};

// Fetch the balances of all assets in the wallet
const getBalances = async () => {
  const headers = { "Content-Type": "application/json" };
  const data = {
    jsonrpc: "2.0",
    id: 0,
    method: "getbalance",
  };

  try {
    const response = await axios.post(walletUrl, data, { headers });
    const balances = response.data.result.balances.map((asset) => ({
      name: asset.asset_info.full_name,
      ticker: asset.asset_info.ticker,
      id: asset.asset_info.asset_id,
      amount: new Big(asset.unlocked)
        .div(new Big(10).pow(asset.asset_info.decimal_point))
        .toString(),
    }));
    return balances.sort((a, b) => {
      if (
        a.id ===
        "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
      )
        return -1;
      if (
        b.id ===
        "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
      )
        return 1;
      return 0;
    });
  } catch (error) {
    throw new ZanoError("Failed to fetch balances", "BALANCES_FETCH_ERROR");
  }
};

export {
  ZanoError,
  sendTransfer,
  getBalances,
  getAssetsList,
  getAssetDetails,
  getAssetInfo,
};
