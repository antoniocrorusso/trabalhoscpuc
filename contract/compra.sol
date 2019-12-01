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

    function desistir()public apenasComprador noEstado(Estado.Confirmado) returns(bool) {
        emit Desistencia();
        estado = Estado.Inativo;
        comprador.transfer(address(this).balance);
        return true;
    }

    function confirmarCompra() public noEstado(Estado.Compra) payable apenasComprador returns(bool) {
        require(msg.value == valor, "Valor incorreto.");
        emit CompraConfirmada();
        estado = Estado.Confirmado;
        return true;
    }

    function confirmarEntrega() public apenasComprador noEstado(Estado.Confirmado) returns(bool) {
        emit ObjetoEntregue();
        estado = Estado.Entregue;
        return true;
    }
    
    function receber() public apenasVendedor noEstado(Estado.Entregue) returns(bool) {
        require(address(this).balance > 0, "Não há valores nesse Contrato.");
        vendedor.transfer(address(this).balance);
        estado = Estado.Inativo;
        return true;
    }
    
    function valorNoContrato() public view returns(uint256) {
        return address(this).balance;
    }
}
