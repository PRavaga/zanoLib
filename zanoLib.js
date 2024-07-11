import axios from "axios";
import Big from "big.js";

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
      console.error("Error fetching assets list:", error);
      throw error;
    }
  }

  return allAssets;
};

// Fetch details of a specific asset by asset ID
const getAssetDetails = async (assetId) => {
  const assets = await getAssetsList();
  const asset = assets.find((a) => a.asset_id === assetId);
  if (!asset) throw new Error(`Asset with ID ${assetId} not found`);
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
      throw new Error(`Error fetching info for asset ID ${assetId}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Send a transfer of a specific asset
const sendTransfer = async (assetId, address, amount) => {
  const asset = await getAssetDetails(assetId);
  const decimalPoint = asset.decimal_point;
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
    } else {
      throw new Error("Error sending transfer");
    }
  } catch (error) {
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
  }
};

export {
  sendTransfer,
  getBalances,
  getAssetsList,
  getAssetDetails,
  getAssetInfo,
};
