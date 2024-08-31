// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    uint256 public candidateCount;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 candidateId;
        string voterName;
    }

    // Mapping para almacenar los candidatos
    mapping(uint256 => Candidate) public candidates;

    // Mapping para almacenar la información de los votantes
    mapping(address => Voter) public voters;

    // Arreglo para almacenar las direcciones de los votantes
    address[] public voterAddresses;

    // Evento para registrar la adición de un candidato
    event CandidateAdded(uint256 id, string name);

    // Evento para registrar un voto
    event Voted(address voter, uint256 candidateId, string voterName);

    // Modificador para restringir el acceso a solo el propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el duenio del contrato puede realizar esta accion.");
        _;
    }

    // Constructor que establece al dueño del contrato
    constructor() {
        owner = msg.sender;
        candidateCount = 0;
    }

    // Función para agregar un candidato, solo accesible por el dueño
    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "El nombre del candidato no puede estar vacio.");
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        emit CandidateAdded(candidateCount, _name);
    }

    // Función para votar por un candidato
    function vote(uint256 _candidateId, string memory _voterName) public {
        require(!voters[msg.sender].hasVoted, "Ya has votado.");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Candidato no valido.");
        require(bytes(_voterName).length > 0, "El nombre del votante no puede estar vacio.");

        voters[msg.sender] = Voter(true, _candidateId, _voterName);
        voterAddresses.push(msg.sender);
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId, _voterName);
    }

    // Función para obtener el conteo de votos de un candidato
    function getVotes(uint256 _candidateId) public view returns (uint256) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Candidato no valido.");
        return candidates[_candidateId].voteCount;
    }

    // Función para obtener la lista de votantes y el candidato al que votaron
    function getVoters() public view returns (address[] memory, uint256[] memory, string[] memory) {
        uint256 length = voterAddresses.length;
        uint256[] memory candidateIds = new uint256[](length);
        string[] memory voterNames = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            address voterAddress = voterAddresses[i];
            candidateIds[i] = voters[voterAddress].candidateId;
            voterNames[i] = voters[voterAddress].voterName;
        }

        return (voterAddresses, candidateIds, voterNames);
    }
}