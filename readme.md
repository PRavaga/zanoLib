# zanoLib

A reusable library for interacting with the Zano wallet API.

## Installation

To install the necessary dependencies, run:

```sh
npm install axios big.js
```

## Usage

### Importing the Library

To use the library, import the functions you need:

```javascript
import {
  sendTransfer,
  getBalances,
  getAssetsList,
  getAssetDetails,
} from "./zanoLib.js";
```

### Example

Here's an example of how to use the library:

```javascript
const exampleUsage = async () => {
  try {
    const balances = await getBalances();
    console.log("Balances:", balances);

    const assetId =
      "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"; // Example asset ID
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
```

## Functions

### `getAssetsList()`

Fetches the list of all assets registered in the Zano blockchain.

#### Usage

```javascript
const assets = await getAssetsList();
console.log("Assets:", assets);
```

### `getAssetDetails(assetId)`

Fetches details of a specific asset by asset ID.

#### Parameters

- `assetId` (string): The ID of the asset to fetch details for.

#### Usage

```javascript
const assetDetails = await getAssetDetails(
  "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
);
console.log("Asset Details:", assetDetails);
```

### `sendTransfer(assetId, address, amount)`

Sends a transfer of a specific asset.

#### Parameters

- `assetId` (string): The ID of the asset to transfer.
- `address` (string): The recipient's address.
- `amount` (number): The amount to transfer.

#### Usage

```javascript
const transferResult = await sendTransfer(
  "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
  "ZxCxWNUaySi1j6Uqn48iEQR8pNSj5E4LsEWTTs8DKoUZKyPnkaHr69zU6475br9kTU7cSAV7UGJ9idVRLbv7HboU1yerXV9br",
  10
);
console.log("Transfer Result:", transferResult);
```

### `getBalances()`

Fetches the balances of all assets in the wallet.

#### Usage

```javascript
const balances = await getBalances();
console.log("Balances:", balances);
```

## Error Handling

Each function includes error handling to log any issues that occur during API requests. If an error is encountered, it will be logged to the console, and the error will be thrown to be handled by the calling code.

## License

This project is licensed under the MIT License.
