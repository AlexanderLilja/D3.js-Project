//TRACK WINDOW SIZE
window.watchResize(() => {


    //EMPTY CONTENT BEFORE RENDERING NEW 
    $('body').html('<div id="tooltip"></div>');


    //READ IN JSON FILE WITH PROMISE
    d3.json("facebookFriends.json").then((data) => {


        //SETTINGS CONTAINER    
        var settings = {
            color: "lightgrey",
            height: window.innerHeight,
            width: window.innerWidth,
            padding: 10,
            multiplier: 15,
            border: {
                color: '#2c3539',
                size: 2
            },
            font: {
                family: 'Open Sans',
                size: 15,
                color: 'red',
                weight: 600
            },
            distance: 10,
            collision: 6,
            colors: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC', '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933', '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
        }

        //CONTAINERS
        var nodes = [];
        var links = [];


        //LOOP THROUGH ALL ENTRIES
        for (let key in data.facebookFriends) {
            let name = data.facebookFriends[key].name
            let id = data.facebookFriends[key].FacebookID
            let friends = data.facebookFriends[key].friends


            //PUSH DATA TO NODES ARRAY
            nodes.push({
                'id': id,
                'name': name,
                'friends': friends.length
            })

            //LOOP THROUGH FRIENDS
            for (let i in friends) {
                let friend = friends[i].FriendId

                //PUSH DATA TO LINKS ARRAY
                links.push({
                    'source': id,
                    'target': friend
                })

            }
        }


        //GENERATE CANVAS
        var canvas = d3.select("body").append("svg")
            .attr("height", settings.height - (settings.padding * 2))
            .attr("width", settings.width - (settings.padding * 2))
            .style("background", settings.color)


        //SIMULATE LINKS AND NODES
        var simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(-40))
            .force("center", d3.forceCenter(settings.width / 2, settings.height / 2))
            .force("collision", d3.forceCollide().radius(settings.collision * settings.multiplier))
            .force("link", d3.forceLink().id((d) => {
                    return d.id;
                })
                .distance(settings.distance * settings.multiplier))

            //RENDER SIMULATION
            .on("tick", ticked)


        // VARIABLES TO STORE SPECIFIC ELEMENTS       
        var link = canvas.append("g").attr("class", "links").selectAll("link"),
            node = canvas.append("g").attr("class", "node").selectAll("node"),
            text = canvas.append("g").attr("class", "text").selectAll("text");

        //USING FORCE PROPERTIES ON LINKS AND NODES
        simulation.nodes(nodes)
        simulation.force("link").links(links);

        //Append links to each entry
        link = link.data(links)
            .enter().append("line");

        //Append nodes to each entry
        node = node.data(nodes)
            .enter().append("circle");

        //Append text to each entry
        text = text.data(nodes)
            .enter().append("text");

        //Draw the links and nodes etc
        function ticked() {

        //USING FORCE PROPERTIES ON LINKS AND NODES
        simulation.nodes(nodes)
        simulation.force("link").links(links);

            //Properties for links
            link.attr("x1", (d) => {
                    return d.source.x;
                })
                .attr("y1", (d) => {
                    return d.source.y;
                })
                .attr("x2", (d) => {
                    return d.target.x;
                })
                .attr("y2", (d) => {
                    return d.target.y;
                })
                .attr("stroke", settings.border.color)
                .attr("stroke-width", settings.border.size)
                .style("pointer-events", "none");


            //Properties for nodes    
            node.attr('r', (d) => {
                    return d.friends * settings.multiplier
                })
                .attr('cx', (d) => {
                    return d.x;
                })
                .attr('cy', (d) => {
                    return d.y;
                })
                .attr("stroke", settings.border.color)
                .attr("stroke-width", settings.border.size)
                .attr("fill", (d, i) => { return settings.colors[i];})

                // MOUSEOVER TOOLTIP PROPERTIES
                .on('mouseover', function(d) {
                    $('#tooltip').html(d.name + ' (' + d.friends + ')')
                    $('#tooltip').css('left', d3.event.pageX - ($('#tooltip').width() / 1.5) + 'px')
                    $('#tooltip').css('top', d3.event.pageY + 20 + 'px')
                    $('#tooltip').css('opacity', 1)
                })

                 // MOUSEOUT
                .on('mouseout', function () {
                    $('#tooltip').css('opacity', 0)
                })

            //Properties for text
            text.attr('dx', (d) => {
                    return d.x;
                })
                .attr('dy', (d) => {
                    return d.y + 5;
                })
                .text((d) => {
                    return d.name[0];
                })
                .style("font-size", settings.font.size)
                .style("font-weight",settings.font.weight)
                .style("text-anchor", "middle")
                .style("pointer-events", "none");


        }



    });
});