import Usuario from "../../fixtures/usuario";

const API_BASE_URL_USUARIOS = Cypress.env('API_BASE_URL_USUARIOS');
let userId;

describe('Automação API - Usuários', () => {

it('Listar usuários cadastrados', () => {
    cy.request({
        method: 'GET',
        url: `${API_BASE_URL_USUARIOS}`
    }).should(({status, body}) => {
        const {nome, email, password, administrador, _id} = body.usuarios[0];

        expect(status).to.eq(200);
        expect(nome).to.not.be.empty;
        expect(email).to.match(/^\S+@\S+\.\S+$/);
        expect(password).to.not.be.empty;
        expect(administrador).to.match(/true/i);
        expect(_id).to.match(/^\w+$/);
    });
});

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

        userId = response.body._id;
    });
});

it('Buscar usuário por ID', () => {
    cy.request({
        method: 'GET',
        url: `${API_BASE_URL_USUARIOS}${userId}`
    }).should(({status, body}) => {
        const {nome, email, password, administrador, _id} = body;

        expect(status).to.eq(200);
        expect(nome).to.not.be.empty;
        expect(email).to.match(/^\S+@\S+\.\S+$/);
        expect(password).to.not.be.empty;
        expect(administrador).to.match(/true/i);
        expect(_id).to.eq(userId);
    });
});

it('Editar usuário', () => {
    cy.request({
        method: 'PUT',
        url: `${API_BASE_URL_USUARIOS}${userId}`,
        body: {
            nome: Usuario.nome,
            email: Usuario.email,
            password: Usuario.senha,
            administrador: "true"
        }
    }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq("Registro alterado com sucesso");
        expect(response.body._id).to.match(/^\w+$/);
    });
});

it('Excluir usuário', () => {
    cy.request({
        method: 'DELETE',
        url: `${API_BASE_URL_USUARIOS}${userId}`
    }).should((response) => {

        expect(response.status).to.eq(200);
        expect(response.body.message).to.match(/Registro excluído com sucesso|Nenhum registro excluído/);
    });
});

})

