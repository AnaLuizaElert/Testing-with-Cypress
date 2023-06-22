describe('template spec', () => {
  it('passes', () => {
    cy.visit("http://127.0.0.1:5500/index.html")
  })

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
  })

  it('player working', () => {
    // Questão 1 -  Verificar se o reprodutor de vídeo está visível 
    // quando um vídeo é selecionado na lista de vídeos.
    cy.get('.thumbnail').should('be.visible').first().click();
    cy.get('#videoPlayer').should('be.visible');

    //Questão 2 -  Testar se o vídeo começa a ser reproduzido quando
    // um vídeo é selecionado.
    cy.get('#videoPlayer').should('not.have.prop', "paused", true);

    //Questão 3 - Testar os controles do reprodutor de vídeo.
    // Verifique se o vídeo pausa quando o botão de pausa é clicado e
    // se retoma quando o botão de play é clicado.
    cy.get('#videoPlayer').then(($videoPlayer) => {
      $videoPlayer[0].pause()
    }).should('not.have.prop', "paused", false)

    //Questão 4 - Verificar se a barra de progresso está funcionando 
    // corretamente, mostrando o progresso conforme o vídeo avança.
    cy.get('#videoPlayer').then(($videoPlayer) => {
        const videoElement = $videoPlayer.get(0)
        const progressBar = Cypress.$('#videoPlayer')

        cy.wrap(videoElement).should('have.prop', 'currentTime').and('be.gte', 0)

        cy.wait(1000)

        cy.get(progressBar).should(($progressBar) => {
            const currentTime = $progressBar.prop('currentTime')
            const duration = $progressBar.prop('duration')
            const progressPercentage = (currentTime / duration) * 100

            expect(progressPercentage).to.be.greaterThan(0)
        })
    })



  })

  it('videos list', () => {
    //Questão 1 - Verificar se a lista de vídeos é renderizada corretamente na tela inicial.
    cy.get('.video-thumbnail').find('img');
    cy.get('.video-thumbnail').find('div');
    
    cy.get('#videoList .video-thumbnail').should('have.length', 2);

    //Questão 2 - Verificar se um vídeo começa a ser reproduzido quando é selecionado na lista de vídeos.
    // Verificado na  questão 2 do it "player working"

    //Questão 3 - Verificar se a miniatura e o título de cada vídeo são exibidos corretamente na lista.
    cy.get('.video-thumbnail').first().contains('Big Buck Bunny');
    cy.get('.thumbnail').first().should('have.attr', 'src', 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217')

    cy.get('.video-thumbnail').last().contains('Elephants Dream');
    cy.get('.thumbnail').last().should('have.attr', 'src', 'https://peach.blender.org/wp-content/uploads/bbb-splash.png')

  })

  it('Search video', () => {
    // Questão 1 - Testar a funcionalidade de pesquisa inserindo uma palavra-chave e verificando
    // se a lista de vídeos é filtrada corretamente.
    cy.get('#search').type("Big Buck Bunny");
    cy.get('.btn-primary').click();
    cy.get('#videoList').find('.video-thumbnail').find('div').contains('Big Buck Bunny')

    // Questão 2 -Verificar se a filtragem funciona corretamente ao pressionar Enter.
    //Verificado na questão anterior!
  })

  it('Comment', () => {
    // Questão 1 -  Verificar se a seção de comentários está visível quando um vídeo está sendo reproduzido.
    cy.get('.thumbnail').first().click();
    cy.get('#commentSection').should('be.visible');


    // Questão 2 - Testar a funcionalidade de postagem de comentários. Verifique se um novo comentário
    // é adicionado à lista de comentários quando o usuário insere um comentário e pressiona Enter.
    cy.get('#commentSection').find("#commentInput").type("Comentário{enter}");
    cy.get("#comments").contains("Comentário");

    //Questão 3 - Verificar se a data e a hora são exibidas corretamente para cada comentário.
    cy.get('#commentSection').find("#commentInput").type("Comentário{enter}");
    cy.clock();

    let now = new Date();
    let month = parseInt(now.getMonth() + 1);
    let minute = now.getMinutes();
    if(month < 10){
      month = '0' + month;
    }
    if(minute < 10){
      minute = '0' + minute;
    }

    let date_time = now.getDate() + "/" + 
      month + "/" + now.getFullYear() + " " + 
      now.getHours() + ":" + minute + ":" + 
      now.getSeconds();

    cy.get('#comments').find('p').find('strong').contains(date_time);    
  })

  it('Cont visualizations', () => {
    // Verificar se o contador de visualizações incrementa cada vez que um vídeo é reproduzido.
    cy.get('#search').type("Big Buck Bunny");

    cy.get('.btn-primary').click();
    cy.get('#videoList').find('.thumbnail').click();
    cy.get('#viewCount').contains('1');
    
    cy.get('.btn-primary').click();
    cy.get('#videoList').find('.thumbnail').click();
    cy.get('#viewCount').contains('2');
    
    cy.get('.btn-primary').click();
    cy.get('#videoList').find('.thumbnail').click();
    cy.get('#viewCount').contains('3');
  })

})