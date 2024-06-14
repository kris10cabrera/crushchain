// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

error NotTwoInitials();

contract CrushRecords {
    struct Crush {
        uint32 ipAddress;
        bytes2 initials;
    }
    event CrushAdded(uint32 ipAddress, bytes2 initials);
    uint public crushCount;
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

    function addCrush(uint32 _ipAddress, bytes2 _initials) public {
        _checkInitialsAreLetters(_initials);
        crushCount++;
        crushes[crushCount] = Crush(_ipAddress, _initials);
        emit CrushAdded(_ipAddress, _initials);
    }

    function getCrush(uint256 crushId) public view returns (Crush memory) {
        return crushes[crushId];
    }

    function getCrushCount() public view returns (uint) {
        return crushCount;
    }

    function getCrushes() public view returns (Crush[] memory) {
        Crush[] memory _crushes = new Crush[](crushCount);
        for (uint i = 1; i <= crushCount; i++) {
            _crushes[i - 1] = crushes[i];
        }
        return _crushes;
    }
}
