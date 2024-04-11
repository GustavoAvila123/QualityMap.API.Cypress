import Usuario from "../../fixtures/usuario";

const API_BASE_URL_USUARIOS = Cypress.env('API_BASE_URL_USUARIOS');
const API_BASE_URL_CARRINHOS = Cypress.env('API_BASE_URL_CARRINHOS');
const API_BASE_URL_LOGIN = Cypress.env('API_BASE_URL_LOGIN');
const API_BASE_URL_PRODUTOS = Cypress.env('API_BASE_URL_PRODUTOS');
const API_BASE_URL_CARRINHOS_CONCLUIRCOMPRA = Cypress.env('API_BASE_URL_CARRINHOS_CONCLUIRCOMPRA');
const API_BASE_URL_CARRINHOS_CANCELARCOMPRA = Cypress.env('API_BASE_URL_CARRINHOS_CANCELARCOMPRA');

let emailUsuarioCadastrado;
let senhaUsuarioCadastrado;
let acessToken;
let produtoId1;
let produtoId2;
let carrinhoId;

describe('Automação API - Carrinhos', () => {

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

    it('Cadastrar produtos', () => {
        const produtos = [
            {
                nome: Usuario.nomeProduto,
                preco: Usuario.preco,
                descricao: Usuario.descricao,
                quantidade: Usuario.quantidade
            },
            {
                nome: Usuario.nomeProduto2,
                preco: Usuario.preco,
                descricao: Usuario.descricao,
                quantidade: Usuario.quantidade
            }
        ];
    
        cy.wrap(produtos).each((produto, index) => {
            cy.request({
                method: 'POST',
                url: `${API_BASE_URL_PRODUTOS}`,
                headers: {
                    Authorization: acessToken
                },
                body: produto
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.message).to.eq("Cadastro realizado com sucesso");
                expect(response.body._id).to.match(/^\w+$/);
    
                if (index === 0) {
                    produtoId1 = response.body._id;
                } else if (index === 1) {
                    produtoId2 = response.body._id;
                }
            });
        });
    });

    it('Listar carrinhos cadastrados', () => {
        cy.request({
            method: 'GET',
            url: `${API_BASE_URL_CARRINHOS}`
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
    
            body.carrinhos.forEach((carrinho) => {
                carrinho.produtos.forEach((produto) => {
                    expect(produto.idProduto).to.match(/^\w+$/);
                    expect(Number(produto.quantidade)).to.be.a('number').above(0);
                    expect(produto.precoUnitario).to.be.a('number').above(0);
                });
    
                expect(carrinho.precoTotal).to.be.a('number').above(0);
                expect(Number(carrinho.quantidadeTotal)).to.be.a('number').above(0);
                expect(carrinho.idUsuario).to.match(/^\w+$/);
                expect(carrinho._id).to.match(/^\w+$/);
            });
        });
    });

    it('Cadastrar carrinho', () => {
        cy.request({
            method: 'POST',
            url: `${API_BASE_URL_CARRINHOS}`,
            headers: {
                Authorization: acessToken
            },
            body: {
                produtos: [
                    {
                        idProduto: produtoId1,
                        quantidade: Usuario.quantidade,
                    },
                    {
                        idProduto: produtoId2,
                        quantidade: Usuario.quantidade,
                    }                
                ]
            }
        }).should((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso");
            expect(response.body._id).to.match(/^\w+$/);
    
            carrinhoId = response.body._id;
        });
    });

    it('Buscar carrinho por ID', () => {
        cy.request({
            method: 'GET',
            url: `${API_BASE_URL_CARRINHOS}${carrinhoId}`
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body).to.have.property('produtos').to.be.an('array').that.is.not.empty;
            expect(body).to.have.property('precoTotal').that.is.a('number').greaterThan(0);
            expect(parseInt(body.quantidadeTotal)).to.be.a('number').greaterThan(0);
            expect(body).to.have.property('idUsuario').that.is.a('string').and.match(/^\w+$/);
            expect(body).to.have.property('_id').that.is.a('string').and.match(/^\w+$/);
    
            body.produtos.forEach((produto) => {
                expect(produto).to.have.property('idProduto').that.is.a('string').and.match(/^\w+$/);
                expect(parseInt(produto.quantidade)).to.be.a('number').greaterThan(0);
                expect(produto).to.have.property('precoUnitario').that.is.a('number').greaterThan(0);
            });
        });
    });

    it('Excluir carrinho', () => {
        cy.request({
            method: 'DELETE',
            url: `${API_BASE_URL_CARRINHOS_CONCLUIRCOMPRA}`,
            headers: {
                Authorization: acessToken
            },
        }).should((response) => {

            expect(response.status).to.eq(200);
            expect(response.body.message).to.match(/Registro excluído com sucesso|Não foi encontrado carrinho para esse usuário/);
        });
    });

    it('Excluir carrinho e retornar produtos para estoque', () => {
        cy.request({
            method: 'DELETE',
            url: `${API_BASE_URL_CARRINHOS_CANCELARCOMPRA}`,
            headers: {
                Authorization: acessToken
            },
        }).should((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.match(/Registro excluído com sucesso|Não foi encontrado carrinho para esse usuário/);
        });
    });



})