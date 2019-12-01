pragma solidity 0.5.13;

contract Compra {
    uint256 public valor;
    address payable public vendedor;
    address payable public comprador;
    
    enum Estado { Compra, Confirmado, Entregue, Inativo }
    Estado public estado;

    constructor(
        address payable _contaComprador,
        uint256 _valor
        ) public payable {
        vendedor = msg.sender;
        comprador = _contaComprador;
        valor = _valor;
        estado = Estado.Compra;
    }

    modifier apenasComprador() {
        require(msg.sender == comprador, "Apenas o comprador pode realizar essa operação.");
        _;
    }

    modifier apenasVendedor() {
        require(msg.sender == vendedor, "Apenas o vendedor pode realizar essa operação.");
        _;
    }

    modifier noEstado(Estado _estado) {
        require(estado == _estado, "Estado Inválido.");
        _;
    }

    event Desistencia();
    event CompraConfirmada();
    event ObjetoEntregue();

    function desistir()public apenasComprador noEstado(Estado.Confirmado) {
        emit Desistencia();
        estado = Estado.Inativo;
        comprador.transfer(address(this).balance);
    }

    function confirmarCompra() public noEstado(Estado.Compra) payable apenasComprador {
        require(msg.value == valor, "Valor incorreto.");
        emit CompraConfirmada();
        estado = Estado.Confirmado;
        
    }

    function confirmarEntrega() public apenasComprador noEstado(Estado.Confirmado) {
        emit ObjetoEntregue();
        estado = Estado.Entregue;
    }
    
    function receber() public apenasVendedor noEstado(Estado.Entregue) {
        vendedor.transfer(address(this).balance);
        estado = Estado.Inativo;
    }
    
    function valorNoContrato() public view returns(uint256) {
        return address(this).balance;
    }
    
    function encerrarContrato() public noEstado(Estado.Inativo) apenasVendedor {
         selfdestruct(vendedor);
    }
}
