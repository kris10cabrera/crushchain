// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

error NotTwoInitials();
error LimitReached();
error InvalidPagination();
error NotAdmin();
error NotAllowed();

contract CrushRecords {
    address public immutable admin;

    // Mapping to track allowlisted addresses
    mapping(address => bool) public allowlist;

    uint16 public crushCount;
    uint16 private constant MAX_CRUSHES = 333;

    struct Crush {
        bytes2 initials;
    }

    mapping(uint256 => Crush) public crushes;

    event CrushAdded(bytes2 initials);
    event CrushDeleted(uint256 crushId);
    event AddressAllowlisted(address indexed user);

    constructor() {
        admin = msg.sender;
        allowlist[0x6dAf4588d1118afa8fcF065dB222Fe27e6Afd4E1] = true;
        allowlist[0x0dA5536D4Daf485967E172de05ED5bF7d73a6cc0] = true;
        allowlist[0x8A05fA58d533a6e40C4381E3247Cf4c68ca61cdc] = true;
        allowlist[msg.sender] = true;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyAllowlisted() {
        if (!allowlist[msg.sender]) revert NotAllowed();
        _;
    }

    function _checkInitialsAreLetters(bytes2 initials) private pure {
        bytes1 firstLetter = initials[0];
        bytes1 secondLetter = initials[1];

        unchecked {
            bool isFirstLetterValid = (uint8(firstLetter) >= 65 && uint8(firstLetter) <= 90)
                || (uint8(firstLetter) >= 97 && uint8(firstLetter) <= 122);
            bool isSecondLetterValid = (uint8(secondLetter) >= 65 && uint8(secondLetter) <= 90)
                || (uint8(secondLetter) >= 97 && uint8(secondLetter) <= 122);
            if (!isFirstLetterValid || !isSecondLetterValid) {
                revert NotTwoInitials();
            }
        }
    }

    function _checkIsNotEmpty(bytes2 initials) private pure {
        if (initials[0] == 0 && initials[1] == 0) {
            revert NotTwoInitials();
        }
    }

    function addToAllowlist(address user) external onlyAdmin {
        allowlist[user] = true;
        emit AddressAllowlisted(user);
    }

    function addCrush(bytes2 _initials) external onlyAllowlisted returns (uint256 crushId) {
        _checkIsNotEmpty(_initials);
        _checkInitialsAreLetters(_initials);

        if (crushCount >= MAX_CRUSHES) revert LimitReached();

        unchecked {
            crushCount++;
            crushId = crushCount;
        }
        crushes[crushId] = Crush(_initials);
        emit CrushAdded(_initials);
        return crushId;
    }

    function getCrush(uint256 crushId) external view returns (string memory) {
        if (crushId == 0 || crushId > crushCount) return "";
        Crush memory crush = crushes[crushId];
        if (crush.initials == 0) return "";
        return string(abi.encodePacked(crush.initials));
    }

    function deleteCrush(uint256 crushId) external onlyAdmin {
        if (crushId == 0 || crushId > crushCount) revert InvalidPagination();
        if (crushId != crushCount) {
            crushes[crushId] = crushes[crushCount];
        }
        delete crushes[crushCount];
        unchecked {
            crushCount--;
        }

        emit CrushDeleted(crushId);
    }

    function getCrushes(uint256 page, uint256 pageSize) external view returns (string[] memory) {
        if (page == 0 || pageSize == 0 || pageSize > MAX_CRUSHES) revert InvalidPagination();

        uint256 startIndex;
        uint256 endIndex;

        unchecked {
            startIndex = (page - 1) * pageSize + 1;
            if (startIndex > crushCount || startIndex < 1) revert InvalidPagination();

            endIndex = startIndex + pageSize - 1;
            if (endIndex > crushCount) {
                endIndex = crushCount;
            }
        }

        uint256 resultSize = endIndex - startIndex + 1;
        string[] memory _crushes = new string[](resultSize);
        unchecked {
            for (uint256 i = startIndex; i <= endIndex; i++) {
                Crush memory crush = crushes[i];
                _crushes[i - startIndex] = string(abi.encodePacked(crush.initials));
            }
        }

        return _crushes;
    }

    function isAllowlisted(address user) external view returns (bool) {
        return allowlist[user];
    }
}
