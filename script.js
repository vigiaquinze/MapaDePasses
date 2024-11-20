document.addEventListener("DOMContentLoaded", () => {
    let time1 = "Time Azul";
    let time2 = "Time Vermelho";

    // Adiciona título e descrição fora do campo, no topo
    const header = d3.select("body").append("div")
        .attr("class", "title")
        .style("text-align", "center")
        .style("margin-bottom", "30px");

    // Título com os nomes dos times
    const title = header.append("h1")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text(`${time1} x ${time2}`);

    // Descrição
    const description = header.append("p")
        .style("font-size", "16px")
        .text("Mapa de passes na partida");

    // Adiciona a legenda com a cor dos times ao lado do nome
    const legendContainer = header.append("div")
        .style("margin-top", "20px")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center");

    // Caixa azul para o Time 1
    legendContainer.append("div")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color", "blue")
        .style("margin-right", "10px");
    legendContainer.append("span")
        .style("font-size", "16px")
        .text(time1);

    // Caixa vermelha para o Time 2
    legendContainer.append("div")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color", "red")
        .style("margin-left", "20px")
        .style("margin-right", "10px");
    legendContainer.append("span")
        .style("font-size", "16px")
        .text(time2);

    // Configurações do SVG
    const svg = d3.select("#field")
        .attr("width", 1200)
        .attr("height", 800)
        .style("background", "green");

    // Adiciona os inputs para alterar os nomes dos times abaixo do campo
    const inputContainer = d3.select("body").append("div")
        .style("text-align", "center")
        .style("margin-top", "20px");

    // Input para o Time 1
    inputContainer.append("label")
        .text("Nome do Time 1: ")
        .style("font-size", "14px")
        .style("margin-right", "10px");

    const inputTime1 = inputContainer.append("input")
        .attr("type", "text")
        .attr("value", time1)
        .style("font-size", "14px")
        .on("input", () => {
            time1 = inputTime1.node().value;
            title.text(`${time1} x ${time2}`);
            legendContainer.selectAll("span").text(`${time1} x ${time2}`);
        });

    // Input para o Time 2
    inputContainer.append("label")
        .text(" Nome do Time 2: ")
        .style("font-size", "14px")
        .style("margin-left", "10px");

    const inputTime2 = inputContainer.append("input")
        .attr("type", "text")
        .attr("value", time2)
        .style("font-size", "14px")
        .on("input", () => {
            time2 = inputTime2.node().value;
            title.text(`${time1} x ${time2}`);
            legendContainer.selectAll("span").text(`${time1} x ${time2}`);
        });

    // Jogadores e suas configurações
    const players = [
        { id: 1, team: 1, x: 100, y: 400, name: "GK", number: 1, interactions: 0 },
        { id: 2, team: 1, x: 300, y: 300, name: "ZAG", number: 3, interactions: 0 },
        { id: 3, team: 1, x: 300, y: 500, name: "ZAG", number: 4, interactions: 0 },
        { id: 4, team: 1, x: 400, y: 400, name: "MC", number: 10, interactions: 0 },
        { id: 5, team: 1, x: 500, y: 200, name: "ALA", number: 2, interactions: 0 },
        { id: 6, team: 1, x: 500, y: 600, name: "ALA", number: 6, interactions: 0 },
        { id: 7, team: 1, x: 550, y: 400, name: "CA", number: 9, interactions: 0 },
        { id: 8, team: 2, x: 650, y: 400, name: "CA", number: 9, interactions: 0 },
        { id: 9, team: 2, x: 700, y: 600, name: "ALA", number: 3, interactions: 0 },
        { id: 10, team: 2, x: 700, y: 200, name: "ALA", number: 6, interactions: 0 },
        { id: 11, team: 2, x: 800, y: 400, name: "MC", number: 10, interactions: 0 },
        { id: 12, team: 2, x: 900, y: 300, name: "ZAG", number: 3, interactions: 0 },
        { id: 13, team: 2, x: 900, y: 500, name: "ZAG", number: 4, interactions: 0 },
        { id: 14, team: 2, x: 1100, y: 400, name: "GK", number: 1, interactions: 0 }
    ];

    let selectedPlayer = null;
    const links = [];

    const playerGroups = svg.selectAll(".player")
        .data(players)
        .enter()
        .append("g")
        .attr("class", "player")
        .attr("transform", d => `translate(${d.x}, ${d.y})`)
        .call(
            d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        )
        .on("click", (event, player) => registerPass(player))
        .on("contextmenu", (event, player) => {
            event.preventDefault();
            editPlayer(event, player);
        });

    // Adiciona círculos dos jogadores
    const playerCircles = playerGroups.append("circle")
        .attr("r", d => 10 + d.interactions * 2)
        .attr("fill", d => (d.team === 1 ? "blue" : "red"))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    const numberTexts = playerGroups.append("text")
        .attr("dy", 4)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(d => d.number);

    const nameTexts = playerGroups.append("text")
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "14px")
        .text(d => d.name);

    function dragstarted(event, d) {
        d3.select(this).raise().select("circle").attr("stroke", "red");
    }

    function dragged(event, d) {
        d.x = event.x;
        d.y = event.y;

        d3.select(this)
            .attr("transform", `translate(${d.x}, ${d.y})`);
    }

    function dragended(event, d) {
        d3.select(this).select("circle").attr("stroke", "black");
    }

    function registerPass(player) {
        if (selectedPlayer && selectedPlayer.id !== player.id) {
            let link = links.find(
                l => (l.source === selectedPlayer && l.target === player) ||
                     (l.source === player && l.target === selectedPlayer)
            );

            if (link) {
                link.weight += 1;
            } else {
                link = { source: selectedPlayer, target: player, weight: 1 };
                links.push(link);
            }

            player.interactions += 1;
            updateLinks();
            updatePlayerCircles();
            selectedPlayer = null;
        } else {
            selectedPlayer = player;
        }
    }

    function updateLinks() {
        const linkSelection = svg.selectAll(".link")
            .data(links, d => `${d.source.id}-${d.target.id}`);

        linkSelection.enter()
            .append("line")
            .attr("class", "link")
            .merge(linkSelection)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", d => (d.source.team === 1 ? "blue" : "red"))
            .attr("stroke-opacity", d => Math.min(0.2 + d.weight * 0.1, 1))
            .attr("stroke-width", d => d.weight);

        linkSelection.exit().remove();
    }

    function updatePlayerCircles() {
        playerCircles
            .attr("r", d => 10 + d.interactions * 2);
    }

    function editPlayer(event, player) {
        event.preventDefault(); // Previne o menu de contexto padrão em dispositivos PC
    
        showEditFields(player);
    }
    
    // Função que exibe os campos de edição (nome e número)
    function showEditFields(player) {
        const playerGroup = d3.select(this); // Referência ao grupo do jogador clicado
    
        // Exibe o campo de edição para o nome do jogador
        const nameInput = playerGroup.selectAll(".name-input")
            .data([player])
            .enter().append("foreignObject")
            .attr("class", "name-input")
            .attr("x", -30)
            .attr("y", 25)
            .attr("width", 60)
            .attr("height", 20)
            .append("xhtml:input")
            .attr("type", "text")
            .attr("value", player.name)
            .style("width", "100%")
            .style("font-size", "14px")
            .on("blur", function() {
                player.name = this.value;
                playerGroup.select("text.name").text(player.name); // Atualiza o texto do nome
                this.remove(); // Remove o campo de entrada após a edição
            });
    
        // Exibe o campo de edição para o número do jogador
        const numberInput = playerGroup.selectAll(".number-input")
            .data([player])
            .enter().append("foreignObject")
            .attr("class", "number-input")
            .attr("x", -10)
            .attr("y", -15)
            .attr("width", 30)
            .attr("height", 20)
            .append("xhtml:input")
            .attr("type", "text")
            .attr("value", player.number)
            .style("width", "100%")
            .style("font-size", "14px")
            .on("blur", function() {
                player.number = this.value;
                playerGroup.select("text.number").text(player.number); // Atualiza o texto do número
                this.remove(); // Remove o campo de entrada após a edição
            });
    }
    
    // Função para configurar os eventos de edição de jogador (click ou touch)
    function setupPlayerEvents() {
        const playerGroups = svg.selectAll(".player")
            .data(players)
            .enter()
            .append("g")
            .attr("class", "player")
            .attr("transform", d => `translate(${d.x}, ${d.y})`)
            .call(
                d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
            );
    
        playerGroups
            .on("contextmenu", function(event, player) {
                // Chama a função de edição para o clique direito
                editPlayer(event, player);
            })
            .on("click", function(event, player) {
                // Edição com clique simples (PC e Mobile)
                editPlayer(event, player);
            });
    
        playerGroups
            .on("touchstart", function(event, player) {
                const touchDuration = 1000; // 1 segundo de toque longo para ativar edição
                const timer = setTimeout(() => {
                    // Inicia a edição após o toque longo
                    showEditFields(player);
                }, touchDuration);
    
                // Cancela o temporizador caso o toque seja liberado rapidamente
                d3.select(this).on("touchend", () => clearTimeout(timer));
            });
    }      
});
