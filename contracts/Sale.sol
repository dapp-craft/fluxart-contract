pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract SaleTokens is Context, AccessControlEnumerable {
//    IERC721 public nftCollection;

    address[] public beneficiaryList;

    mapping(uint256 => uint256) public percentByBeneficiaryId;
    mapping(uint256 => uint256) public claimedAmountByBeneficiaryId;

    mapping(uint256 => uint256) public beneficiaryIdByCollectionId;

    mapping(uint256 => uint256) public priceByCollectionId;
    mapping(uint256 => uint256) public salesAmountByCollectionId;
    mapping(uint256 => IERC721) public nftCollectionByCollectionId;


    // Address where funds are collected
//    address payable private walletStoredFunds;

    // prices in MANA by token id
//    mapping(uint256 => uint256) public priceByTokenId;

//    uint256 public rateMANAETH;

//    uint256 public referralPercent = 25;

//    address[] public referralList;

    event SoldNFT(
        address indexed _caller,
        uint256 indexed _collectionId,
        uint256 indexed _count
    );

    /**
     * @dev Constructor of the contract.
     * @param _walletStoredFunds - Address of the recipient of the funds
     * @param _walletStoredNFT - Address stored NFTs
     * @param _erc1155Collection - Address of the collection
     * @param _tokenIds - List token ids for prices
     * @param _prices - prices in MANA
     * @param _rateMANAETH - rate of MANA in WEI (1e18 = 1eth)
     */
    constructor(
        address payable _walletStoredFunds,
        address payable _walletStoredNFT,
        IERC1155 _erc1155Collection,
        uint256[] memory _tokenIds,
        uint256[] memory _prices,
        uint256 _rateMANAETH
    )
    public {
        require(_tokenIds.length == _prices.length, "length for tokenIds and prices arrays must equals");
        walletStoredFunds = _walletStoredFunds;
        walletStoredNFT = _walletStoredNFT;
        nftCollection = _erc1155Collection;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 id = _tokenIds[i];
            uint256 price = _prices[i];
            priceByTokenId[id] = price;
        }
        rateMANAETH = _rateMANAETH;
    }

    /**
* @dev Buy NFT for ETH
* @param _nftId - nft id
* @param _count - count
* @param _data - Data to pass if receiver is contract
* @param _referral -referral address
*/
    function buyNFT(uint256 _nftCollectionId, uint256 _count) public payable {
        require(_count >= 1, "Count must more or equal 1");

        uint256 price = priceByCollectionId[_nftCollectionId];
        // TODO check enough money

        IERC721 nftCollection = nftCollectionByCollectionId[_nftCollectionId];
        // TODO check max issue nft

        uint256 salesAmount = salesAmountByCollectionId[_nftCollectionId];

        for (uint256 i = 0; i < _count; i++) {

            nftCollection.mint(_msgSender());

            salesAmount += price;
            emit SoldNFT(_msgSender(), _nftCollectionId, _count);
        }

        salesAmountByCollectionId[_nftCollectionId] = salesAmount;
    }

    /**
    * @dev Buy NFT for ETH
    * @param _nftId - nft id
    * @param _count - count
    * @param _data -Data to pass if receiver is contract
    */
    function buyNFTForETH(uint256 _nftId, uint256 _count, bytes calldata _data) external payable {
        return buyNFTForETHWithReferral(_nftId, _count, _data, address(0));
    }

    function setPrices(
        uint256[] memory _tokenIds,
        uint256[] memory _prices
    ) public onlyOwner {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 id = _tokenIds[i];
            uint256 price = _prices[i];
            priceByTokenId[id] = price;
        }
    }

    function availableRewardForClaim(uint256[] memory _nftCollectionIds, address beneficiary)
    public view returns (uint256 available)
    {
        available = 0;
        for (uint256 beneficiaryId = 0; beneficiaryId < beneficiaryList.length; beneficiaryId++) {
            if (beneficiaryList[beneficiaryId] == beneficiary) {
                for (uint256 j = 0; j < _nftCollectionIds.length; j++) {
                    uint256 collectionId = _nftCollectionIds[j];
                    if (beneficiaryIdByCollectionId[collectionId] == beneficiaryId) { // TODO WARN 0 index
                        uint256 salesAmount = salesAmountByCollectionId[collectionId];
                        uint256 percent = percentByBeneficiaryId[beneficiaryId];
                        available += salesAmount * percent / 10000;
                    }
                }
            }
        }
        uint256 claimedAmount = claimedAmountByBeneficiaryId[beneficiaryId];
        if (available > claimedAmount) {
            available -= claimedAmount;
            return available;
        } else {
            return 0;
        }
    }

    function claimReward(uint256[] memory _nftCollectionIds, address  beneficiary) {

    }


    function getPrices(uint256[] memory _tokenIds)
    public view returns (uint256[] memory prices)
    {
        prices = new uint256[](_tokenIds.length);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            prices[i] = priceByTokenId[_tokenIds[i]] * rateMANAETH;
        }
        return prices;
    }

    function setRate(
        uint256 _rateMANAETH
    ) public onlyOwner {
        rateMANAETH = _rateMANAETH;
    }

    function setReferralPercent(
        uint256 _val
    ) public onlyOwner {
        require(referralPercent < 50, "referral Percent not correct");
        require(referralPercent >= 1, "referral Percent not correct");
        referralPercent = _val;
    }

    function setWallet(
        address payable _wallet
    ) public onlyOwner {
        walletStoredFunds = _wallet;
    }

    function setWalletStoredNFT(
        address payable _wallet
    ) public onlyOwner {
        walletStoredNFT = _wallet;
    }

    function addReferrals(
        address[] memory _referralList
    ) public onlyOwner {
        for (uint256 i = 0; i < _referralList.length; i++) {
            referralList.push(_referralList[i]);
        }
    }
}
