import Usuario from "../../fixtures/usuario";

const API_BASE_URL_USUARIOS = Cypress.env('API_BASE_URL_USUARIOS');
const API_BASE_URL_PRODUTOS = Cypress.env('API_BASE_URL_PRODUTOS');
const API_BASE_URL_LOGIN = Cypress.env('API_BASE_URL_LOGIN');

let emailUsuarioCadastrado;
let senhaUsuarioCadastrado;
let acessToken;
let produtoId;

describe('Automação API - Produtos', () => {

it('Cadastrar usuário', () => {
    cy.request({
        method: 'POST',
        url: `${API_BASE_URL_USUARIOS}`,
        body: {
            nome: Usuario.nome,
            email: Usuario.email,
            password: Usuario.senha,
            administrador: "true"
        }
    }).should((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Cadastro realizado com sucesso");
        expect(response.body._id).to.match(/^\w+$/);

        emailUsuarioCadastrado = Usuario.email,
        senhaUsuarioCadastrado = Usuario.senha
    });
});

it('Realizar login', () => {
    cy.request({
        method: 'POST',
        url: `${API_BASE_URL_LOGIN}`,        
        body: {
            email: emailUsuarioCadastrado,
            password: senhaUsuarioCadastrado
        }

    }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Login realizado com sucesso");
        expect(response.body.authorization).to.match(/^Bearer\s/);

        acessToken = response.body.authorization;
    });
});

it('Listar produtos cadastrados', () => {
    cy.request({
        method: 'GET',
        url: `${API_BASE_URL_PRODUTOS}`
    }).should(({status, body}) => {
        const {nome, preco, descricao, quantidade, _id} = body.produtos[0];

        expect(status).to.eq(200);
        expect(nome).to.not.be.empty;
        expect(preco).to.match(/^\d+$/);
        expect(descricao).to.not.be.empty;
        expect(quantidade).to.match(/^\d+$/);
        expect(_id).to.match(/^\w+$/);
    });
});

it('Cadastrar produto', () => {
    cy.request({
        method: 'POST',
        url: `${API_BASE_URL_PRODUTOS}`,
        headers: {
            Authorization: acessToken
        },
        body: {
            nome: Usuario.nomeProduto,
            preco: Usuario.preco,
            descricao: Usuario.descricao,
            quantidade: Usuario.quantidade
        }
    }).should((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq("Cadastro realizado com sucesso");
        expect(response.body._id).to.match(/^\w+$/);

        produtoId = response.body._id;
    });
});

it('Buscar produto por ID', () => {
    cy.request({
        method: 'GET',
        url: `${API_BASE_URL_PRODUTOS}${produtoId}`
    }).should(({status, body}) => {
        const {nome, preco, descricao, quantidade, _id} = body;

        expect(status).to.eq(200);
        expect(nome).to.not.be.empty;
        expect(preco).to.match(/^\d+$/);
        expect(descricao).to.not.be.empty;
        expect(quantidade).to.match(/^\d+$/);
        expect(_id).to.match(/^\w+$/);
    });
});

it('Editar produto', () => {
    cy.request({
        method: 'PUT',
        url: `${API_BASE_URL_PRODUTOS}${produtoId}`,
        headers: {
            Authorization: acessToken
        },
        body: {
            nome: Usuario.nomeProduto,
            preco: Usuario.preco,
            descricao: Usuario.descricao,
            quantidade: Usuario.quantidade
        }
    }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Registro alterado com sucesso");
    });
});

it('Excluir produto', () => {
    cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL_PRODUTOS}${produtoId}`,
        headers: {
            Authorization: acessToken
        },
    }).should((response) => {

        expect(response.status).to.eq(200);
        expect(response.body.message).to.match(/Registro excluído com sucesso|Nenhum registro excluído/);
    });
});


})