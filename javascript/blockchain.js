var contractAddress = "0xEdd56a750E72B4547221eA01A243eb649Fc0b737";
var provider = new ethers.providers.Web3Provider(web3.currentProvider);
var signer = provider.getSigner();
var contract = new ethers.Contract(contractAddress, contractAbi, signer);

function valorNoContrato() {    
    var boxBalance = document.getElementById("boxBalance");
    console.log("valorNoContrato - Enviando o pedido.");     
    contract.valorNoContrato()
    .then( (resultFromContract) => {
        console.log("valorNoContrato - o resultado é", resultFromContract);
        boxBalance.innerHTML = resultFromContract;
    })
    .catch( (err) => {
        console.error(err);
        alert("Uma tela irá aparecer pedindo para conectar com sua conta ethereum.\nPara proceder, dê essa permissão.\nCaso não tenha uma conta ethereum, crie uma usando o Metamask.");
        ethereum.enable();
        alert("Depois de dar a permissão, iremos recarregar a página.");
        document.location = "index.html";
    });
}

function confirmarCompra() {
    var amount = document.frmPayment.amount.value;
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Enviando a transação...";
    var additionalSettings = {
        value: ethers.utils.parseUnits(amount, 'wei')
    }; 
    contract.confirmarCompra(additionalSettings)
    .then( (tx) => {
        console.log("Confirmar Compra - Transaçãp ", tx);   
        boxCommStatus.innerHTML = "Transação enviada, esperando pelo resultado...";
        tx.wait()
        .then( (resultFromContract) => {
            console.log("pagamento - o resultado foi: ", resultFromContract);
            getContractBalance();
            boxCommStatus.innerHTML = "Transação executada.";
        })        
        .catch( (err) => {
            console.error("executePayment - after tx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })
    .catch( (err) => {
        console.error("executePayment - tx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Something went wrong: " + err.message;
    })
}