const contractAddress = "0xf3D3877f6d7e467032c909C283a4E601C59AAB04";
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "CandidateAdded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_voterName",
                "type": "string"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "voterName",
                "type": "string"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "candidateCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVoters",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "getVotes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "voterAddresses",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voters",
        "outputs": [
            {
                "internalType": "bool",
                "name": "hasVoted",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "voterName",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider;
let signer;
let contract;
let ownerAddress;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Get connected wallet address
        const walletAddress = await signer.getAddress();
        document.getElementById('walletAddress').textContent = walletAddress;

        // Get contract owner
        ownerAddress = await contract.owner();
        document.getElementById('contractOwner').textContent = ownerAddress;

        // Show wallet info
        document.getElementById('walletInfo').classList.remove('hidden');

        alert("Wallet connected successfully!");
    } else {
        alert("Please install MetaMask!");
    }
}

async function addCandidate() {
    const candidateName = document.getElementById('candidateName').value;
    if (!candidateName) {
        alert("Please enter a candidate name.");
        return;
    }

    const statusIndicator = document.getElementById('addCandidateStatus');
    statusIndicator.classList.remove('hidden');

    try {
        const tx = await contract.addCandidate(candidateName);
        await tx.wait();
        alert("Candidate added successfully!");
    } catch (error) {
        console.error(error);
        alert("Error adding candidate.");
    } finally {
        statusIndicator.classList.add('hidden');
    }
}

async function vote() {
    const voterName = document.getElementById('voterName').value;
    const candidateId = document.getElementById('candidateId').value;

    if (!voterName || !candidateId) {
        alert("Please fill in all fields.");
        return;
    }

    const statusIndicator = document.getElementById('voteStatus');
    statusIndicator.classList.remove('hidden');

    try {
        const tx = await contract.vote(candidateId, voterName);
        await tx.wait();
        alert("Vote cast successfully!");
    } catch (error) {
        console.error(error);
        alert("Error casting vote.");
    } finally {
        statusIndicator.classList.add('hidden');
    }
}

async function getVoters() {
    const statusIndicator = document.getElementById('votersStatus');
    statusIndicator.classList.remove('hidden');

    try {
        const [addresses, candidateIds, names] = await contract.getVoters();
        const votersList = document.getElementById('votersList');
        votersList.innerHTML = "";

        addresses.forEach((address, index) => {
            const voterItem = document.createElement('div');
            voterItem.className = "p-2 border-b border-gray-200";
            voterItem.textContent = `Voter: ${names[index]} (Address: ${address}) voted for Candidate ID: ${candidateIds[index]}`;
            votersList.appendChild(voterItem);
        });
    } catch (error) {
        console.error(error);
        alert("Error fetching voters.");
    } finally {
        statusIndicator.classList.add('hidden');
    }
}
