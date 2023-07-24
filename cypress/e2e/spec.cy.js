/// <reference types="Cypress" />

describe('Requisições de Férias ou Folgas', () => {
  const LOREM_150 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
    'Fusce non dapibus urna. Ut sed justo id mi posuere tempus ut in urna. In ut dictum urna odio.'

  beforeEach(() => {
    cy.visit('https://jr-qa.fuerza.space', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.intercept({
      method: 'PATCH',
      url: 'https://admin.qa.fuerza.space/api/collections/vacation_requests/records/4gfvkqfhj4ntneu'
    }).as('reqAprovarReprovar')
  })

  it('tem título na página', () => {
    cy.title().should('contain', 'Fuerza Space')
  })

  context('Aprovar', () => {
    it('aprovar primeira solicitação escrevendo mensagens', () => {
      cy.get('tbody > tr').first().find('button').first().click()
      cy.get('#message_collaborator').invoke('val', LOREM_150)
      cy.get('#message_manager').type(LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq(LOREM_150)
        expect(response.body.message_manager).to.eq(LOREM_150)
        expect(response.body.status).to.eq('APPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'APPROVED')
    })

    it('aprovar primeira solicitação escrevendo para colaborador', () => {
      cy.get('tbody > tr').first().find('button').first().click()
      cy.get('#message_collaborator').invoke('val', LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq(LOREM_150)
        expect(response.body.message_manager).to.eq('')
        expect(response.body.status).to.eq('APPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'APPROVED')
    })

    it('aprovar primeira solicitação escrevendo para gestor', () => {
      cy.get('tbody > tr').first().find('button').first().click()
      cy.get('#message_manager').invoke('val', LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq('')
        expect(response.body.message_manager).to.eq(LOREM_150)
        expect(response.body.status).to.eq('APPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'APPROVED')
    })

    it('aprovar primeira solicitação sem mensagens', () => {
      cy.get('tbody > tr').first().find('button').first().click()
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq('')
        expect(response.body.message_manager).to.eq('')
        expect(response.body.status).to.eq('APPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'APPROVED')
    })
  })

  context('Reprovar', () => {
    it('reprovar primeira solicitação escrevendo mensagens', () => {
      cy.get('tbody > tr').first().find('button').last().click()
      cy.get('#message_collaborator').invoke('val', LOREM_150)
      cy.get('#message_manager').type(LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq(LOREM_150)
        expect(response.body.message_manager).to.eq(LOREM_150)
        expect(response.body.status).to.eq('REPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'REPROVED')
    })

    it('reprovar primeira solicitação escrevendo para colaborador', () => {
      cy.get('tbody > tr').first().find('button').last().click()
      cy.get('#message_collaborator').invoke('val', LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq(LOREM_150)
        expect(response.body.message_manager).to.eq('')
        expect(response.body.status).to.eq('REPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'REPROVED')
    })

    it('reprovar primeira solicitação escrevendo para gestor', () => {
      cy.get('tbody > tr').first().find('button').last().click()
      cy.get('#message_manager').invoke('val', LOREM_150)
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq('')
        expect(response.body.message_manager).to.eq(LOREM_150)
        expect(response.body.status).to.eq('REPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'REPROVED')
    })

    it('reprovar primeira solicitação sem mensagens', () => {
      cy.get('tbody > tr').first().find('button').last().click()
      cy.get('form').find('button[type="submit"]').click()
      cy.wait('@reqAprovarReprovar').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body.message_collaborator).to.eq('')
        expect(response.body.message_manager).to.eq('')
        expect(response.body.status).to.eq('REPROVED')
      })
      cy.get('tbody > tr').first().children('td').eq(2).should('contain', 'REPROVED')
    })
  })

  context('Console', () => {
    it('sem erro no console', () => {
      cy.get('@consoleError').should('have.callCount', 0)
    })
  })

})