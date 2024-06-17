// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

error NotTwoInitials();

contract CrushRecords {
    struct Crush {
        uint32 ipAddress;
        bytes2 initials;
    }
    event CrushAdded(uint32 ipAddress, bytes2 initials);
    uint256 public crushCount;
    mapping(uint256 crushId => Crush crush) public crushes;

    function _checkInitialsAreLetters(bytes2 initials) private pure {
        bytes1 firstLetter = initials[0];
        bytes1 secondLetter = initials[1];
        if (
            !((uint8(firstLetter) >= 65 && uint8(firstLetter) <= 90) ||
                (uint8(firstLetter) >= 97 && uint8(firstLetter) <= 122) ||
                (uint8(secondLetter) >= 65 && uint8(secondLetter) <= 90) ||
                (uint8(secondLetter) >= 97 && uint8(secondLetter) <= 122))
        ) {
            revert NotTwoInitials();
        }
    }

    // Function to convert a uint32 to an IP address string
    function _uint32ToIp(uint32 ip) private pure returns (string memory) {
        // Extract each byte from the uint32
        uint8[4] memory bytesArray;
        bytesArray[0] = uint8(ip >> 24);
        bytesArray[1] = uint8(ip >> 16);
        bytesArray[2] = uint8(ip >> 8);
        bytesArray[3] = uint8(ip);

        // Convert bytes to string
        return
            string(
                abi.encodePacked(
                    _uintToString(bytesArray[0]),
                    ".",
                    _uintToString(bytesArray[1]),
                    ".",
                    _uintToString(bytesArray[2]),
                    ".",
                    _uintToString(bytesArray[3])
                )
            );
    }

    // Helper function to convert uint8 to string
    function _uintToString(uint8 v) private pure returns (string memory) {
        if (v == 0) {
            return "0";
        }
        uint8 temp = v;
        uint8 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (v != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint8(v % 10)));
            v /= 10;
        }
        return string(buffer);
    }

    function addCrush(
        uint32 _ipAddress,
        bytes2 _initials
    ) public returns (uint256 crushId) {
        _checkInitialsAreLetters(_initials);
        crushCount++;
        crushes[crushCount] = Crush(_ipAddress, _initials);
        emit CrushAdded(_ipAddress, _initials);
        return crushCount;
    }

    function getCrush(
        uint256 crushId
    ) public view returns (string memory, string memory) {
        Crush memory crush = crushes[crushId];
        return (
            _uint32ToIp(crush.ipAddress),
            string(abi.encodePacked(crush.initials))
        );
    }

    function getCrushCount() public view returns (uint) {
        return crushCount;
    }

    function getCrushes(
        uint page,
        uint pageSize
    ) public view returns (string[] memory) {
        uint startIndex = (page - 1) * pageSize + 1;
        uint endIndex = startIndex + pageSize - 1;
        if (endIndex > crushCount) {
            endIndex = crushCount;
        }
        require(startIndex <= endIndex, "Invalid pagination parameters");

        string[] memory _crushes = new string[](endIndex - startIndex + 1);
        for (uint i = startIndex; i <= endIndex; i++) {
            Crush memory crush = crushes[i];
            _crushes[i - startIndex] = string(
                abi.encodePacked(
                    _uint32ToIp(crush.ipAddress),
                    " ",
                    string(abi.encodePacked(crush.initials))
                )
            );
        }
        return _crushes;
    }
}
