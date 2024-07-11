import { sendTransfer, getBalances } from "./zanoLib.js";

const exampleUsage = async () => {
  try {
    const balances = await getBalances();
    console.log("Balances:", balances);

    const assetId =
      "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a";
    const address =
      "ZxCxWNUaySi1j6Uqn48iEQR8pNSj5E4LsEWTTs8DKoUZKyPnkaHr69zU6475br9kTU7cSAV7UGJ9idVRLbv7HboU1yerXV9br";
    const amount = 10;

    const transferResult = await sendTransfer(assetId, address, amount);
    console.log("Transfer Result:", transferResult);
  } catch (error) {
    console.error("Error:", error);
  }
};

exampleUsage();
