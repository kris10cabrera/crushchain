// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

error NotTwoInitials();
error LimitReached();
error InvalidPagination();
error NotAdmin();

contract CrushRecords {
    address public immutable admin;

    constructor() {
        admin = msg.sender;
    }

    struct Crush {
        bytes2 initials;
    }
    event CrushAdded(bytes2 initials);
    event CrushDeleted(uint256 crushId);
    uint16 public crushCount;
    mapping(uint256 crushId => Crush crush) public crushes;

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert NotAdmin();
        }
        _;
    }

    function _checkInitialsAreLetters(bytes2 initials) private pure {
        bytes1 firstLetter = initials[0];
        bytes1 secondLetter = initials[1];

        bool isFirstLetterValid = (uint8(firstLetter) >= 65 &&
            uint8(firstLetter) <= 90) ||
            (uint8(firstLetter) >= 97 && uint8(firstLetter) <= 122);

        bool isSecondLetterValid = (uint8(secondLetter) >= 65 &&
            uint8(secondLetter) <= 90) ||
            (uint8(secondLetter) >= 97 && uint8(secondLetter) <= 122);

        if (!isFirstLetterValid || !isSecondLetterValid) {
            revert NotTwoInitials();
        }
    }

    function addCrush(bytes2 _initials) public returns (uint256 crushId) {
        _checkInitialsAreLetters(_initials);
        if (crushCount >= 666) {
            revert LimitReached();
        }
        crushCount++;
        crushId = crushCount;
        crushes[crushId] = Crush(_initials);
        emit CrushAdded(_initials);
        return crushId;
    }

    function getCrush(uint256 crushId) public view returns (string memory) {
        Crush memory crush = crushes[crushId];
        if (crush.initials == 0) {
            return "";
        }
        return (string(abi.encodePacked(crush.initials)));
    }

    function getCrushCount() public view returns (uint) {
        return crushCount;
    }

    function deleteCrush(uint256 crushId) public onlyAdmin {
        // Check if crush exists
        if (crushId == 0 || crushId > crushCount) {
            revert InvalidPagination();
        }

        // Delete the crush
        delete crushes[crushId];

        // Emit event
        emit CrushDeleted(crushId);
    }

    function getCrushes(
        uint256 page,
        uint256 pageSize
    ) public view returns (string[] memory) {
        if (page == 0 || pageSize == 0 || pageSize > 667) {
            revert InvalidPagination();
        }
        uint256 startIndex;
        uint256 endIndex;
        unchecked {
            startIndex = (page - 1) * pageSize + 1;
            if (startIndex > crushCount || startIndex < 1) {
                revert InvalidPagination();
            }
            endIndex = startIndex + pageSize - 1;
            if (endIndex > crushCount) {
                endIndex = crushCount;
            }
        }

        string[] memory _crushes = new string[](endIndex - startIndex + 1);
        for (uint256 i = startIndex; i <= endIndex; i++) {
            Crush memory crush = crushes[i];
            _crushes[i - startIndex] = string(abi.encodePacked(crush.initials));
        }
        return _crushes;
    }
}
