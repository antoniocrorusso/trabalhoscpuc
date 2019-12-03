var contractAddress = "0x2DD034a25a9926038966b1ec735175ba320B704B";
var provider = new ethers.providers.Web3Provider(web3.currentProvider);
ethereum.enable();
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
        alert("Depois de dar a permissão, iremos recarregar a página.");
        err.wait();
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
        console.log("Confirmar Compra - Transação ", tx);   
        boxCommStatus.innerHTML = "Transação enviada, esperando pelo resultado...";
        tx.wait()
        .then( (resultFromContract) => {
            console.log("Pagamento feito - o pagamento foi de: ", resultFromContract);
            valorNoContrato();
            boxCommStatus.innerHTML = "Transação executada.";
        })        
        .catch( (err) => {
            console.error("Confirmar Compra - after tx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })
    .catch( (err) => {
        console.error("executePayment - tx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Algo deu errado: " + err.message;
    })
}

function confirmarEntrega() {
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Enviando a Confirmação..."
    contract.confirmarEntrega()
    .then( (dx) => {
        console.log("Confirmar Entrega - transação", dx);
        boxCommStatus.innerHTML = "Solicitação enviada, aguardando resultado...";
        dx.wait()
        .then( (resultFromContract) => {
            console.log("Confirmar Entrega - Entrega Confirmada", resultFromContract);
            boxCommStatus.innerHTML = "Entrega Confirmada";
        })
        .catch( (err) => {
            console.error("Confirmar Entrega - after dx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })    
    .catch( (err) => {
        console.error("Confirmar Entrega - dx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Algo deu errado: " + err.message;
    })      
}

function desistir() {
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Enviando a Solicitação..."
    contract.desistir()
    .then( (gx) => {
        console.log("Desistência - transação", gx);
        boxCommStatus.innerHTML = "Solicitação enviada, aguardando resultado...";
        gx.wait()
        .then( (resultFromContract) => {
            console.log("Desistência - desistencia Confirmada", resultFromContract);
            boxCommStatus.innerHTML = "Desistência Confirmada, reembolso efetuado.";
        })
        .catch( (err) => {
            console.error("Desistência - after gx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })    
    .catch( (err) => {
        console.error("Desistência - gx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Algo deu errado: " + err.message;
    })      
}

function receber() {
    var boxCommStatus = document.getElementById("boxCommStatus");
    boxCommStatus.innerHTML = "Enviando a Solicitação..."
    contract.receber()
    .then( (rx) => {
        console.log("Receber pagamento - transação", rx);
        boxCommStatus.innerHTML = "Solicitação enviada, aguardando resultado...";
        rx.wait()
        .then( (resultFromContract) => {
            console.log("Receber pagamento - desistencia Confirmada", resultFromContract);
            boxCommStatus.innerHTML = "Pagamento recebido com sucesso.";
        })
        .catch( (err) => {
            console.error("Receber pagamento - after rx being mint");
            console.error(err);
            boxCommStatus.innerHTML = "Algo saiu errado: " + err.message;
        })
    })    
    .catch( (err) => {
        console.error("Desistência - rx has been sent");
        console.error(err);
        boxCommStatus.innerHTML = "Algo deu errado: " + err.message;
    })      
}

function valorContrato() {
    var status;
    var campoValor = document.getElementById("campoValor");     
    contract.valor()
    .then( (result) => {
        campoValor.innerHTML = result;
    })
    .catch( (err) => {
        console.error(err);
        campoValor.innerHTML = err;
    });
}

function estadoDoContrato() {
    var status;
    var campoStatus = document.getElementById("campoStatus");     
    contract.estadoDoContrato()
    .then( (result) => {
        campoStatus.innerHTML = result;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
}
