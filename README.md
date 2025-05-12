# crushchain

A blockchain-based crush registry that powers [thinkinboutyou.com](https://thinkinboutyou.com) ([repo for website](https://github.com/kris10cabrera/thinkin-bout-you)).

[Contract address](https://basescan.org/address/0x9B3249313741fa8599dfF15455AD2545c36543dB): `0x9B3249313741fa8599dfF15455AD2545c36543dB`

This repo contains a Solidity smart contract that allows users to register their crushes' initials on the blockchain.

The contract `CrushRecords`, is built with the following features:
- Add crush's initials to the blockchain (must be two letters)
- Admin-controlled allowlist for limiting who can add crushes
- Limited to a maximum of 333 crush records
- Admin ability to delete crush records if needed

## Smart Contract Details

### Key Features

- **Allowlist system**: Only addresses on the allowlist can add crushes
- **Initials validation**: Ensures only valid alphabetic characters are used
- **Limited Supply**: Maximum of 333 crush records can be added
- **Privacy focused**: Only stores 2 letter initials to prevent the need for content moderation and to balance privacy with the sentiment of sharing a crush. 

### Contract Structure

- `addCrush(bytes2 _initials)`: Add a crush's initials to the blockchain
- `getCrush(uint256 crushId)`: Get a specific crush by ID
- `getCrushes(uint256 page, uint256 pageSize)`: Get a paginated list of crushes
- `deleteCrush(uint256 crushId)`: Admin-only function to delete a crush
- `addToAllowlist(address user)`: Admin-only function to add users to the allowlist
- `isAllowlisted(address user)`: Check if an address is on the allowlist