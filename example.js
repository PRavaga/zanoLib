import {
  ZanoError,
  sendTransfer,
  getBalances,
  getAssetsList,
  getAssetDetails,
  getAssetInfo,
} from "./zanoLib.js";

const exampleUsage = async () => {
  try {
    // Fetching balances
    const balances = await getBalances();
    console.log("Balances:", balances);

    const list = await getAssetsList();
    console.log("Assets List:", list);

    // Fetching assets list, skipping native Zano
    for (const asset of balances) {
      if (
        asset.id !=
        "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
      ) {
        const assetDetails = await getAssetDetails(asset.id);
        console.log("Asset Details:", assetDetails);
      }
    }

    const assetId =
      "7d3f348fbebfffc4e61a3686189cf870ea393e1c88b8f636acbfdacf9e4b2db2";
    const address =
      "ZxCxWNUaySi1j6Uqn48iEQR8pNSj5E4LsEWTTs8DKoUZKyPnkaHr69zU6475br9kTU7cSAV7UGJ9idVRLbv7HboU1yerXV9br";
    const amount = 10;

    // Transfer example
    const transferResult = await sendTransfer(assetId, address, amount);
    console.log("Transfer Result:", transferResult);
  } catch (error) {
    if (error instanceof ZanoError) {
      console.error(`Transfer Error: ${error.message} (Code: ${error.code})`);
    } else {
      console.error("General Error:", error);
    }
  }
};

exampleUsage();
